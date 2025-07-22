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
    name: z.ZodString;
    version: z.ZodString;
    description: z.ZodString;
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
    files: z.ZodObject<{
        component: z.ZodString;
        story: z.ZodOptional<z.ZodString>;
        types: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        component: string;
        story?: string | undefined;
        types?: string | undefined;
    }, {
        component: string;
        story?: string | undefined;
        types?: string | undefined;
    }>;
    dependencies: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    version: string;
    name: string;
    description: string;
    intelligence: {
        cognitiveLoad: number;
        attentionEconomics: string;
        accessibility: string;
        trustBuilding: string;
        semanticMeaning: string;
    };
    files: {
        component: string;
        story?: string | undefined;
        types?: string | undefined;
    };
    dependencies: string[];
}, {
    version: string;
    name: string;
    description: string;
    intelligence: {
        cognitiveLoad: number;
        attentionEconomics: string;
        accessibility: string;
        trustBuilding: string;
        semanticMeaning: string;
    };
    files: {
        component: string;
        story?: string | undefined;
        types?: string | undefined;
    };
    dependencies: string[];
}>;
export declare const RegistrySchema: z.ZodObject<{
    components: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
        description: z.ZodString;
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
        files: z.ZodObject<{
            component: z.ZodString;
            story: z.ZodOptional<z.ZodString>;
            types: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            component: string;
            story?: string | undefined;
            types?: string | undefined;
        }, {
            component: string;
            story?: string | undefined;
            types?: string | undefined;
        }>;
        dependencies: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        version: string;
        name: string;
        description: string;
        intelligence: {
            cognitiveLoad: number;
            attentionEconomics: string;
            accessibility: string;
            trustBuilding: string;
            semanticMeaning: string;
        };
        files: {
            component: string;
            story?: string | undefined;
            types?: string | undefined;
        };
        dependencies: string[];
    }, {
        version: string;
        name: string;
        description: string;
        intelligence: {
            cognitiveLoad: number;
            attentionEconomics: string;
            accessibility: string;
            trustBuilding: string;
            semanticMeaning: string;
        };
        files: {
            component: string;
            story?: string | undefined;
            types?: string | undefined;
        };
        dependencies: string[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    components: {
        version: string;
        name: string;
        description: string;
        intelligence: {
            cognitiveLoad: number;
            attentionEconomics: string;
            accessibility: string;
            trustBuilding: string;
            semanticMeaning: string;
        };
        files: {
            component: string;
            story?: string | undefined;
            types?: string | undefined;
        };
        dependencies: string[];
    }[];
}, {
    components: {
        version: string;
        name: string;
        description: string;
        intelligence: {
            cognitiveLoad: number;
            attentionEconomics: string;
            accessibility: string;
            trustBuilding: string;
            semanticMeaning: string;
        };
        files: {
            component: string;
            story?: string | undefined;
            types?: string | undefined;
        };
        dependencies: string[];
    }[];
}>;
export type Intelligence = z.infer<typeof IntelligenceSchema>;
export type ComponentManifest = z.infer<typeof ComponentManifestSchema>;
export type Registry = z.infer<typeof RegistrySchema>;
export declare function fetchComponentRegistry(): Promise<Registry>;
export declare function fetchComponent(componentName: string): Promise<ComponentManifest | null>;
