'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/Skeleton';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    fetch('/api/products/categories')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.categories) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (activeCategory !== 'all') params.set('category', activeCategory);
        const qs = params.toString();
        const res = await fetch(`/api/products${qs ? `?${qs}` : ''}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [debouncedSearch, activeCategory]);

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
      <section className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Products</h1>
          <p className="max-w-2xl text-sm sm:text-base leading-7 text-slate-500">
            Discover our selection of fresh, organic products available across Bangladesh.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-slate-300 pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeCategory === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-slate-500 text-sm">No products found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
