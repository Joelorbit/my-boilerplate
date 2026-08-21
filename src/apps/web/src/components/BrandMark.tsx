export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        aria-hidden="true"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-[0.78rem] bg-primary text-primary-foreground shadow-[0_8px_18px_-10px_oklch(0.35_0.07_145_/_0.7)]"
      >
        <span className="font-serif text-lg leading-none">T</span>
      </div>
      {!compact ? (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-[-0.02em] text-foreground">
            TypeStack
          </p>
          <p className="truncate text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Full-stack starter
          </p>
        </div>
      ) : null}
    </div>
  );
}
