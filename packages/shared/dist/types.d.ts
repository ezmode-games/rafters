import { z } from 'zod';
/**
 * AI Intelligence Types
 * These types define the structure for AI-readable design intelligence
 */
export declare const OKLCHSchema: z.ZodObject<{
    l: z.ZodNumber;
    c: z.ZodNumber;
    h: z.ZodNumber;
    alpha: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    l: number;
    c: number;
    h: number;
    alpha?: number | undefined;
}, {
    l: number;
    c: number;
    h: number;
    alpha?: number | undefined;
}>;
export type OKLCH = z.infer<typeof OKLCHSchema>;
export declare const ColorVisionTypeSchema: z.ZodEnum<["normal", "deuteranopia", "protanopia", "tritanopia"]>;
export type ColorVisionType = z.infer<typeof ColorVisionTypeSchema>;
export declare const ContrastLevelSchema: z.ZodEnum<["AA", "AAA"]>;
export type ContrastLevel = z.infer<typeof ContrastLevelSchema>;
export declare const ComponentIntelligenceSchema: z.ZodObject<{
    cognitiveLoad: z.ZodNumber;
    attentionHierarchy: z.ZodString;
    safetyConstraints: z.ZodOptional<z.ZodString>;
    accessibilityRules: z.ZodString;
    usageContext: z.ZodString;
    decisionConstraints: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    cognitiveLoad: number;
    attentionHierarchy: string;
    accessibilityRules: string;
    usageContext: string;
    safetyConstraints?: string | undefined;
    decisionConstraints?: string | undefined;
}, {
    cognitiveLoad: number;
    attentionHierarchy: string;
    accessibilityRules: string;
    usageContext: string;
    safetyConstraints?: string | undefined;
    decisionConstraints?: string | undefined;
}>;
export type ComponentIntelligence = z.infer<typeof ComponentIntelligenceSchema>;
export declare const SemanticTokenSchema: z.ZodObject<{
    name: z.ZodString;
    value: z.ZodString;
    type: z.ZodEnum<["color", "spacing", "typography", "shadow", "border"]>;
    semantic: z.ZodString;
    aiIntelligence: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "color" | "spacing" | "typography" | "shadow" | "border";
    value: string;
    semantic: string;
    aiIntelligence?: string | undefined;
}, {
    name: string;
    type: "color" | "spacing" | "typography" | "shadow" | "border";
    value: string;
    semantic: string;
    aiIntelligence?: string | undefined;
}>;
export type SemanticToken = z.infer<typeof SemanticTokenSchema>;
export declare const DesignSystemSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    primaryColor: z.ZodObject<{
        l: z.ZodNumber;
        c: z.ZodNumber;
        h: z.ZodNumber;
        alpha: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        l: number;
        c: number;
        h: number;
        alpha?: number | undefined;
    }, {
        l: number;
        c: number;
        h: number;
        alpha?: number | undefined;
    }>;
    tokens: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodString;
        type: z.ZodEnum<["color", "spacing", "typography", "shadow", "border"]>;
        semantic: z.ZodString;
        aiIntelligence: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: "color" | "spacing" | "typography" | "shadow" | "border";
        value: string;
        semantic: string;
        aiIntelligence?: string | undefined;
    }, {
        name: string;
        type: "color" | "spacing" | "typography" | "shadow" | "border";
        value: string;
        semantic: string;
        aiIntelligence?: string | undefined;
    }>, "many">;
    typography: z.ZodObject<{
        heading: z.ZodString;
        body: z.ZodString;
        mono: z.ZodString;
        scale: z.ZodRecord<z.ZodString, z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        scale: Record<string, number>;
        heading: string;
        body: string;
        mono: string;
    }, {
        scale: Record<string, number>;
        heading: string;
        body: string;
        mono: string;
    }>;
    intelligence: z.ZodObject<{
        colorVisionTested: z.ZodArray<z.ZodEnum<["normal", "deuteranopia", "protanopia", "tritanopia"]>, "many">;
        contrastLevel: z.ZodEnum<["AA", "AAA"]>;
        components: z.ZodRecord<z.ZodString, z.ZodObject<{
            cognitiveLoad: z.ZodNumber;
            attentionHierarchy: z.ZodString;
            safetyConstraints: z.ZodOptional<z.ZodString>;
            accessibilityRules: z.ZodString;
            usageContext: z.ZodString;
            decisionConstraints: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            cognitiveLoad: number;
            attentionHierarchy: string;
            accessibilityRules: string;
            usageContext: string;
            safetyConstraints?: string | undefined;
            decisionConstraints?: string | undefined;
        }, {
            cognitiveLoad: number;
            attentionHierarchy: string;
            accessibilityRules: string;
            usageContext: string;
            safetyConstraints?: string | undefined;
            decisionConstraints?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        colorVisionTested: ("normal" | "deuteranopia" | "protanopia" | "tritanopia")[];
        contrastLevel: "AA" | "AAA";
        components: Record<string, {
            cognitiveLoad: number;
            attentionHierarchy: string;
            accessibilityRules: string;
            usageContext: string;
            safetyConstraints?: string | undefined;
            decisionConstraints?: string | undefined;
        }>;
    }, {
        colorVisionTested: ("normal" | "deuteranopia" | "protanopia" | "tritanopia")[];
        contrastLevel: "AA" | "AAA";
        components: Record<string, {
            cognitiveLoad: number;
            attentionHierarchy: string;
            accessibilityRules: string;
            usageContext: string;
            safetyConstraints?: string | undefined;
            decisionConstraints?: string | undefined;
        }>;
    }>;
    metadata: z.ZodObject<{
        created: z.ZodString;
        updated: z.ZodString;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        version: string;
        created: string;
        updated: string;
    }, {
        version: string;
        created: string;
        updated: string;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    typography: {
        scale: Record<string, number>;
        heading: string;
        body: string;
        mono: string;
    };
    primaryColor: {
        l: number;
        c: number;
        h: number;
        alpha?: number | undefined;
    };
    tokens: {
        name: string;
        type: "color" | "spacing" | "typography" | "shadow" | "border";
        value: string;
        semantic: string;
        aiIntelligence?: string | undefined;
    }[];
    intelligence: {
        colorVisionTested: ("normal" | "deuteranopia" | "protanopia" | "tritanopia")[];
        contrastLevel: "AA" | "AAA";
        components: Record<string, {
            cognitiveLoad: number;
            attentionHierarchy: string;
            accessibilityRules: string;
            usageContext: string;
            safetyConstraints?: string | undefined;
            decisionConstraints?: string | undefined;
        }>;
    };
    metadata: {
        version: string;
        created: string;
        updated: string;
    };
}, {
    id: string;
    name: string;
    typography: {
        scale: Record<string, number>;
        heading: string;
        body: string;
        mono: string;
    };
    primaryColor: {
        l: number;
        c: number;
        h: number;
        alpha?: number | undefined;
    };
    tokens: {
        name: string;
        type: "color" | "spacing" | "typography" | "shadow" | "border";
        value: string;
        semantic: string;
        aiIntelligence?: string | undefined;
    }[];
    intelligence: {
        colorVisionTested: ("normal" | "deuteranopia" | "protanopia" | "tritanopia")[];
        contrastLevel: "AA" | "AAA";
        components: Record<string, {
            cognitiveLoad: number;
            attentionHierarchy: string;
            accessibilityRules: string;
            usageContext: string;
            safetyConstraints?: string | undefined;
            decisionConstraints?: string | undefined;
        }>;
    };
    metadata: {
        version: string;
        created: string;
        updated: string;
    };
}>;
export type DesignSystem = z.infer<typeof DesignSystemSchema>;
export declare const ComponentRegistrySchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["registry:component", "registry:lib", "registry:style", "registry:block", "registry:page", "registry:hook"]>;
    files: z.ZodArray<z.ZodString, "many">;
    meta: z.ZodObject<{
        rafters: z.ZodObject<{
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
        }, "strip", z.ZodTypeAny, {
            intelligence: {
                cognitiveLoad: number;
                attentionEconomics: string;
                accessibility: string;
                trustBuilding: string;
                semanticMeaning: string;
            };
        }, {
            intelligence: {
                cognitiveLoad: number;
                attentionEconomics: string;
                accessibility: string;
                trustBuilding: string;
                semanticMeaning: string;
            };
        }>;
    }, "strip", z.ZodTypeAny, {
        rafters: {
            intelligence: {
                cognitiveLoad: number;
                attentionEconomics: string;
                accessibility: string;
                trustBuilding: string;
                semanticMeaning: string;
            };
        };
    }, {
        rafters: {
            intelligence: {
                cognitiveLoad: number;
                attentionEconomics: string;
                accessibility: string;
                trustBuilding: string;
                semanticMeaning: string;
            };
        };
    }>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
    files: string[];
    meta: {
        rafters: {
            intelligence: {
                cognitiveLoad: number;
                attentionEconomics: string;
                accessibility: string;
                trustBuilding: string;
                semanticMeaning: string;
            };
        };
    };
}, {
    name: string;
    type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
    files: string[];
    meta: {
        rafters: {
            intelligence: {
                cognitiveLoad: number;
                attentionEconomics: string;
                accessibility: string;
                trustBuilding: string;
                semanticMeaning: string;
            };
        };
    };
}>;
export type ComponentRegistry = z.infer<typeof ComponentRegistrySchema>;
export declare const PublicDesignSystemSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    author: z.ZodOptional<z.ZodString>;
    primaryColor: z.ZodString;
    popularity: z.ZodDefault<z.ZodNumber>;
    downloads: z.ZodDefault<z.ZodNumber>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    preview: z.ZodOptional<z.ZodString>;
    created: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    primaryColor: string;
    created: string;
    popularity: number;
    downloads: number;
    tags: string[];
    author?: string | undefined;
    preview?: string | undefined;
}, {
    id: string;
    name: string;
    primaryColor: string;
    created: string;
    author?: string | undefined;
    popularity?: number | undefined;
    downloads?: number | undefined;
    tags?: string[] | undefined;
    preview?: string | undefined;
}>;
export type PublicDesignSystem = z.infer<typeof PublicDesignSystemSchema>;
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
        type: string;
        path: string;
        content: string;
        target?: string | undefined;
    }, {
        type: string;
        path: string;
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
    name: string;
    type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
    files: {
        type: string;
        path: string;
        content: string;
        target?: string | undefined;
    }[];
    dependencies: string[];
    title?: string | undefined;
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
    author?: string | undefined;
    $schema?: string | undefined;
    description?: string | undefined;
    devDependencies?: string[] | undefined;
    registryDependencies?: string[] | undefined;
    tailwind?: Record<string, unknown> | undefined;
    cssVars?: Record<string, unknown> | undefined;
    css?: string[] | undefined;
    envVars?: Record<string, string> | undefined;
    categories?: string[] | undefined;
    docs?: string | undefined;
}, {
    name: string;
    type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
    files: {
        type: string;
        path: string;
        content: string;
        target?: string | undefined;
    }[];
    title?: string | undefined;
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
    author?: string | undefined;
    $schema?: string | undefined;
    description?: string | undefined;
    dependencies?: string[] | undefined;
    devDependencies?: string[] | undefined;
    registryDependencies?: string[] | undefined;
    tailwind?: Record<string, unknown> | undefined;
    cssVars?: Record<string, unknown> | undefined;
    css?: string[] | undefined;
    envVars?: Record<string, string> | undefined;
    categories?: string[] | undefined;
    docs?: string | undefined;
}>;
export type ComponentManifest = z.infer<typeof ComponentManifestSchema>;
export declare const RegistryResponseSchema: z.ZodObject<{
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
            type: string;
            path: string;
            content: string;
            target?: string | undefined;
        }, {
            type: string;
            path: string;
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
        name: string;
        type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
        files: {
            type: string;
            path: string;
            content: string;
            target?: string | undefined;
        }[];
        dependencies: string[];
        title?: string | undefined;
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
        author?: string | undefined;
        $schema?: string | undefined;
        description?: string | undefined;
        devDependencies?: string[] | undefined;
        registryDependencies?: string[] | undefined;
        tailwind?: Record<string, unknown> | undefined;
        cssVars?: Record<string, unknown> | undefined;
        css?: string[] | undefined;
        envVars?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        docs?: string | undefined;
    }, {
        name: string;
        type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
        files: {
            type: string;
            path: string;
            content: string;
            target?: string | undefined;
        }[];
        title?: string | undefined;
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
        author?: string | undefined;
        $schema?: string | undefined;
        description?: string | undefined;
        dependencies?: string[] | undefined;
        devDependencies?: string[] | undefined;
        registryDependencies?: string[] | undefined;
        tailwind?: Record<string, unknown> | undefined;
        cssVars?: Record<string, unknown> | undefined;
        css?: string[] | undefined;
        envVars?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        docs?: string | undefined;
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
            type: string;
            path: string;
            content: string;
            target?: string | undefined;
        }, {
            type: string;
            path: string;
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
        name: string;
        type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
        files: {
            type: string;
            path: string;
            content: string;
            target?: string | undefined;
        }[];
        dependencies: string[];
        title?: string | undefined;
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
        author?: string | undefined;
        $schema?: string | undefined;
        description?: string | undefined;
        devDependencies?: string[] | undefined;
        registryDependencies?: string[] | undefined;
        tailwind?: Record<string, unknown> | undefined;
        cssVars?: Record<string, unknown> | undefined;
        css?: string[] | undefined;
        envVars?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        docs?: string | undefined;
    }, {
        name: string;
        type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
        files: {
            type: string;
            path: string;
            content: string;
            target?: string | undefined;
        }[];
        title?: string | undefined;
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
        author?: string | undefined;
        $schema?: string | undefined;
        description?: string | undefined;
        dependencies?: string[] | undefined;
        devDependencies?: string[] | undefined;
        registryDependencies?: string[] | undefined;
        tailwind?: Record<string, unknown> | undefined;
        cssVars?: Record<string, unknown> | undefined;
        css?: string[] | undefined;
        envVars?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        docs?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    components?: {
        name: string;
        type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
        files: {
            type: string;
            path: string;
            content: string;
            target?: string | undefined;
        }[];
        dependencies: string[];
        title?: string | undefined;
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
        author?: string | undefined;
        $schema?: string | undefined;
        description?: string | undefined;
        devDependencies?: string[] | undefined;
        registryDependencies?: string[] | undefined;
        tailwind?: Record<string, unknown> | undefined;
        cssVars?: Record<string, unknown> | undefined;
        css?: string[] | undefined;
        envVars?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        docs?: string | undefined;
    }[] | undefined;
    $schema?: string | undefined;
    homepage?: string | undefined;
    items?: {
        name: string;
        type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
        files: {
            type: string;
            path: string;
            content: string;
            target?: string | undefined;
        }[];
        dependencies: string[];
        title?: string | undefined;
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
        author?: string | undefined;
        $schema?: string | undefined;
        description?: string | undefined;
        devDependencies?: string[] | undefined;
        registryDependencies?: string[] | undefined;
        tailwind?: Record<string, unknown> | undefined;
        cssVars?: Record<string, unknown> | undefined;
        css?: string[] | undefined;
        envVars?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        docs?: string | undefined;
    }[] | undefined;
}, {
    name?: string | undefined;
    components?: {
        name: string;
        type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
        files: {
            type: string;
            path: string;
            content: string;
            target?: string | undefined;
        }[];
        title?: string | undefined;
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
        author?: string | undefined;
        $schema?: string | undefined;
        description?: string | undefined;
        dependencies?: string[] | undefined;
        devDependencies?: string[] | undefined;
        registryDependencies?: string[] | undefined;
        tailwind?: Record<string, unknown> | undefined;
        cssVars?: Record<string, unknown> | undefined;
        css?: string[] | undefined;
        envVars?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        docs?: string | undefined;
    }[] | undefined;
    $schema?: string | undefined;
    homepage?: string | undefined;
    items?: {
        name: string;
        type: "registry:component" | "registry:lib" | "registry:style" | "registry:block" | "registry:page" | "registry:hook";
        files: {
            type: string;
            path: string;
            content: string;
            target?: string | undefined;
        }[];
        title?: string | undefined;
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
        author?: string | undefined;
        $schema?: string | undefined;
        description?: string | undefined;
        dependencies?: string[] | undefined;
        devDependencies?: string[] | undefined;
        registryDependencies?: string[] | undefined;
        tailwind?: Record<string, unknown> | undefined;
        cssVars?: Record<string, unknown> | undefined;
        css?: string[] | undefined;
        envVars?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        docs?: string | undefined;
    }[] | undefined;
}>;
export type RegistryResponse = z.infer<typeof RegistryResponseSchema>;
