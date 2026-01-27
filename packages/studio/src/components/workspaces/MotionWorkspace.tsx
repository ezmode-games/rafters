/**
 * Motion Workspace
 *
 * Massive namespace (~1500 tokens). Design deferred.
 * Shows basic duration/easing editors from existing prototype.
 */

import { EducationalHeader } from '../shared/EducationalHeader';

export function MotionWorkspace() {
  return (
    <div className="p-8">
      <EducationalHeader namespace="motion" title="Motion & Animation">
        <p className="mb-2">
          Motion is the largest namespace in Rafters with approximately 1500 tokens covering
          durations, easings, and choreography patterns.
        </p>
        <p>
          This workspace is still being designed. The scope of motion tokens is as large as the rest
          of the system combined.
        </p>
      </EducationalHeader>

      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-neutral-400">Motion workspace design in progress.</p>
      </div>
    </div>
  );
}
