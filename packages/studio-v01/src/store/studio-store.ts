import { z } from 'zod';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Zod schemas for type safety
export const SectionSchema = z.enum(['color', 'typography', 'spacing', 'depth']);
export type Section = z.infer<typeof SectionSchema>;

export const StudioStateSchema = z.object({
  currentSection: SectionSchema.nullable(),
  completedSections: z.set(SectionSchema),
  progressiveScale: z.number().min(0.6).max(1.0),
  isTransitioning: z.boolean(),
});

export type StudioState = z.infer<typeof StudioStateSchema>;

// Store actions interface
interface StudioActions {
  // Section management
  setCurrentSection: (section: Section | null) => void;
  completeSection: (section: Section) => void;
  resetSection: (section: Section) => void;

  // Workflow helpers
  moveToNextSection: () => void;
  focusSection: (section: Section) => void;

  // Animation state
  setTransitioning: (transitioning: boolean) => void;

  // System management
  reset: () => void;
  getProgress: () => number;
  isSystemComplete: () => boolean;
}

type StudioStore = StudioState & StudioActions;

// Section flow order
const sectionFlow: Section[] = ['color', 'typography', 'spacing', 'depth'];

// Initial state
const initialState: StudioState = {
  currentSection: 'color',
  completedSections: new Set(),
  progressiveScale: 1.0,
  isTransitioning: false,
};

// Create Zustand store with Zod validation
export const useStudioStore = create<StudioStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialState,

      // Section management
      setCurrentSection: (section) => {
        const state = get();

        // Validate with Zod
        const parsedSection = section ? SectionSchema.parse(section) : null;

        set(
          {
            currentSection: parsedSection,
            // Adjust progressive scale based on completed sections
            progressiveScale: state.completedSections.size >= 2 ? 0.8 : 1.0,
          },
          false,
          'setCurrentSection'
        );
      },

      completeSection: (section) => {
        const state = get();
        const parsedSection = SectionSchema.parse(section);

        const newCompletedSections = new Set(state.completedSections);
        newCompletedSections.add(parsedSection);

        set(
          {
            completedSections: newCompletedSections,
            progressiveScale: newCompletedSections.size >= 2 ? 0.8 : 1.0,
          },
          false,
          'completeSection'
        );
      },

      resetSection: (section) => {
        const state = get();
        const parsedSection = SectionSchema.parse(section);

        const newCompletedSections = new Set(state.completedSections);
        newCompletedSections.delete(parsedSection);

        set(
          {
            completedSections: newCompletedSections,
            progressiveScale: newCompletedSections.size >= 2 ? 0.8 : 1.0,
          },
          false,
          'resetSection'
        );
      },

      // Workflow helpers
      moveToNextSection: () => {
        const state = get();
        if (!state.currentSection) return;

        const currentIndex = sectionFlow.indexOf(state.currentSection);
        const nextSection = sectionFlow[currentIndex + 1];

        if (nextSection) {
          get().setCurrentSection(nextSection);
        }
      },

      focusSection: (section) => {
        const parsedSection = SectionSchema.parse(section);
        get().setCurrentSection(parsedSection);
      },

      // Animation state
      setTransitioning: (transitioning) => {
        set({ isTransitioning: transitioning }, false, 'setTransitioning');
      },

      // System management
      reset: () => {
        set(initialState, false, 'reset');
      },

      getProgress: () => {
        const state = get();
        return (state.completedSections.size / sectionFlow.length) * 100;
      },

      isSystemComplete: () => {
        const state = get();
        return state.completedSections.size === sectionFlow.length;
      },
    }),
    {
      name: 'studio-store',
      // Only serialize plain objects, not Sets
      serialize: {
        options: {
          map: {
            completedSections: {
              serialize: (set: Set<Section>) => Array.from(set),
              deserialize: (arr: Section[]) => new Set(arr),
            },
          },
        },
      },
    }
  )
);

// Validation helper
export const validateStudioState = (state: unknown): StudioState => {
  return StudioStateSchema.parse(state);
};

// Selector hooks for optimized renders
export const useCurrentSection = () => useStudioStore((state) => state.currentSection);
export const useCompletedSections = () => useStudioStore((state) => state.completedSections);
export const useProgressiveScale = () => useStudioStore((state) => state.progressiveScale);
export const useIsTransitioning = () => useStudioStore((state) => state.isTransitioning);
export const useProgress = () => useStudioStore((state) => state.getProgress());
export const useIsSystemComplete = () => useStudioStore((state) => state.isSystemComplete());
