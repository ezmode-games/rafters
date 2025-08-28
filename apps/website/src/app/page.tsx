import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export default function Home() {
  return (
    <main className="mx-auto w-7xl flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <Header title="Your AI-First Design System" titleClasses="text-4xl leading-3 tracking-wide" />
      <section className="max-w-4xl font-sans text-lg leading-relaxed">
        <p className="mb-6">
          Designers pick a color. We handle the math. AI agents build interfaces that actually work.
        </p>
        <p className="mb-6">
          No more guessing what button variant to use. No more wondering if colors have enough
          contrast. No more AI-generated UIs that look like garbage.
        </p>
        <p className="mb-6">
          Rafters captures why designers make decisions, not just what they chose. When you override
          our mathematical color scale because "the blue needs more pop," we remember that. When AI
          builds the next interface, it knows your brand needs that extra saturation.
        </p>
        <p className="text-base opacity-80">
          Start with grayscale. Add your taste. Ship accessible interfaces. It's that simple.
        </p>
      </section>

      <section className="max-w-4xl w-full mt-16 mb-16">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Initialize Rafters in your project:</p>
              <code className="block bg-gray-900 text-gray-100 p-3 rounded font-mono text-sm">
                npx rafters init
              </code>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Add your first component:</p>
              <code className="block bg-gray-900 text-gray-100 p-3 rounded font-mono text-sm">
                npx rafters add button
              </code>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                That's it. You now have a mathematically-sound, AI-readable design system.
                Components work immediately with grayscale defaults. Run Studio later to add your
                brand personality.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl font-sans text-lg leading-relaxed mt-16 mb-8">
        <p className="mb-6 text-xl font-mono font-semibold">
          shadcn/ui isn't a design system. It's a component library. Big difference.
        </p>
        <p className="mb-6">
          shadcn gives you beautiful, accessible React components. You still need to figure out your
          colors, your spacing scale, your typography ratios, when to use what variant, and why.
          Every team using shadcn makes different decisions. That's fine if you have a designer.
          It's chaos when AI is building your interfaces.
        </p>
        <p className="mb-6">
          Rafters is an actual design system built for AI agents. Mathematical design rules (golden
          ratios, OKLCH color science, Miller's Law) get serialized into JSON. Your designer's
          choices get captured as structured data. Best practices become machine-readable standards.
          Components ship with a registry that tells agents exactly when to use what, why, and how.
        </p>
        <p className="mb-6">
          This isn't documentation for humans to read. It's a structured knowledge base that AI
          agents consume. Every design decision - from your brand's specific blue to why buttons
          need 44px touch targets - lives in a format that machines understand and Git tracks. Your
          AI doesn't guess what button to use; it reads the registry and knows.
        </p>
      </section>

      <section className="max-w-6xl w-full mt-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-6">shadcn/ui</h2>
            <table className="w-full text-left">
              <tbody className="space-y-2">
                <tr className="border-b border-gray-200">
                  <td className="py-3 pr-4">Copy/paste components</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 pr-4">Own your code</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 pr-4">Tailwind styling</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 pr-4">Dark mode</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 pr-4">TypeScript</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 pr-4">Radix UI primitives</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 pr-4">Manual customization</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">Rafters</h2>
            <table className="w-full text-left">
              <tbody className="space-y-2">
                <tr className="border-b border-gray-200">
                  <td className="py-3 pr-4 font-medium">Everything shadcn has, plus:</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 pr-4">JSON registry AI agents can read</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 pr-4">Mathematical design rules serialized</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 pr-4">Human choices as structured data</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 pr-4">Machine-readable best practices</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 pr-4">Component usage standards in .rafters/</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 pr-4">Git-tracked design decisions</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 pr-4">WCAG AAA compliance built-in</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
