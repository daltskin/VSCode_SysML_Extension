import * as assert from 'assert';
import { ANTLRSysMLParser } from '../parser/antlrSysMLParser';

suite('Advanced Grammar Features', () => {
    let parser: ANTLRSysMLParser;

    setup(() => {
        parser = new ANTLRSysMLParser();
    });

    const parseSource = (source: string): { success: boolean } => {
        const mockDoc = {
            getText: () => source,
            lineCount: source.split('\n').length,
            uri: { fsPath: 'test.sysml' },
        } as any;
        try {
            const elements = parser.parseDocument(mockDoc);
            return { success: Array.isArray(elements) };
        } catch {
            return { success: false };
        }
    };

    suite('Metadata Annotation with @ Syntax', () => {
        test('should parse @ metadata annotation', () => {
            const source = `
                @ TestMetadata {
                    doc /* Test metadata */
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });

        test('should parse @ metadata about subject', () => {
            const source = `
                @ PerformanceData about SensorSystem {
                    attribute sampleRate = 100;
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });
    });

    suite('Generic Type Parameters', () => {
        test('should parse generic type with single parameter', () => {
            const source = `
                part DataCollection<T> {
                    attribute items : Collection<T>;
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });

        test('should parse generic type with multiple parameters', () => {
            const source = `
                part Map<K, V> {
                    attribute key : K;
                    attribute value : V;
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });

        test('should parse nested generic types', () => {
            const source = `
                part Container {
                    attribute data : Collection<Array<Integer>>;
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });
    });

    suite('Assignment Operator :=', () => {
        test('should parse := assignment in attribute', () => {
            const source = `
                attribute runtime_value := 0;
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });

        test('should parse := assignment with expression', () => {
            const source = `
                attribute computed_result := speed * time;
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });
    });

    suite('Temporal Modeling Keywords', () => {
        test('should parse snapshot modifier', () => {
            const source = `
                snapshot part CurrentState {
                    attribute position : Real[3];
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });

        test('should parse timeslice modifier', () => {
            const source = `
                timeslice part StateAtTime {
                    attribute timestamp : Real;
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });

        test('should parse individual with snapshot', () => {
            const source = `
                individual part Robot {
                    snapshot part CurrentState;
                    timeslice part History;
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });
    });

    suite('View Enhancements', () => {
        test('should parse expose statement', () => {
            const source = `
                view def SystemView {
                    expose Part1, Part2, Part3;
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });

        test('should parse filter statement', () => {
            const source = `
                view def FilteredView {
                    filter speed > 100;
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });

        test('should parse satisfy statement', () => {
            const source = `
                view def RequirementView {
                    satisfy SafetyRequirement;
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });

        test('should parse combined view statements', () => {
            const source = `
                view def CompleteView {
                    expose Component1, Component2;
                    filter status == 'active';
                    satisfy PerformanceRequirement;
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });
    });

    suite('Verification Enhancements', () => {
        test('should parse verify statement', () => {
            const source = `
                verification def TestVerification {
                    verify SafetyRequirement;
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });

        test('should parse multiple verify statements', () => {
            const source = `
                verification def SystemVerification {
                    verify Requirement1;
                    verify Requirement2;
                    verify Requirement3;
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });
    });

    suite('Relationship Keywords', () => {
        test('should parse redefines keyword', () => {
            const source = `
                part Vehicle {
                    attribute speed : Real;
                }
                part Car :> Vehicle {
                    attribute speed redefines Vehicle::speed;
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });

        test('should parse subsets keyword', () => {
            const source = `
                part Container {
                    part items[*];
                    part activeItems[*] subsets items;
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });

        test('should parse references keyword', () => {
            const source = `
                part System {
                    reference externalComponent references ExternalPart;
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });

        test('should parse :>> redefinition operator', () => {
            const source = `
                part Base {
                    attribute value : Real;
                }
                part Derived :> Base {
                    :>> value = 100;
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });
    });

    suite('Calculation Enhancements', () => {
        test('should parse calc def with parameter directions', () => {
            const source = `
                calc def ComputeForce {
                    in attribute mass : Real;
                    in attribute acceleration : Real;
                    out attribute force : Real;
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });

        test('should parse calc def with return type', () => {
            const source = `
                calc def GetValue {
                    return : Real { return 42; }
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });

        test('should parse calc def with inout parameters', () => {
            const source = `
                calc def UpdateValue {
                    inout attribute value : Real;
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });
    });

    suite('Multiplicity Ranges', () => {
        test('should parse exact multiplicity', () => {
            const source = `
                part Container {
                    part item[5];
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });

        test('should parse range multiplicity', () => {
            const source = `
                part Container {
                    part optional[0..1];
                    part required[1..*];
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });

        test('should parse unbounded multiplicity', () => {
            const source = `
                part Container {
                    part items[*];
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });
    });

    suite('All Modifiers', () => {
        test('should parse all standard modifiers', () => {
            const source = `
                abstract part AbstractBase;
                derived attribute computed : Real;
                readonly attribute constant : Integer;
                variation attribute variant : String;
                ordered nonunique attribute list[*];
                individual part Instance;
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });
    });

    suite('Integration Test - All Features Combined', () => {
        test('should parse complex document with all new features', () => {
            const source = `
                package CompleteTest {
                    @ Metadata about System {
                        doc /* Complete test */
                    }

                    part DataProcessor<T> {
                        in attribute input : T;
                        out attribute output : T;

                        individual snapshot part State;
                        timeslice part History;
                    }

                    calc def Process {
                        in attribute data : Real[1..*];
                        return : Real { return data[0]; }
                    }

                    view def SystemView {
                        expose DataProcessor;
                        filter active == true;
                        satisfy PerformanceReq;
                    }

                    verification def Tests {
                        verify PerformanceReq;
                        verify SafetyReq;
                    }

                    part System {
                        attribute value := 42;
                        part processor :> DataProcessor<Real>;
                        attribute items redefines base;
                    }
                }
            `;
            const result = parseSource(source);
            assert.strictEqual(result.success, true);
        });
    });
});
