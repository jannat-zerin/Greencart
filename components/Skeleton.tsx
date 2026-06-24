export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] ${className}`}
      style={{ animation: 'shimmer 1.5s ease-in-out infinite, pulse 2s ease-in-out infinite' }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      <Skeleton className="aspect-square w-full mb-4 rounded-lg" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-20 rounded-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-7 w-20" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex items-center gap-4 sm:gap-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      <Skeleton className="size-16 sm:size-20 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-12" />
      </div>
      <Skeleton className="h-8 w-24 rounded-full" />
      <Skeleton className="h-5 w-16" />
      <Skeleton className="size-5 rounded" />
    </div>
  );
}
