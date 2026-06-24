import { CartItemSkeleton } from '@/components/Skeleton';

export default function CartLoading() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
      <div className="space-y-8">
        <div className="h-8 w-20 animate-pulse rounded-md bg-slate-200" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CartItemSkeleton key={i} />
          ))}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-5 w-16 animate-pulse rounded-md bg-slate-200" />
              <div className="h-3 w-20 animate-pulse rounded-md bg-slate-200" />
            </div>
            <div className="h-7 w-20 animate-pulse rounded-md bg-slate-200" />
          </div>
          <div className="mt-6 flex gap-4">
            <div className="flex-1 h-12 animate-pulse rounded-lg bg-slate-200" />
            <div className="flex-1 h-12 animate-pulse rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>
    </main>
  );
}
