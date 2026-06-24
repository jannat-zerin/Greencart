import { ProductDetailSkeleton } from '@/components/Skeleton';

export default function ProductDetailLoading() {
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <div className="mb-8">
        <div className="h-5 w-32 animate-pulse rounded-md bg-slate-200" />
      </div>
      <ProductDetailSkeleton />
    </main>
  );
}
