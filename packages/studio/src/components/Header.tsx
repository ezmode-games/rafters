export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center border-b border-neutral-200 bg-white px-4">
      <div className="flex items-center gap-3">
        <svg
          className="h-6 w-6 text-neutral-900"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span className="text-lg font-semibold text-neutral-900">Rafters Studio</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
          Dev
        </span>
      </div>
    </header>
  );
}
