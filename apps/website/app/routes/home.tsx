import type { Route } from './+types/home';

export function meta(_args: Route.MetaArgs) {
  return [{ title: 'Rafters' }, { name: 'description', content: 'Rafters Design System' }];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: 'Rafters' };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Welcome to Rafters</h1>
      <p>{loaderData.message}</p>
    </div>
  );
}
