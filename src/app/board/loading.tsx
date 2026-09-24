export default function Loading() {
  return (
    <>
      <div className="sticky top-0 z-20 h-14 border-b border-zinc-900 bg-black/85 backdrop-blur" />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 animate-pulse space-y-2">
          <div className="h-9 w-56 rounded-md bg-zinc-900" />
          <div className="h-4 w-72 rounded bg-zinc-900" />
        </div>
        <div className="grid animate-pulse gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="h-56 rounded-2xl border border-zinc-800/80 bg-zinc-950/60" />
            <div className="h-40 rounded-2xl border border-zinc-800/80 bg-zinc-950/60" />
          </div>
          <div className="space-y-5">
            <div className="h-56 rounded-2xl border border-zinc-800/80 bg-zinc-950/60" />
            <div className="h-40 rounded-2xl border border-zinc-800/80 bg-zinc-950/60" />
          </div>
        </div>
      </main>
    </>
  );
}
