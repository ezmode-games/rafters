import { Kbd } from '@rafters/ui/components/ui/kbd';

export function KbdDemo() {
  return (
    <div className="flex gap-2 items-center justify-center">
      <Kbd>Ctrl</Kbd>
      <span className="text-muted-foreground">+</span>
      <Kbd>C</Kbd>
    </div>
  );
}

export function KbdVariants() {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-center">
      <div className="flex gap-1 items-center">
        <Kbd>Cmd</Kbd>
        <span className="text-muted-foreground">+</span>
        <Kbd>K</Kbd>
      </div>
      <div className="flex gap-1 items-center">
        <Kbd>Shift</Kbd>
        <span className="text-muted-foreground">+</span>
        <Kbd>Enter</Kbd>
      </div>
      <div className="flex gap-1 items-center">
        <Kbd>Esc</Kbd>
      </div>
    </div>
  );
}
