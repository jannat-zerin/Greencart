import { ProductCardSkeleton } from '@/components/Skeleton';

export default function ProductsLoading() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
      <section className="space-y-8">
        <div className="space-y-3">
          <div className="h-8 w-32 animate-pulse rounded-md bg-slate-200" />
          <div className="h-4 w-72 animate-pulse rounded-md bg-slate-200" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
