import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border-soft bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand font-display text-sm font-bold text-black transition-transform group-hover:-rotate-6">
            LAB
          </span>
          <span className="font-display text-sm font-semibold tracking-tight sm:text-base">
            lying-ass-bitch<span className="text-muted-soft">.com</span>
          </span>
        </Link>
        <Link
          href="/"
          className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-brand hover:text-brand sm:text-sm"
        >
          New analysis
        </Link>
      </div>
    </header>
  );
}
