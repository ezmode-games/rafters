import { Button } from '../components';

export function RaftersApp() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-light tracking-tight text-foreground">Rafters</h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The hidden framework that supports good design decisions. Infrastructure for taste.
          </p>

          <div className="pt-6">
            <Button size="lg" className="px-8">
              Explore the Framework
            </Button>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-light mb-6 text-foreground">
                Design taste as conversation
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We're not trying to systematize taste itself—that would kill it. Instead, we
                preserve the moments where taste gets expressed and make that wisdom accessible to
                others.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Like rafters, the best design support is invisible. Essential structure that enables
                everything above.
              </p>
            </div>
            <div className="space-y-6">
              <div className="p-6 border border-border rounded-lg">
                <h3 className="font-medium mb-2 text-foreground">The feeling</h3>
                <p className="text-sm text-muted-foreground">"This felt too heavy"</p>
              </div>
              <div className="p-6 border border-border rounded-lg">
                <h3 className="font-medium mb-2 text-foreground">The insight</h3>
                <p className="text-sm text-muted-foreground">
                  "Buttons are for actions, links are for navigation"
                </p>
              </div>
              <div className="p-6 border border-border rounded-lg">
                <h3 className="font-medium mb-2 text-foreground">The taste</h3>
                <p className="text-sm text-muted-foreground">
                  "Clarity of purpose feels better than versatility"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center space-y-12">
            <h2 className="text-3xl font-light text-foreground">
              Design decisions that understand context
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">For beginners</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "Try this pattern—here's why it usually works"
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">For developing</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "Notice how this creates visual weight? What does that communicate?"
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">For experienced</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "This breaks consistency in an interesting way—does the break serve the content?"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Foundation Section */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-light mb-6 text-foreground">
                Built on semantic foundations
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Components that never reference base tokens directly. All styling flows through
                semantic meaning, enabling systematic evolution without touching component code.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-xl font-light text-foreground">Taste artifacts</h3>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>• The immediate context ("this felt too heavy")</p>
                  <p>• Alternative explorations ("we tried X but it felt wrong")</p>
                  <p>• Aesthetic reasoning ("this creates the right kind of tension")</p>
                  <p>• Usage boundaries ("works for actions, feels weird for navigation")</p>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-light text-foreground">System principles</h3>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>• Essential, not obvious</p>
                  <p>• Substance over style</p>
                  <p>• Earned complexity</p>
                  <p>• Quiet confidence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-sm text-muted-foreground italic">
              The goal isn't to replace taste with systems, but to build systems that help taste
              flourish.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
