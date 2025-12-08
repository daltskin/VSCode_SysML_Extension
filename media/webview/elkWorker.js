/*
 * Web worker that offloads ELK layout calculations so the webview UI thread
 * stays responsive even when large graphs are processed.
 */
let elkInstance = null;
let isInitialized = false;

function ensureElkInitialized(elkUri) {
  if (isInitialized) {
    return;
  }
  if (!elkUri) {
    throw new Error('ELK worker missing elkUri during initialization');
  }
  importScripts(elkUri);
  if (typeof ELK !== 'function') {
    throw new Error('ELK library failed to load inside worker');
  }
  elkInstance = new ELK();
  isInitialized = true;
}

self.onmessage = async (event) => {
  const message = event.data;
  if (!message || !message.type) {
    return;
  }

  switch (message.type) {
    case 'init':
      try {
        ensureElkInitialized(message.elkUri);
        self.postMessage({ type: 'init-complete' });
      } catch (error) {
        self.postMessage({ type: 'init-error', error: error.message || String(error) });
      }
      break;
    case 'layout':
      if (!elkInstance) {
        self.postMessage({
          type: 'layout-error',
          id: message.id,
          error: 'ELK worker not initialized'
        });
        return;
      }
      try {
        const result = await elkInstance.layout(message.graph, message.options || {});
        self.postMessage({ type: 'layout-result', id: message.id, result });
      } catch (error) {
        self.postMessage({
          type: 'layout-error',
          id: message.id,
          error: error && error.message ? error.message : String(error)
        });
      }
      break;
    case 'dispose':
      elkInstance = null;
      isInitialized = false;
      self.close();
      break;
  }
};
