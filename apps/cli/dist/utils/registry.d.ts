/**
 * Registry API client for fetching components from rafters.realhandy.tech
 */
import { z } from 'zod';
export declare const IntelligenceSchema: z.ZodObject<{
    cognitiveLoad: z.ZodNumber;
    attentionEconomics: z.ZodString;
    accessibility: z.ZodString;
    trustBuilding: z.ZodString;
    semanticMeaning: z.ZodString;
}, "strip", z.ZodTypeAny, {
    cognitiveLoad: number;
    attentionEconomics: string;
    accessibility: string;
    trustBuilding: string;
    semanticMeaning: string;
}, {
    cognitiveLoad: number;
    attentionEconomics: string;
    accessibility: string;
    trustBuilding: string;
    semanticMeaning: string;
}>;
export declare const ComponentManifestSchema: z.ZodObject<{
    $schema: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    type: z.ZodEnum<["registry:component", "registry:lib", "registry:style", "registry:block", "registry:page", "registry:hook"]>;
    description: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    author: z.ZodOptional<z.ZodString>;
    dependencies: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    devDependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    registryDependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    files: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        content: z.ZodString;
        type: z.ZodString;
        target: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        type: string;
        content: string;
        target?: string | undefined;
    }, {
        path: string;
        type: string;
        content: string;
        target?: string | undefined;
    }>, "many">;
    tailwind: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    cssVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    css: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    envVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    docs: z.ZodOptional<z.ZodString>;
    meta: z.ZodOptional<z.ZodObject<{
        rafters: z.ZodOptional<z.ZodObject<{
            intelligence: z.ZodObject<{
                cognitiveLoad: z.ZodNumber;
                attentionEconomics: z.ZodString;
                accessibility: z.ZodString;
                trustBuilding: z.ZodString;
                semanticMeaning: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                cognitiveLoad: number;
                attentionEconomics: string;
                accessibility: string;
                trustBuilding: string;
                semanticMeaning: string;
            }, {
                cognitiveLoad: number;
                attentionEconomics: string;
                accessibility: string;
                trustBuilding: string;
                semanticMeaning: string;
            }>;
            version: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            intelligence: {
                cognitiveLoad: number;
                attentionEconomics: string;
                accessibility: string;
                trustBuilding: string;
                semanticMeaning: string;
            };
            version?: string | undefined;
        }, {
            intelligence: {
                cognitiveLoad: number;
                attentionEconomics: string;
                accessibility: string;
                trustBuilding: string;
                semanticMeaning: string;
            };
            version?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        rafters?: {
            intelligence: {
                cognitiveLoad: number;
                attentionEconomics: string;
                accessibility: string;
                trustBuilding: string;
                semanticMeaning: string;
            };
            version?: string | undefined;
        } | undefined;
    }, {
        rafters?: {
            intelligence: {
                cognitiveLoad: number;
                attentionEconomics: string;
                accessibility: string;
                trustBuilding: string;
                semanticMeaning: string;
            };
            version?: string | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
    name: string;
    dependencies: string[];
    files: {
        path: string;
        type: string;
        content: string;
        target?: string | undefined;
    }[];
    $schema?: string | undefined;
    description?: string | undefined;
    title?: string | undefined;
    author?: string | undefined;
    devDependencies?: string[] | undefined;
    registryDependencies?: string[] | undefined;
    tailwind?: Record<string, unknown> | undefined;
    cssVars?: Record<string, unknown> | undefined;
    css?: string[] | undefined;
    envVars?: Record<string, string> | undefined;
    categories?: string[] | undefined;
    docs?: string | undefined;
    meta?: {
        rafters?: {
            intelligence: {
                cognitiveLoad: number;
                attentionEconomics: string;
                accessibility: string;
                trustBuilding: string;
                semanticMeaning: string;
            };
            version?: string | undefined;
        } | undefined;
    } | undefined;
}, {
    type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
    name: string;
    files: {
        path: string;
        type: string;
        content: string;
        target?: string | undefined;
    }[];
    $schema?: string | undefined;
    description?: string | undefined;
    title?: string | undefined;
    author?: string | undefined;
    dependencies?: string[] | undefined;
    devDependencies?: string[] | undefined;
    registryDependencies?: string[] | undefined;
    tailwind?: Record<string, unknown> | undefined;
    cssVars?: Record<string, unknown> | undefined;
    css?: string[] | undefined;
    envVars?: Record<string, string> | undefined;
    categories?: string[] | undefined;
    docs?: string | undefined;
    meta?: {
        rafters?: {
            intelligence: {
                cognitiveLoad: number;
                attentionEconomics: string;
                accessibility: string;
                trustBuilding: string;
                semanticMeaning: string;
            };
            version?: string | undefined;
        } | undefined;
    } | undefined;
}>;
export declare const RegistrySchema: z.ZodObject<{
    $schema: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    homepage: z.ZodOptional<z.ZodString>;
    components: z.ZodOptional<z.ZodArray<z.ZodObject<{
        $schema: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        type: z.ZodEnum<["registry:component", "registry:lib", "registry:style", "registry:block", "registry:page", "registry:hook"]>;
        description: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        author: z.ZodOptional<z.ZodString>;
        dependencies: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        devDependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        registryDependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        files: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            content: z.ZodString;
            type: z.ZodString;
            target: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            type: string;
            content: string;
            target?: string | undefined;
        }, {
            path: string;
            type: string;
            content: string;
            target?: string | undefined;
        }>, "many">;
        tailwind: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        cssVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        css: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        envVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        docs: z.ZodOptional<z.ZodString>;
        meta: z.ZodOptional<z.ZodObject<{
            rafters: z.ZodOptional<z.ZodObject<{
                intelligence: z.ZodObject<{
                    cognitiveLoad: z.ZodNumber;
                    attentionEconomics: z.ZodString;
                    accessibility: z.ZodString;
                    trustBuilding: z.ZodString;
                    semanticMeaning: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                }, {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                }>;
                version: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                intelligence: {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                };
                version?: string | undefined;
            }, {
                intelligence: {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                };
                version?: string | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            rafters?: {
                intelligence: {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                };
                version?: string | undefined;
            } | undefined;
        }, {
            rafters?: {
                intelligence: {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                };
                version?: string | undefined;
            } | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
        name: string;
        dependencies: string[];
        files: {
            path: string;
            type: string;
            content: string;
            target?: string | undefined;
        }[];
        $schema?: string | undefined;
        description?: string | undefined;
        title?: string | undefined;
        author?: string | undefined;
        devDependencies?: string[] | undefined;
        registryDependencies?: string[] | undefined;
        tailwind?: Record<string, unknown> | undefined;
        cssVars?: Record<string, unknown> | undefined;
        css?: string[] | undefined;
        envVars?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        docs?: string | undefined;
        meta?: {
            rafters?: {
                intelligence: {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                };
                version?: string | undefined;
            } | undefined;
        } | undefined;
    }, {
        type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
        name: string;
        files: {
            path: string;
            type: string;
            content: string;
            target?: string | undefined;
        }[];
        $schema?: string | undefined;
        description?: string | undefined;
        title?: string | undefined;
        author?: string | undefined;
        dependencies?: string[] | undefined;
        devDependencies?: string[] | undefined;
        registryDependencies?: string[] | undefined;
        tailwind?: Record<string, unknown> | undefined;
        cssVars?: Record<string, unknown> | undefined;
        css?: string[] | undefined;
        envVars?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        docs?: string | undefined;
        meta?: {
            rafters?: {
                intelligence: {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                };
                version?: string | undefined;
            } | undefined;
        } | undefined;
    }>, "many">>;
    items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        $schema: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        type: z.ZodEnum<["registry:component", "registry:lib", "registry:style", "registry:block", "registry:page", "registry:hook"]>;
        description: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        author: z.ZodOptional<z.ZodString>;
        dependencies: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        devDependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        registryDependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        files: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            content: z.ZodString;
            type: z.ZodString;
            target: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            type: string;
            content: string;
            target?: string | undefined;
        }, {
            path: string;
            type: string;
            content: string;
            target?: string | undefined;
        }>, "many">;
        tailwind: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        cssVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        css: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        envVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        docs: z.ZodOptional<z.ZodString>;
        meta: z.ZodOptional<z.ZodObject<{
            rafters: z.ZodOptional<z.ZodObject<{
                intelligence: z.ZodObject<{
                    cognitiveLoad: z.ZodNumber;
                    attentionEconomics: z.ZodString;
                    accessibility: z.ZodString;
                    trustBuilding: z.ZodString;
                    semanticMeaning: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                }, {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                }>;
                version: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                intelligence: {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                };
                version?: string | undefined;
            }, {
                intelligence: {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                };
                version?: string | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            rafters?: {
                intelligence: {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                };
                version?: string | undefined;
            } | undefined;
        }, {
            rafters?: {
                intelligence: {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                };
                version?: string | undefined;
            } | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
        name: string;
        dependencies: string[];
        files: {
            path: string;
            type: string;
            content: string;
            target?: string | undefined;
        }[];
        $schema?: string | undefined;
        description?: string | undefined;
        title?: string | undefined;
        author?: string | undefined;
        devDependencies?: string[] | undefined;
        registryDependencies?: string[] | undefined;
        tailwind?: Record<string, unknown> | undefined;
        cssVars?: Record<string, unknown> | undefined;
        css?: string[] | undefined;
        envVars?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        docs?: string | undefined;
        meta?: {
            rafters?: {
                intelligence: {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                };
                version?: string | undefined;
            } | undefined;
        } | undefined;
    }, {
        type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
        name: string;
        files: {
            path: string;
            type: string;
            content: string;
            target?: string | undefined;
        }[];
        $schema?: string | undefined;
        description?: string | undefined;
        title?: string | undefined;
        author?: string | undefined;
        dependencies?: string[] | undefined;
        devDependencies?: string[] | undefined;
        registryDependencies?: string[] | undefined;
        tailwind?: Record<string, unknown> | undefined;
        cssVars?: Record<string, unknown> | undefined;
        css?: string[] | undefined;
        envVars?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        docs?: string | undefined;
        meta?: {
            rafters?: {
                intelligence: {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                };
                version?: string | undefined;
            } | undefined;
        } | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    $schema?: string | undefined;
    name?: string | undefined;
    homepage?: string | undefined;
    components?: {
        type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
        name: string;
        dependencies: string[];
        files: {
            path: string;
            type: string;
            content: string;
            target?: string | undefined;
        }[];
        $schema?: string | undefined;
        description?: string | undefined;
        title?: string | undefined;
        author?: string | undefined;
        devDependencies?: string[] | undefined;
        registryDependencies?: string[] | undefined;
        tailwind?: Record<string, unknown> | undefined;
        cssVars?: Record<string, unknown> | undefined;
        css?: string[] | undefined;
        envVars?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        docs?: string | undefined;
        meta?: {
            rafters?: {
                intelligence: {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                };
                version?: string | undefined;
            } | undefined;
        } | undefined;
    }[] | undefined;
    items?: {
        type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
        name: string;
        dependencies: string[];
        files: {
            path: string;
            type: string;
            content: string;
            target?: string | undefined;
        }[];
        $schema?: string | undefined;
        description?: string | undefined;
        title?: string | undefined;
        author?: string | undefined;
        devDependencies?: string[] | undefined;
        registryDependencies?: string[] | undefined;
        tailwind?: Record<string, unknown> | undefined;
        cssVars?: Record<string, unknown> | undefined;
        css?: string[] | undefined;
        envVars?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        docs?: string | undefined;
        meta?: {
            rafters?: {
                intelligence: {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                };
                version?: string | undefined;
            } | undefined;
        } | undefined;
    }[] | undefined;
}, {
    $schema?: string | undefined;
    name?: string | undefined;
    homepage?: string | undefined;
    components?: {
        type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
        name: string;
        files: {
            path: string;
            type: string;
            content: string;
            target?: string | undefined;
        }[];
        $schema?: string | undefined;
        description?: string | undefined;
        title?: string | undefined;
        author?: string | undefined;
        dependencies?: string[] | undefined;
        devDependencies?: string[] | undefined;
        registryDependencies?: string[] | undefined;
        tailwind?: Record<string, unknown> | undefined;
        cssVars?: Record<string, unknown> | undefined;
        css?: string[] | undefined;
        envVars?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        docs?: string | undefined;
        meta?: {
            rafters?: {
                intelligence: {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                };
                version?: string | undefined;
            } | undefined;
        } | undefined;
    }[] | undefined;
    items?: {
        type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
        name: string;
        files: {
            path: string;
            type: string;
            content: string;
            target?: string | undefined;
        }[];
        $schema?: string | undefined;
        description?: string | undefined;
        title?: string | undefined;
        author?: string | undefined;
        dependencies?: string[] | undefined;
        devDependencies?: string[] | undefined;
        registryDependencies?: string[] | undefined;
        tailwind?: Record<string, unknown> | undefined;
        cssVars?: Record<string, unknown> | undefined;
        css?: string[] | undefined;
        envVars?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        docs?: string | undefined;
        meta?: {
            rafters?: {
                intelligence: {
                    cognitiveLoad: number;
                    attentionEconomics: string;
                    accessibility: string;
                    trustBuilding: string;
                    semanticMeaning: string;
                };
                version?: string | undefined;
            } | undefined;
        } | undefined;
    }[] | undefined;
}>;
export type Intelligence = z.infer<typeof IntelligenceSchema>;
export type ComponentManifest = z.infer<typeof ComponentManifestSchema>;
export type Registry = z.infer<typeof RegistrySchema>;
/**
 * Fetch complete component registry from the hosted API
 */
export declare function fetchComponentRegistry(): Promise<Registry>;
/**
 * Fetch a specific component by name from the hosted API
 */
export declare function fetchComponent(componentName: string): Promise<ComponentManifest | null>;
