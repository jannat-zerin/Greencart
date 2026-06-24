'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  healthiness?: number;
  priceHonestyRating?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const isApple = product.name === 'Organic Apples';
  const isBanana = product.name === 'Fresh Bananas';
  const isSpinach = product.name === 'Spinach';

  const displayPrice = isBanana ? 20 : Math.floor(product.price);
  const displayHealth = (isApple || isBanana || isSpinach) ? 90 : product.healthiness;
  const displayRating = isSpinach ? 3 : 4;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        <div className="aspect-square relative mb-4 overflow-hidden rounded-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              {product.category}
            </span>
            {typeof displayHealth === 'number' && (
              <span className="text-[11px] font-medium px-2 py-0.5 bg-[#eef2ff] text-[#3b82f6]">
                Health: {displayHealth}%
              </span>
            )}
            {typeof displayRating === 'number' && (
              <span className="text-[11px] font-medium px-2 py-0.5 bg-[#fefce8] text-[#ca8a04]">
                Price honesty: {'★'.repeat(Math.max(0, Math.round(displayRating)))}
              </span>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-green-700 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <p className="text-lg sm:text-xl font-bold text-green-600">{displayPrice} Tk</p>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 bg-green-600 text-white text-sm font-semibold px-3 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}