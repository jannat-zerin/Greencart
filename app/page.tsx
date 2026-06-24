'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { siteConfig } from "@/lib/site";
import { useCart } from "@/contexts/CartContext";

const features = [
  {
    title: "100% Organic",
    desc: "Every product is certified organic and sourced from trusted farms.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Farm Fresh",
    desc: "Harvested at peak ripeness and delivered straight to your doorstep across Dhaka, Chattogram & beyond.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Eco Friendly",
    desc: "Plastic-free packaging and eco-friendly delivery across Bangladesh on every order.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
];

const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "50+", label: "Products" },
  { value: "99%", label: "Satisfaction Rate" },
  { value: "3hr", label: "Avg. Delivery in Dhaka" },
];

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to load products:', err));
  }, []);

  const featured = products.slice(0, 3);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-green-200/30 blur-3xl animate-pulse-soft" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl animate-pulse-soft" style={{ animationDelay: '0.6s' }} />
          <div className="absolute top-1/4 left-1/3 h-4 w-4 rounded-full bg-green-400/40 animate-float" />
          <div className="absolute top-1/3 right-1/4 h-3 w-3 rounded-full bg-emerald-400/40 animate-float" style={{ animationDelay: '0.4s' }} />
          <div className="absolute bottom-1/3 left-1/5 h-5 w-5 rounded-full bg-green-300/40 animate-float-slow" />
          <div className="absolute top-1/2 right-1/5 h-6 w-6 rounded-full bg-emerald-300/30 animate-float" style={{ animationDelay: '0.8s' }} />
          <svg className="absolute top-10 right-10 h-16 w-16 text-green-200/40 animate-float-slow" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <svg className="absolute bottom-20 left-10 h-12 w-12 text-emerald-200/40 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 3.75l7.5 4.5-7.5 4.5V3.75zM4.5 11.25l7.5 4.5-7.5 4.5v-9zM16.5 3.75l7.5 4.5-7.5 4.5V3.75zM16.5 11.25l7.5 4.5-7.5 4.5v-9z" />
          </svg>
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-73px)] max-w-5xl flex-col lg:flex-row items-center gap-12 px-4 sm:px-6 py-16 lg:py-24">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-green-700 bg-green-100/80 px-3 py-1.5 rounded-full animate-fade-in">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
                Fresh & Organic Marketplace
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight animate-fade-in-up">
                <span className="block">Nature&apos;s Best,</span>
                <span className="block mt-1 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                  Delivered Daily
                </span>
              </h1>
              <p className="text-base sm:text-lg leading-relaxed text-slate-500 max-w-lg mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {siteConfig.description} Discover farm-fresh organic produce, pantry staples, and eco-friendly essentials — all just a tap away.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25 active:scale-[0.97]"
              >
                Explore Products
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/cart"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white/80 px-7 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:border-green-600 hover:text-green-700 hover:bg-green-50 active:scale-[0.97] backdrop-blur-sm"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                Start Shopping
              </Link>
            </div>

            <div className="flex items-center gap-6 justify-center lg:justify-start text-sm text-slate-400 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-7 w-7 rounded-full border-2 border-white bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span>Joined by <strong className="text-slate-600">2,400+</strong> food lovers across Bangladesh</span>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md lg:max-w-none animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-200 to-emerald-200 rounded-3xl blur-2xl opacity-60 animate-pulse-soft" />
              <div className="relative grid grid-cols-2 gap-3">
                {featured.map((product: any, i) => {
                  const isApple = product.name === 'Organic Apples';
                  const isBanana = product.name === 'Fresh Bananas';
                  const isSpinach = product.name === 'Spinach';

                  const currentPrice = isBanana ? 20 : Math.floor(product.price);
                  const currentHealth = (isApple || isBanana) ? 90 : (isSpinach ? 90 : product.healthiness);
                  const currentRating = isSpinach ? 3 : 4;

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className={`group block rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-green-200 ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                    >
                      <div className={`relative overflow-hidden rounded-xl ${i === 0 ? 'aspect-[4/3]' : 'aspect-square'}`}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="mt-2.5 space-y-1">
                        
                        <div className="flex items-center gap-2 text-[11px] font-medium flex-wrap">
                          <span className="text-gray-400 uppercase tracking-wider">{product.category}</span>
                          
                          <span className="text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                            Health: {currentHealth}%
                          </span>
                          
                          <span className="text-yellow-700 font-medium bg-yellow-50 px-2 py-0.5 rounded-full">
                            Price honesty: {"★".repeat(currentRating)}
                          </span>
                        </div>

                        <p className={`font-semibold text-slate-900 truncate group-hover:text-green-700 transition-colors ${i === 0 ? 'text-lg' : 'text-sm'}`}>{product.name}</p>
                        <div className="flex items-center justify-between pt-1">
                          <p className="font-bold text-green-600">{currentPrice} Tk</p>
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="bg-green-600 text-white px-2.5 py-1 rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors active:scale-95 flex items-center gap-1 shadow-sm"
                          >
                            <span className="text-sm leading-none">+</span> Add
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                <div className="absolute -bottom-3 -right-3 h-16 w-16 rounded-2xl bg-green-600 flex items-center justify-center shadow-lg shadow-green-600/30 animate-float">
                  <span className="text-2xl font-bold text-white">+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center animate-fade-in-up" style={{ animationDelay: `${(i + 1) * 0.15}s` }}>
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-20 sm:py-28">
          <div className="text-center space-y-4 mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-green-700 bg-green-100/80 px-3 py-1.5 rounded-full">
              Why GreenCart
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Good for you, good for the planet
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              We make eating well effortless — from responsible sourcing to your front door.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-green-200 animate-fade-in-up" style={{ animationDelay: `${(i + 1) * 0.15}s` }}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-green-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-green-700">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-1/4 right-1/3 h-4 w-4 rounded-full bg-white/20 animate-float" />
          <div className="absolute bottom-1/3 left-1/4 h-3 w-3 rounded-full bg-white/20 animate-float-slow" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 py-20 sm:py-28 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight animate-fade-in-up">
            Ready to eat fresh?
          </h2>
          <p className="text-base sm:text-lg text-green-100 max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Join thousands of happy customers across Bangladesh. Free delivery on your first order in Dhaka!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-green-700 transition-all hover:bg-green-50 hover:shadow-xl active:scale-[0.97]"
            >
              Browse Products
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.97]"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}