export function Footer() {
  return (
    <footer className="w-full max-w-6xl border-t border-gray-200 pt-8 pb-16 mt-24">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4">
        <div className="text-sm text-gray-600">
          © {new Date().getFullYear()}{' '}
          <a href="https://realhandy.tech" className="underline hover:no-underline">
            Real Handy
          </a>
          . All rights reserved.
        </div>
        <div className="flex gap-6 text-sm text-gray-600">
          <a href="https://github.com/real-handy/rafters" className="underline hover:no-underline">
            GitHub
          </a>
          <a href="/docs" className="underline hover:no-underline">
            Docs
          </a>
          <a href="/huh" className="underline hover:no-underline">
            Huh?
          </a>
          <a href="/llms.txt" className="underline hover:no-underline">
            LLMs
          </a>
          <a href="https://realhandy.tech" className="underline hover:no-underline">
            realhandy.tech
          </a>
        </div>
      </div>
    </footer>
  );
}
