import { Button } from '@rafters/ui/components/ui/button';
import {
  Empty,
  EmptyAction,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
} from '@rafters/ui/components/ui/empty';

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

export function EmptyDemo() {
  return (
    <Empty>
      <EmptyIcon>
        <SearchIcon />
      </EmptyIcon>
      <EmptyTitle>No results found</EmptyTitle>
      <EmptyDescription>
        Try adjusting your search terms or filters to find what you're looking for.
      </EmptyDescription>
      <EmptyAction>
        <Button variant="outline">Clear filters</Button>
      </EmptyAction>
    </Empty>
  );
}

export function EmptyVariants() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="border border-border rounded-md">
        <Empty>
          <EmptyIcon>
            <SearchIcon />
          </EmptyIcon>
          <EmptyTitle>No results found</EmptyTitle>
          <EmptyDescription>Try adjusting your search terms.</EmptyDescription>
          <EmptyAction>
            <Button variant="outline" size="sm">
              Clear filters
            </Button>
          </EmptyAction>
        </Empty>
      </div>

      <div className="border border-border rounded-md">
        <Empty>
          <EmptyIcon>
            <FolderIcon />
          </EmptyIcon>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>Create your first project to get started.</EmptyDescription>
          <EmptyAction>
            <Button size="sm">Create project</Button>
          </EmptyAction>
        </Empty>
      </div>
    </div>
  );
}
