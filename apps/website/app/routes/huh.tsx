import type { MetaFunction } from 'react-router';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export const meta: MetaFunction = () => {
  return [
    { title: 'Huh? - Rafters' },
    { name: 'description', content: 'The real story behind why Rafters exists.' },
  ];
};

export default function Huh() {
  return (
    <main className="mx-auto w-7xl flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <Header title="Huh?" titleClasses="text-5xl font-mono font-light leading-wide mb-8" />

      <section className="max-w-4xl font-sans text-lg leading-relaxed">
        <p className="text-xl mb-8">
          You're probably wondering why another design system exists. Here's the real story.
        </p>

        <h2 className="text-2xl font-mono font-light leading-wide mb-6 mt-12">
          The Problem: AI Has No Taste
        </h2>
        <p className="mb-6">
          We tried everything. Built scrapers that collected the top 15,000 websites and their CSS.
          Fed massive vector databases full of design examples to AI models. Documented every design
          principle we could think of.
        </p>

        <p className="mb-6">
          The AI didn't care. It would rush in, pattern match on surface-level similarities, and
          generate interfaces that looked technically correct but felt completely wrong. Bad
          spacing. Poor hierarchy. Accessibility violations. No sense of rhythm or proportion.
        </p>

        <p className="mb-6">
          By the time anyone realized the AI had made a mess, it was too late. The damage was done.
        </p>

        <h2 className="text-2xl font-mono font-light leading-wide mb-6 mt-12">
          The Insight: Stop Teaching Taste, Embed It
        </h2>
        <p className="mb-6">
          We realized we were solving the wrong problem. Instead of trying to teach AI aesthetic
          judgment (which may never work), we decided to embed human design intelligence directly
          into the system itself.
        </p>

        <p className="mb-6">
          Every component carries embedded reasoning: cognitive load ratings, trust levels,
          accessibility guidance, usage context. Every token has mathematical relationships and
          semantic meaning. Every interaction pattern includes the human thinking behind it.
        </p>

        <h2 className="text-2xl font-mono font-light leading-wide mb-6 mt-12">How It Works</h2>
        <p className="mb-6">
          <strong>By default, it mostly works.</strong> The mathematical spacing, semantic colors,
          and proper accessibility ratings mean even lazy implementations won't be disasters.
        </p>

        <p className="mb-6">
          <strong>Container and grid do the heavy lifting.</strong> Good layout systems handle most
          visual structure automatically, so you can't mess up the fundamentals.
        </p>

        <p className="mb-6">
          <strong>Rich metadata when you need to think.</strong> When someone says "this feels
          wrong" or "this is confusing," all the design intelligence is right there. Instead of
          guessing, you can look up the cognitive load, trust requirements, and usage patterns.
        </p>

        <h2 className="text-2xl font-mono font-light leading-wide mb-6 mt-12">The Result</h2>
        <p className="mb-6">
          A design system that works even when you don't fully understand design. AI agents can
          build decent interfaces by default, then access human design intelligence when they need
          to make deeper decisions.
        </p>

        <p className="mb-6">
          It's not about teaching machines taste. It's about making it impossible for them to
          exercise bad taste in the first place.
        </p>

        <h2 className="text-2xl font-mono font-light leading-wide mb-6 mt-12">Why "Rafters"?</h2>
        <p className="mb-6">
          Rafters hold up buildings. They're structural, essential, mostly invisible - but
          everything depends on them being solid. Good design systems are the same way. They should
          work quietly in the background, supporting everything you build on top.
        </p>

        <p className="mb-6">
          Plus, if you've ever tried to build something without proper structural support, you know
          how quickly it all falls apart. Same with interfaces built without design intelligence.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mt-12">
          <h3 className="text-xl font-mono font-light leading-wide mb-4">Still confused?</h3>
          <p className="mb-4">
            That's fair. We're trying to solve a problem most people don't even know exists yet.
            AI-generated interfaces are about to flood the world, and most of them are going to be
            terrible.
          </p>
          <p>Rafters is our attempt to fix that before it becomes everyone's problem.</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
