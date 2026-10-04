/**
 * Core SysML element types used by the model explorer, visualization panel,
 * and other extension components.
 *
 * These types use VS Code runtime types (`vscode.Range`, `Map`) and are the
 * canonical internal representation.  For LSP-transport DTOs see
 * `../providers/sysmlModelTypes.ts`.
 */

import * as vscode from 'vscode';

export interface SysMLElement {
    type: string;
    name: string;
    /** Unique identifier from sysml-v2-lsp 0.33+, used to tell anonymous elements apart. */
    symbolId?: string;
    range: vscode.Range;
    children: SysMLElement[];
    attributes: Map<string, string | number | boolean>;
    relationships: Relationship[];
    errors?: string[];
}

export interface Relationship {
    type: string;
    target: string;
    source: string;
    name?: string;
}

export interface SequenceDiagram {
    name: string;
    participants: Participant[];
    messages: Message[];
    range: vscode.Range;
}

export interface Participant {
    name: string;
    type: string;
    range: vscode.Range;
}

export interface Message {
    name: string;
    from: string;
    to: string;
    payload: string;
    occurrence: number;
    range: vscode.Range;
}

export interface ActivityDiagram {
    name: string;
    actions: ActivityAction[];
    decisions: DecisionNode[];
    flows: ControlFlow[];
    states: ActivityState[];
    range: vscode.Range;
}

export interface ActivityAction {
    name: string;
    type: 'action' | 'start' | 'end' | 'fork' | 'join' | 'composite' | 'initial' | 'final' | 'merge' | 'decision';
    kind?: string;
    inputs?: string[];
    outputs?: string[];
    condition?: string;
    subActions?: ActivityAction[];
    isDefinition?: boolean;
    range?: vscode.Range;
    parent?: string;
    children?: string[];
}

export interface DecisionNode {
    name: string;
    condition: string;
    branches: {
        condition: string;
        target: string;
    }[];
    range: vscode.Range;
}

export interface ControlFlow {
    from: string;
    to: string;
    condition?: string;
    guard?: string;
    range: vscode.Range;
}

export interface ActivityState {
    name: string;
    type: 'initial' | 'final' | 'intermediate';
    entryActions?: string[];
    exitActions?: string[];
    doActivity?: string;
    range: vscode.Range;
}
