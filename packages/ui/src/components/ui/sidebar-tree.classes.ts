/**
 * Shared sidebar-tree class definitions
 *
 * Imported by sidebar-tree.tsx (React) to keep inline strings in a single
 * source of truth.
 */

export const sidebarTreeRootClasses = 'flex w-full flex-col gap-px text-sm outline-none';

export const sidebarTreeGroupClasses = 'flex flex-col gap-px';

export const sidebarTreeItemClasses =
  'group/sidebar-tree-item flex w-full cursor-default items-center gap-2 rounded-md px-2 py-1 ' +
  'text-foreground transition-colors duration-150 motion-reduce:transition-none ' +
  'hover:bg-accent hover:text-accent-foreground ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ' +
  'aria-[selected=true]:bg-accent aria-[selected=true]:text-accent-foreground ' +
  'aria-[disabled=true]:pointer-events-none aria-[disabled=true]:opacity-50';

export const sidebarTreeItemContentClasses = 'flex min-w-0 flex-1 items-center gap-2';

export const sidebarTreeChevronClasses =
  'h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-150 ' +
  'motion-reduce:transition-none aria-[expanded=true]:rotate-90';

export const sidebarTreeChevronSpacerClasses = 'h-3.5 w-3.5 shrink-0';
