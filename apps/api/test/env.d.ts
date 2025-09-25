declare module "cloudflare:test" {
  // Controls the type of `import("cloudflare:test").env`
  interface ProvidedEnv {
    SEED_QUEUE_API_KEY: string;
    CLOUDFLARE_ACCOUNT_ID: string;
    CLOUDFLARE_DATABASE_ID: string;
    CLOUDFLARE_D1_TOKEN: string;
    DB: D1Database;
    COLOR_SEED_QUEUE: Queue;
    VECTORIZE: VectorizeIndex;
    AI: Ai;
    CLAUDE_API_KEY: string;
    CF_TOKEN: string;
    CLAUDE_GATEWAY_URL: string;
  }
}