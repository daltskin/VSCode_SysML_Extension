const fs = require('fs');
const path = require('path');

// Import the standalone parser from test-parser-standalone.js
const content = fs.readFileSync('samples/SysML v2 Spec Annex A SimpleVehicleModel.sysml', 'utf8');

// Simple SysML parser (copied from test-parser-standalone.js)
function parseSysML(content, fileName = '') {
    const elements = [];
    const lines = content.split('\n');
    const elementStack = [];
    let currentElement = null;
    let braceDepth = 0;

    const patterns = {
        package: /^\s*package\s+([\w:]+)\s*\{?/,
        partDef: /^\s*part\s+def\s+(\w+)(?:\s*:>?\s*(\w+(?:,\s*\w+)*))?\s*\{?/,
        part: /^\s*part\s+(\w+)\s*(?::\s*(\w+(?:\s*\[\s*[\d*]+\s*\])?))?/,
        attributeDef: /^\s*attribute\s+def\s+(\w+)/,
        attribute: /^\s*attribute\s+(\w+)\s*(?::\s*(\w+))?/,
        portDef: /^\s*port\s+def\s+(\w+)/,
        port: /^\s*port\s+(\w+)\s*(?::\s*~?(\w+))?/,
        actionDef: /^\s*action\s+def\s+(\w+)/,
        action: /^\s*(?:perform\s+)?action\s+(\w+)/,
        stateDef: /^\s*state\s+def\s+(\w+)/,
        state: /^\s*state\s+(\w+)\s*\{?/,
        actor: /^\s*actor\s+(?:def\s+)?(\w+)/,
        useCase: /^\s*use\s*case\s+(?:def\s+)?(\w+)/,
        itemDef: /^\s*item\s+def\s+(\w+)/,
        item: /^\s*(?:in\s+|out\s+)?item\s+(\w+)/,
        requirement: /^\s*requirement\s+(?:def\s+)?(\w+)/,
        constraint: /^\s*constraint\s+(\w+)/,
        connection: /^\s*(?:connect|interface)\s+(\w+)\s*:/,
        flow: /^\s*flow\s+(?:of\s+)?(\w+)/,
        behavior: /^\s*behavior\s+(\w+)/
    };

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
        const line = lines[lineNum];
        const trimmed = line.trim();

        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed === '') {
            continue;
        }

        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;

        for (const [type, pattern] of Object.entries(patterns)) {
            const match = trimmed.match(pattern);
            if (match) {
                const name = match[1];
                const superType = match[2] || null;

                const element = {
                    name: name,
                    type: type,
                    superType: superType,
                    line: lineNum + 1,
                    children: []
                };

                if (currentElement && braceDepth > 0) {
                    currentElement.children.push(element);
                    element.parent = currentElement.name;
                } else {
                    elements.push(element);
                }

                if (trimmed.includes('{')) {
                    elementStack.push(currentElement);
                    currentElement = element;
                }

                break;
            }
        }

        braceDepth += openBraces - closeBraces;
        while (closeBraces > 0 && elementStack.length > 0 && braceDepth < elementStack.length) {
            currentElement = elementStack.pop();
        }
    }

    return elements;
}

const elements = parseSysML(content, 'SimpleVehicleModel.sysml');
console.log('Total top-level elements:', elements.length);

// Count all elements recursively
function countAll(els) {
    let count = els.length;
    els.forEach(el => {
        if (el.children) count += countAll(el.children);
    });
    return count;
}
console.log('Total elements (including nested):', countAll(elements));

// Show top level structure
console.log('\nTop-level elements:');
elements.forEach((el, i) => {
    console.log(`  ${i}: ${el.type} "${el.name}" (${el.children?.length || 0} children)`);
});

// Find all part types
function findByType(els, typePattern, result = []) {
    els.forEach(el => {
        if (el.type && el.type.toLowerCase().includes(typePattern)) {
            result.push({name: el.name, type: el.type, childrenCount: el.children?.length || 0});
        }
        if (el.children) findByType(el.children, typePattern, result);
    });
    return result;
}

console.log('\n--- Part Definitions ---');
const partDefs = findByType(elements, 'part def');
console.log('Part Definitions found:', partDefs.length);
partDefs.slice(0, 10).forEach(p => console.log(`  - ${p.name} (${p.childrenCount} children)`));

console.log('\n--- Part Usages ---');
const partUsages = findByType(elements, 'part');
const actualUsages = partUsages.filter(p => !p.type.toLowerCase().includes('def'));
console.log('Part Usages found:', actualUsages.length);
actualUsages.slice(0, 20).forEach(p => console.log(`  - ${p.name} [${p.type}] (${p.childrenCount} children)`));

console.log('\n--- Parts with children ---');
const partsWithChildren = actualUsages.filter(p => p.childrenCount > 0);
console.log('Parts with children:', partsWithChildren.length);
partsWithChildren.forEach(p => console.log(`  - ${p.name} [${p.type}] (${p.childrenCount} children)`));

// Find vehicle_a and vehicle_b specifically
console.log('\n--- Searching for vehicle_a and vehicle_b ---');
function findByName(els, name, path = '') {
    els.forEach(el => {
        const currentPath = path ? `${path}.${el.name}` : el.name;
        if (el.name && (el.name.includes('vehicle_a') || el.name.includes('vehicle_b'))) {
            console.log(`  Found: ${el.name} [${el.type}] at path: ${currentPath} (${el.children?.length || 0} children)`);
        }
        if (el.children) findByName(el.children, name, currentPath);
    });
}
findByName(elements, 'vehicle');

// Find VehicleConfigurations
console.log('\n--- Searching for VehicleConfiguration ---');
function findByNamePattern(els, pattern, path = '') {
    els.forEach(el => {
        const currentPath = path ? `${path}.${el.name}` : el.name;
        if (el.name && el.name.includes('VehicleConfiguration')) {
            console.log(`  Found: ${el.name} [${el.type}] at path: ${currentPath} (${el.children?.length || 0} children)`);
        }
        if (el.children) findByNamePattern(el.children, pattern, currentPath);
    });
}
findByNamePattern(elements, 'VehicleConfiguration');
