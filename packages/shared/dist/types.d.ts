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
    value: string;
    type: "color" | "spacing" | "typography" | "shadow" | "border";
    name: string;
    semantic: string;
    aiIntelligence?: string | undefined;
}, {
    value: string;
    type: "color" | "spacing" | "typography" | "shadow" | "border";
    name: string;
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
        value: string;
        type: "color" | "spacing" | "typography" | "shadow" | "border";
        name: string;
        semantic: string;
        aiIntelligence?: string | undefined;
    }, {
        value: string;
        type: "color" | "spacing" | "typography" | "shadow" | "border";
        name: string;
        semantic: string;
        aiIntelligence?: string | undefined;
    }>, "many">;
    typography: z.ZodObject<{
        heading: z.ZodString;
        body: z.ZodString;
        mono: z.ZodString;
        scale: z.ZodRecord<z.ZodString, z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        heading: string;
        body: string;
        mono: string;
        scale: Record<string, number>;
    }, {
        heading: string;
        body: string;
        mono: string;
        scale: Record<string, number>;
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
        created: string;
        updated: string;
        version: string;
    }, {
        created: string;
        updated: string;
        version: string;
    }>;
}, "strip", z.ZodTypeAny, {
    name: string;
    typography: {
        heading: string;
        body: string;
        mono: string;
        scale: Record<string, number>;
    };
    id: string;
    primaryColor: {
        l: number;
        c: number;
        h: number;
        alpha?: number | undefined;
    };
    tokens: {
        value: string;
        type: "color" | "spacing" | "typography" | "shadow" | "border";
        name: string;
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
        created: string;
        updated: string;
        version: string;
    };
}, {
    name: string;
    typography: {
        heading: string;
        body: string;
        mono: string;
        scale: Record<string, number>;
    };
    id: string;
    primaryColor: {
        l: number;
        c: number;
        h: number;
        alpha?: number | undefined;
    };
    tokens: {
        value: string;
        type: "color" | "spacing" | "typography" | "shadow" | "border";
        name: string;
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
        created: string;
        updated: string;
        version: string;
    };
}>;
export type DesignSystem = z.infer<typeof DesignSystemSchema>;
export declare const ComponentRegistrySchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodLiteral<"registry:component">;
    files: z.ZodArray<z.ZodString, "many">;
    meta: z.ZodObject<{
        rafters: z.ZodObject<{
            aiIntelligence: z.ZodObject<{
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
        }, "strip", z.ZodTypeAny, {
            aiIntelligence: {
                cognitiveLoad: number;
                attentionHierarchy: string;
                accessibilityRules: string;
                usageContext: string;
                safetyConstraints?: string | undefined;
                decisionConstraints?: string | undefined;
            };
        }, {
            aiIntelligence: {
                cognitiveLoad: number;
                attentionHierarchy: string;
                accessibilityRules: string;
                usageContext: string;
                safetyConstraints?: string | undefined;
                decisionConstraints?: string | undefined;
            };
        }>;
    }, "strip", z.ZodTypeAny, {
        rafters: {
            aiIntelligence: {
                cognitiveLoad: number;
                attentionHierarchy: string;
                accessibilityRules: string;
                usageContext: string;
                safetyConstraints?: string | undefined;
                decisionConstraints?: string | undefined;
            };
        };
    }, {
        rafters: {
            aiIntelligence: {
                cognitiveLoad: number;
                attentionHierarchy: string;
                accessibilityRules: string;
                usageContext: string;
                safetyConstraints?: string | undefined;
                decisionConstraints?: string | undefined;
            };
        };
    }>;
}, "strip", z.ZodTypeAny, {
    type: "registry:component";
    name: string;
    files: string[];
    meta: {
        rafters: {
            aiIntelligence: {
                cognitiveLoad: number;
                attentionHierarchy: string;
                accessibilityRules: string;
                usageContext: string;
                safetyConstraints?: string | undefined;
                decisionConstraints?: string | undefined;
            };
        };
    };
}, {
    type: "registry:component";
    name: string;
    files: string[];
    meta: {
        rafters: {
            aiIntelligence: {
                cognitiveLoad: number;
                attentionHierarchy: string;
                accessibilityRules: string;
                usageContext: string;
                safetyConstraints?: string | undefined;
                decisionConstraints?: string | undefined;
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
    name: string;
    id: string;
    primaryColor: string;
    created: string;
    popularity: number;
    downloads: number;
    tags: string[];
    author?: string | undefined;
    preview?: string | undefined;
}, {
    name: string;
    id: string;
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
    version: z.ZodString;
    description: z.ZodString;
    type: z.ZodLiteral<"registry:component">;
    category: z.ZodString;
    dependencies: z.ZodArray<z.ZodString, "many">;
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
    files: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        name: string;
        content: string;
    }, {
        type: string;
        name: string;
        content: string;
    }>, "many">;
    lastUpdated: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "registry:component";
    name: string;
    intelligence: {
        cognitiveLoad: number;
        attentionEconomics: string;
        accessibility: string;
        trustBuilding: string;
        semanticMeaning: string;
    };
    version: string;
    files: {
        type: string;
        name: string;
        content: string;
    }[];
    description: string;
    category: string;
    dependencies: string[];
    lastUpdated: string;
    $schema?: string | undefined;
}, {
    type: "registry:component";
    name: string;
    intelligence: {
        cognitiveLoad: number;
        attentionEconomics: string;
        accessibility: string;
        trustBuilding: string;
        semanticMeaning: string;
    };
    version: string;
    files: {
        type: string;
        name: string;
        content: string;
    }[];
    description: string;
    category: string;
    dependencies: string[];
    lastUpdated: string;
    $schema?: string | undefined;
}>;
export type ComponentManifest = z.infer<typeof ComponentManifestSchema>;
