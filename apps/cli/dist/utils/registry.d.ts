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
}, z.core.$strip>;
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
export declare const RegistrySchema: z.ZodObject<{
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
