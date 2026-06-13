export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="shimmer h-4 w-32 rounded-lg" />
      <div className="shimmer h-8 w-24 rounded-lg" />
      <div className="shimmer h-3 w-20 rounded-lg" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="shimmer w-8 h-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="shimmer h-4 w-40 rounded" />
        <div className="shimmer h-3 w-28 rounded" />
      </div>
      <div className="shimmer h-6 w-16 rounded-full" />
      <div className="shimmer h-4 w-12 rounded" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="shimmer h-12 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}
