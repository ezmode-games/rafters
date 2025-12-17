import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { Schema as HonoSchema } from 'hono';

export interface AppBindings {
  Bindings: Env;
}

export type AppOpenAPI<S extends HonoSchema = HonoSchema> = OpenAPIHono<AppBindings & S>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;
