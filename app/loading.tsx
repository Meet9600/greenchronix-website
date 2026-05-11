export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#040806]">
      <div className="flex items-center gap-3 text-sm text-zinc-400">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34d399]/70 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34d399]" />
        </span>
        Loading...
      </div>
    </div>
  );
}
