import type { Namespace } from '../schemas/namespace.js';

export type ValidationIssue =
  | {
      code: 'schema-violation';
      path: PropertyKey[];
      message: string;
    }
  | {
      code: 'id-collision';
      tokenId: string;
      count: number;
    }
  | {
      code: 'namespace-mismatch';
      tokenId: string;
      declared: Namespace;
      idPrefix: string;
    }
  | {
      code: 'unknown-dependency-source';
      tokenId: string;
      source: string;
    }
  | {
      code: 'unknown-dependency-plugin';
      tokenId: string;
      plugin: string;
    }
  | {
      code: 'cycle';
      cycle: string[];
    };
