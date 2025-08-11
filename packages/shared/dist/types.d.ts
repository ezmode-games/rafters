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
}, z.core.$strip>;
export type OKLCH = z.infer<typeof OKLCHSchema>;
export declare const ColorVisionTypeSchema: z.ZodEnum<{
    normal: "normal";
    deuteranopia: "deuteranopia";
    protanopia: "protanopia";
    tritanopia: "tritanopia";
}>;
export type ColorVisionType = z.infer<typeof ColorVisionTypeSchema>;
export declare const ContrastLevelSchema: z.ZodEnum<{
    AA: "AA";
    AAA: "AAA";
}>;
export type ContrastLevel = z.infer<typeof ContrastLevelSchema>;
export declare const ComponentIntelligenceSchema: z.ZodObject<{
    cognitiveLoad: z.ZodNumber;
    attentionHierarchy: z.ZodString;
    safetyConstraints: z.ZodOptional<z.ZodString>;
    accessibilityRules: z.ZodString;
    usageContext: z.ZodString;
    decisionConstraints: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ComponentIntelligence = z.infer<typeof ComponentIntelligenceSchema>;
export declare const SemanticTokenSchema: z.ZodObject<{
    name: z.ZodString;
    value: z.ZodString;
    type: z.ZodEnum<{
        color: "color";
        spacing: "spacing";
        typography: "typography";
        shadow: "shadow";
        border: "border";
    }>;
    semantic: z.ZodString;
    aiIntelligence: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SemanticToken = z.infer<typeof SemanticTokenSchema>;
export declare const DesignSystemSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    primaryColor: z.ZodObject<{
        l: z.ZodNumber;
        c: z.ZodNumber;
        h: z.ZodNumber;
        alpha: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    tokens: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodString;
        type: z.ZodEnum<{
            color: "color";
            spacing: "spacing";
            typography: "typography";
            shadow: "shadow";
            border: "border";
        }>;
        semantic: z.ZodString;
        aiIntelligence: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    typography: z.ZodObject<{
        heading: z.ZodString;
        body: z.ZodString;
        mono: z.ZodString;
        scale: z.ZodRecord<z.ZodString, z.ZodNumber>;
    }, z.core.$strip>;
    intelligence: z.ZodObject<{
        colorVisionTested: z.ZodArray<z.ZodEnum<{
            normal: "normal";
            deuteranopia: "deuteranopia";
            protanopia: "protanopia";
            tritanopia: "tritanopia";
        }>>;
        contrastLevel: z.ZodEnum<{
            AA: "AA";
            AAA: "AAA";
        }>;
        components: z.ZodRecord<z.ZodString, z.ZodObject<{
            cognitiveLoad: z.ZodNumber;
            attentionHierarchy: z.ZodString;
            safetyConstraints: z.ZodOptional<z.ZodString>;
            accessibilityRules: z.ZodString;
            usageContext: z.ZodString;
            decisionConstraints: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    metadata: z.ZodObject<{
        created: z.ZodString;
        updated: z.ZodString;
        version: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type DesignSystem = z.infer<typeof DesignSystemSchema>;
export declare const ComponentRegistrySchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<{
        "registry:component": "registry:component";
        "registry:lib": "registry:lib";
        "registry:style": "registry:style";
        "registry:block": "registry:block";
        "registry:page": "registry:page";
        "registry:hook": "registry:hook";
    }>;
    files: z.ZodArray<z.ZodString>;
    meta: z.ZodObject<{
        rafters: z.ZodObject<{
            intelligence: z.ZodObject<{
                cognitiveLoad: z.ZodNumber;
                attentionEconomics: z.ZodString;
                accessibility: z.ZodString;
                trustBuilding: z.ZodString;
                semanticMeaning: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ComponentRegistry = z.infer<typeof ComponentRegistrySchema>;
export declare const PublicDesignSystemSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    author: z.ZodOptional<z.ZodString>;
    primaryColor: z.ZodString;
    popularity: z.ZodDefault<z.ZodNumber>;
    downloads: z.ZodDefault<z.ZodNumber>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
    preview: z.ZodOptional<z.ZodString>;
    created: z.ZodString;
}, z.core.$strip>;
export type PublicDesignSystem = z.infer<typeof PublicDesignSystemSchema>;
export declare const ComponentManifestSchema: z.ZodObject<{
    $schema: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    type: z.ZodEnum<{
        "registry:component": "registry:component";
        "registry:lib": "registry:lib";
        "registry:style": "registry:style";
        "registry:block": "registry:block";
        "registry:page": "registry:page";
        "registry:hook": "registry:hook";
    }>;
    description: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    author: z.ZodOptional<z.ZodString>;
    dependencies: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    devDependencies: z.ZodOptional<z.ZodArray<z.ZodString>>;
    registryDependencies: z.ZodOptional<z.ZodArray<z.ZodString>>;
    files: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        content: z.ZodString;
        type: z.ZodString;
        target: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    tailwind: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    cssVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    css: z.ZodOptional<z.ZodArray<z.ZodString>>;
    envVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    categories: z.ZodOptional<z.ZodArray<z.ZodString>>;
    docs: z.ZodOptional<z.ZodString>;
    meta: z.ZodOptional<z.ZodObject<{
        rafters: z.ZodOptional<z.ZodObject<{
            intelligence: z.ZodObject<{
                cognitiveLoad: z.ZodNumber;
                attentionEconomics: z.ZodString;
                accessibility: z.ZodString;
                trustBuilding: z.ZodString;
                semanticMeaning: z.ZodString;
            }, z.core.$strip>;
            version: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ComponentManifest = z.infer<typeof ComponentManifestSchema>;
export declare const RegistryResponseSchema: z.ZodObject<{
    $schema: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    homepage: z.ZodOptional<z.ZodString>;
    components: z.ZodOptional<z.ZodArray<z.ZodObject<{
        $schema: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        type: z.ZodEnum<{
            "registry:component": "registry:component";
            "registry:lib": "registry:lib";
            "registry:style": "registry:style";
            "registry:block": "registry:block";
            "registry:page": "registry:page";
            "registry:hook": "registry:hook";
        }>;
        description: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        author: z.ZodOptional<z.ZodString>;
        dependencies: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
        devDependencies: z.ZodOptional<z.ZodArray<z.ZodString>>;
        registryDependencies: z.ZodOptional<z.ZodArray<z.ZodString>>;
        files: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            content: z.ZodString;
            type: z.ZodString;
            target: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        tailwind: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        cssVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        css: z.ZodOptional<z.ZodArray<z.ZodString>>;
        envVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        categories: z.ZodOptional<z.ZodArray<z.ZodString>>;
        docs: z.ZodOptional<z.ZodString>;
        meta: z.ZodOptional<z.ZodObject<{
            rafters: z.ZodOptional<z.ZodObject<{
                intelligence: z.ZodObject<{
                    cognitiveLoad: z.ZodNumber;
                    attentionEconomics: z.ZodString;
                    accessibility: z.ZodString;
                    trustBuilding: z.ZodString;
                    semanticMeaning: z.ZodString;
                }, z.core.$strip>;
                version: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>>;
    items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        $schema: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        type: z.ZodEnum<{
            "registry:component": "registry:component";
            "registry:lib": "registry:lib";
            "registry:style": "registry:style";
            "registry:block": "registry:block";
            "registry:page": "registry:page";
            "registry:hook": "registry:hook";
        }>;
        description: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        author: z.ZodOptional<z.ZodString>;
        dependencies: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
        devDependencies: z.ZodOptional<z.ZodArray<z.ZodString>>;
        registryDependencies: z.ZodOptional<z.ZodArray<z.ZodString>>;
        files: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            content: z.ZodString;
            type: z.ZodString;
            target: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        tailwind: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        cssVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        css: z.ZodOptional<z.ZodArray<z.ZodString>>;
        envVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        categories: z.ZodOptional<z.ZodArray<z.ZodString>>;
        docs: z.ZodOptional<z.ZodString>;
        meta: z.ZodOptional<z.ZodObject<{
            rafters: z.ZodOptional<z.ZodObject<{
                intelligence: z.ZodObject<{
                    cognitiveLoad: z.ZodNumber;
                    attentionEconomics: z.ZodString;
                    accessibility: z.ZodString;
                    trustBuilding: z.ZodString;
                    semanticMeaning: z.ZodString;
                }, z.core.$strip>;
                version: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type RegistryResponse = z.infer<typeof RegistryResponseSchema>;
