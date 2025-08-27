import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
	return [
		{ title: "Rafters | AI First Design System" },
		{ name: "description", content: "Welcome to Rafters!" },
	];
}

export function loader({ context }: Route.LoaderArgs) {
	return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return (
		<main className="mx-auto w-7xl flex min-h-screen flex-col items-center justify-center gap-6 p-4">
			<img src="/logo.svg" className="h-16" alt="Rafters Logo" />
			<h1>Welcome to Rafters!</h1>
			<p>{loaderData.message}</p>
		</main>
	);
}
