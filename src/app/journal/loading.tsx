export default function Loading() {
  return (
    <>
      <div className="sticky top-0 z-20 h-14 border-b border-zinc-900 bg-black/85 backdrop-blur" />
      <main className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 animate-pulse">
          <div className="mb-4 h-8 w-2/3 rounded-md bg-zinc-900" />
          <div className="h-40 rounded-2xl border border-zinc-800 bg-zinc-950/60" />
          <div className="mt-10 space-y-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 rounded-2xl border border-zinc-800/80 bg-zinc-950/60" />
            ))}
          </div>
        </div>
        <aside className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-zinc-900" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl border border-zinc-800/80 bg-zinc-950/60" />
          ))}
        </aside>
      </main>
    </>
  );
}
