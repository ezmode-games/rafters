import { Button } from 'rafters-ui';
import type { Route } from './+types/home';

export function meta(_args: Route.MetaArgs) {
  return [
    { title: 'Rafters - AI-First Design Intelligence System' },
    {
      name: 'description',
      content:
        'Design system with embedded human reasoning for AI agents. Create better user experiences through systematic design intelligence.',
    },
    {
      name: 'keywords',
      content:
        'design system, ai, design intelligence, components, accessibility, design tokens, semantic design',
    },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return {
    message: 'Design Intelligence for AI Agents',
    tagline:
      'Components with embedded human design reasoning enable AI to make informed UX decisions',
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Attention Economics: Clear hierarchy */}
      <header className="container mx-auto px-6 pt-16 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Rafters Design System
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {loaderData.tagline}
          </p>

          {/* Trust Building: Clear primary action */}
          <div className="flex gap-4 justify-center">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              View Components
            </Button>
          </div>
        </div>
      </header>

      {/* Design Intelligence Preview - Cognitive Load: Progressive disclosure */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">
            How AI Agents Use Design Intelligence
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Cognitive Load Intelligence */}
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 text-card-foreground">
                🧠 Cognitive Load Awareness
              </h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                Components include cognitive load ratings (1-10 scale) that help AI choose
                appropriate complexity levels for user mental capacity.
              </p>
              <div className="text-xs font-mono bg-muted p-3 rounded">
                cognitiveLoad: 7/10
                <br />
                pattern: "progressive-disclosure"
              </div>
            </div>

            {/* Trust Building Intelligence */}
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 text-card-foreground">
                🔒 Trust Building Patterns
              </h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                Embedded guidance teaches AI when to add friction, confirmation patterns, and
                recovery mechanisms for user confidence.
              </p>
              <div className="text-xs font-mono bg-muted p-3 rounded">
                trustLevel: "critical"
                <br />
                requires: "confirmation-flow"
              </div>
            </div>

            {/* Attention Economics */}
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 text-card-foreground">
                👁️ Attention Economics
              </h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                Visual hierarchy rules guide AI on information priority, ensuring user focus goes to
                what matters most.
              </p>
              <div className="text-xs font-mono bg-muted p-3 rounded">
                attention: "primary"
                <br />
                maxPerSection: 1
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Component Showcase - Negative Space: Breathing room */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold mb-8">Intelligent Components</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Every component includes systematic design reasoning that AI agents can read and apply
              for better user experiences.
            </p>

            {/* Component Examples */}
            <div className="flex gap-4 justify-center flex-wrap">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              Each button variant carries semantic meaning and usage rules for AI decision-making
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action - Progressive Enhancement */}
      <footer className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Build with Intelligence?</h2>
          <p className="text-muted-foreground mb-8">
            Start creating user experiences that leverage embedded design reasoning for systematic,
            accessible, and delightful interfaces.
          </p>

          <Button variant="primary" size="lg">
            Explore the Design System
          </Button>
        </div>
      </footer>
    </div>
  );
}
