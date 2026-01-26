/**
 * Editor Playground - Main component with tab navigation
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@rafters/ui/components/ui/tabs';
import type * as React from 'react';
import { useState } from 'react';
import { ComponentIsolation } from './ComponentIsolation';
import { FullEditorDemo } from './FullEditorDemo';

export function EditorPlayground(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'full' | 'components'>('full');

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex-shrink-0 border-b bg-muted/30">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </a>
            <span className="text-muted-foreground">/</span>
            <h1 className="text-xl font-semibold">Editor Playground</h1>
          </div>
          <a
            href="/gallery"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Component Gallery
          </a>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'full' | 'components')}>
            <TabsList className="border-b-0">
              <TabsTrigger value="full" className="data-[state=active]:bg-background">
                Full Editor
              </TabsTrigger>
              <TabsTrigger value="components" className="data-[state=active]:bg-background">
                Components
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="full" className="h-full m-0 p-0 data-[state=active]:flex flex-col">
            <FullEditorDemo />
          </TabsContent>
          <TabsContent
            value="components"
            className="h-full m-0 p-0 data-[state=active]:flex flex-col"
          >
            <ComponentIsolation />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default EditorPlayground;
