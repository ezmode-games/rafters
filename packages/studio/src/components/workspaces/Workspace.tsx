/**
 * Workspace
 *
 * Post-first-run workspace. Shows namespace content with sidebar navigation.
 * GSAP crossfades between namespaces.
 */

import { useRef } from 'react';
import { useStudioState } from '../../context/StudioContext';
import { useGSAP } from '../../lib/animation';
import { Sidebar } from '../sidebar/Sidebar';
import { ColorWorkspace } from './ColorWorkspace';
import { DepthWorkspace } from './DepthWorkspace';
import { MotionWorkspace } from './MotionWorkspace';
import { RadiusWorkspace } from './RadiusWorkspace';
import { SpacingWorkspace } from './SpacingWorkspace';
import { TypographyWorkspace } from './TypographyWorkspace';

function NamespaceContent() {
  const { activeNamespace } = useStudioState();

  switch (activeNamespace) {
    case 'color':
      return <ColorWorkspace />;
    case 'spacing':
      return <SpacingWorkspace />;
    case 'typography':
      return <TypographyWorkspace />;
    case 'radius':
      return <RadiusWorkspace />;
    case 'depth':
      return <DepthWorkspace />;
    case 'motion':
      return <MotionWorkspace />;
    default:
      return <ColorWorkspace />;
  }
}

export function Workspace() {
  const { containerRef } = useGSAP();
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="flex h-full w-full">
      <Sidebar />
      <main ref={contentRef} className="flex-1 overflow-auto">
        <NamespaceContent />
      </main>
    </div>
  );
}
