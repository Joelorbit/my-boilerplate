export default function Home() {
  return (
    <main
      className="grid min-h-screen place-items-center bg-[#f4f4f1] px-6 text-center text-[#2d2d2a]"
      style={{ fontFamily: "'Lexend', system-ui, sans-serif" }}
    >
      <section className="space-y-4">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#85857f]"
          style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
        >
          TypeStack
        </p>
        <h1
          className="text-5xl leading-[0.98] tracking-[-0.055em] sm:text-7xl"
          style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
          Build something worth keeping.
        </h1>
        <p className="text-base text-[#85857f]">
          A clean TypeScript foundation for your next product.
        </p>
      </section>
    </main>
  );
}
