declare module "cloudflare:test" {
  // Controls the type of `import("cloudflare:test").env`
  interface ProvidedEnv {
    SEED_QUEUE_API_KEY: string;
    COLOR_SEED_QUEUE: Queue;
    VECTORIZE: VectorizeIndex;
    AI: Ai;
    CLAUDE_API_KEY: string;
    CF_TOKEN: string;
    CLAUDE_GATEWAY_URL: string;
  }
}