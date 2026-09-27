import * as vscode from 'vscode';
import { telemetryMetadata } from './index';
import type { TelemetryMetadata } from './telemetryService';

const repository = 'https://github.com/daltskin/VSCode_SysML_Extension';

export interface IssueReportUI {
  review(draft: string): Promise<string | undefined>;
  confirm(): Promise<boolean>;
  open(url: string): Promise<void>;
}

/** Only open a prefilled public URL after the user reviews and confirms the draft. */
export async function reviewIssueReport(metadata: TelemetryMetadata, ui: IssueReportUI): Promise<void> {
  const draft = await ui.review([
    '## Description', '', '', '## Steps to reproduce', '', '',
    '## Expected and actual behaviour', '', '', '## Environment',
    `- Extension: ${metadata.extensionVersion}`, `- Language server: ${metadata.lspVersion}`,
    `- VS Code: ${metadata.vscodeVersion}`, `- Host: ${metadata.host}`,
    `- Platform: ${metadata.platform}`, '',
  ].join('\n'));
  if (draft === undefined || !await ui.confirm()) return;
  const url = new globalThis.URL(`${repository}/issues/new`);
  url.searchParams.set('body', draft);
  if (url.href.length > 8_000) throw new Error('Shorten the report to fit the GitHub URL limit.');
  await ui.open(url.href);
}

/** Register a user-initiated report flow that remains available when telemetry is off. */
export function registerIssueReport(context: vscode.ExtensionContext): void {
  context.subscriptions.push(vscode.commands.registerCommand('sysml.reportIssue', async () => {
    try {
      const kind = await vscode.window.showQuickPick(['Public bug report', 'Private security report'],
        { title: 'Report a SysML issue' });
      if (!kind) return;
      if (kind === 'Private security report') {
        await vscode.env.openExternal(vscode.Uri.parse(`${repository}/security/advisories/new`));
        return;
      }
      await reviewIssueReport(telemetryMetadata(context), {
        review: async draft => {
          const document = await vscode.workspace.openTextDocument({ language: 'markdown', content: draft });
          await vscode.window.showTextDocument(document);
          const choice = await vscode.window.showInformationMessage(
            'Review and edit this draft. No model content or logs have been attached.', 'Continue to GitHub');
          return choice ? document.getText() : undefined;
        },
        confirm: async () => (await vscode.window.showWarningMessage(
          'This draft will be sent to GitHub in a URL and can become a public issue. '
          + 'Remove sensitive information. Do not use this flow for security vulnerabilities.',
          { modal: true }, 'Open GitHub')) === 'Open GitHub',
        open: async url => { await vscode.env.openExternal(vscode.Uri.parse(url)); },
      });
    } catch {
      void vscode.window.showErrorMessage('Unable to open the report. Shorten the draft and try again.');
    }
  }));
}
