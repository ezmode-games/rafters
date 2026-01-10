import type { ComponentType } from 'react';
import { AccordionDemo } from './AccordionDemo';
import { AlertDemo, AlertVariants } from './AlertDemo';
import { AvatarDemo, AvatarSizes } from './AvatarDemo';
import { BadgeDemo, BadgeVariants } from './BadgeDemo';
// Import all demos
import { ButtonDemo, ButtonSizes, ButtonVariants } from './ButtonDemo';
import { CardDemo } from './CardDemo';
import { CheckboxDemo, CheckboxVariants } from './CheckboxDemo';
import { DialogDemo } from './DialogDemo';
import { InputDemo, InputSizes, InputVariants } from './InputDemo';
import { KbdDemo, KbdVariants } from './KbdDemo';
import { LabelDemo, LabelVariants } from './LabelDemo';
import { PopoverDemo } from './PopoverDemo';
import { ProgressDemo, ProgressVariants } from './ProgressDemo';
import { SelectDemo } from './SelectDemo';
import { SeparatorDemo } from './SeparatorDemo';
import { SkeletonDemo, SkeletonVariants } from './SkeletonDemo';
import { SliderDemo, SliderVariants } from './SliderDemo';
import { SpinnerDemo, SpinnerVariants } from './SpinnerDemo';
import { SwitchDemo, SwitchVariants } from './SwitchDemo';
import { TabsDemo } from './TabsDemo';
import { TextareaDemo, TextareaVariants } from './TextareaDemo';
import { ToggleDemo, ToggleVariants } from './ToggleDemo';
import { TooltipDemo } from './TooltipDemo';

// Registry of component demos
type DemoEntry = {
  default: ComponentType;
  variants?: ComponentType;
  sizes?: ComponentType;
};

const demoRegistry: Record<string, DemoEntry> = {
  button: { default: ButtonDemo, variants: ButtonVariants, sizes: ButtonSizes },
  input: { default: InputDemo, variants: InputVariants, sizes: InputSizes },
  badge: { default: BadgeDemo, variants: BadgeVariants },
  card: { default: CardDemo },
  checkbox: { default: CheckboxDemo, variants: CheckboxVariants },
  switch: { default: SwitchDemo, variants: SwitchVariants },
  alert: { default: AlertDemo, variants: AlertVariants },
  avatar: { default: AvatarDemo, sizes: AvatarSizes },
  progress: { default: ProgressDemo, variants: ProgressVariants },
  skeleton: { default: SkeletonDemo, variants: SkeletonVariants },
  separator: { default: SeparatorDemo },
  label: { default: LabelDemo, variants: LabelVariants },
  textarea: { default: TextareaDemo, variants: TextareaVariants },
  slider: { default: SliderDemo, variants: SliderVariants },
  tabs: { default: TabsDemo },
  toggle: { default: ToggleDemo, variants: ToggleVariants },
  tooltip: { default: TooltipDemo },
  dialog: { default: DialogDemo },
  popover: { default: PopoverDemo },
  select: { default: SelectDemo },
  accordion: { default: AccordionDemo },
  spinner: { default: SpinnerDemo, variants: SpinnerVariants },
  kbd: { default: KbdDemo, variants: KbdVariants },
};

interface ComponentDemoProps {
  name: string;
  type?: 'default' | 'variants' | 'sizes';
}

export function ComponentDemo({ name, type = 'default' }: ComponentDemoProps) {
  const entry = demoRegistry[name];

  if (!entry) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">
          Demo for <code className="font-mono bg-muted px-1">{name}</code> coming soon
        </p>
      </div>
    );
  }

  const Demo =
    type === 'variants' ? entry.variants : type === 'sizes' ? entry.sizes : entry.default;

  if (!Demo) {
    return (
      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground">No {type} demo available</p>
      </div>
    );
  }

  return <Demo />;
}

// Check if a demo exists for a component
export function hasDemoFor(name: string): boolean {
  return name in demoRegistry;
}

// Get available demo types for a component
export function getDemoTypes(name: string): ('default' | 'variants' | 'sizes')[] {
  const entry = demoRegistry[name];
  if (!entry) return [];

  const types: ('default' | 'variants' | 'sizes')[] = ['default'];
  if (entry.variants) types.push('variants');
  if (entry.sizes) types.push('sizes');
  return types;
}
