'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';

export default function CartPage() {
  return <CartPageClient />;
}

function CartPageClient() {
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bkash'>('cash');
  const [user, setUser] = useState<{ email: string; address: string; name: string; phone: string } | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const { state, removeItem, increaseQuantity, decreaseQuantity, clearCart, analyzeCart } = useCart();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setUser(data.user);
          setDeliveryAddress(data.user.address || '');
        }
      })
      .catch(() => {})
      .finally(() => setAuthChecked(true));
  }, []);

  const isAuthenticated = !!user;
  const canCheckout = isAuthenticated && deliveryAddress.trim().length > 0;

  const analysis = analyzeCart();

  const handleCheckout = async () => {
    if (!canCheckout) return;
    setCheckingOut(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: state.items,
          total: state.total,
          paymentMethod,
          deliveryAddress: deliveryAddress.trim(),
          customerName: user?.name?.trim() || 'Customer',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      clearCart();
      router.push(`/orders/${data.id}`);
    } catch {
      setCheckingOut(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
        <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24">
          <svg
            className="h-24 w-24 sm:h-32 sm:w-32 text-slate-300 mb-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Your cart is empty
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-xs mb-8 leading-relaxed">
            Looks like you haven&apos;t added anything yet. Browse our products to find something you love.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Cart</h1>
            <p className="text-sm text-slate-500 mt-1">{state.items.length} item{state.items.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={clearCart}
            className="self-start text-sm text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1.5"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear cart
          </button>
        </div>

        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {state.items.map((item) => (
            <div key={item.product.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-6">
              <div className="aspect-square relative w-full sm:w-20 h-40 sm:h-20 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">{item.product.name}</h3>
                <p className="text-sm text-slate-500">{item.product.category}</p>
                <p className="text-lg font-bold text-green-600 mt-1">{Math.floor(item.product.price)} Tk</p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto">
                <div className="flex items-center gap-2 border border-slate-200 rounded-full">
                  <button
                    onClick={() => decreaseQuantity(item.product.id)}
                    className="size-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-slate-900 tabular-nums">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.product.id)}
                    className="size-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                <p className="font-bold text-slate-900 tabular-nums w-20 text-right">
                  {Math.floor(item.product.price * item.quantity)} Tk
                </p>

                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <h3 className="text-lg font-semibold text-slate-900">Cart health analysis</h3>
              <span className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
                ✦ AI nutrition insight
              </span>
            </div>
            <div className="rounded-xl border border-violet-200 bg-violet-50/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-violet-900">Powered by GreenGPT</p>
                  <p className="text-sm text-violet-700 mt-1">{analysis.message}</p>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-violet-700 shadow-sm">
                  {analysis.score}/100
                </div>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-violet-200">
                <div className="h-2 rounded-full bg-violet-600" style={{ width: `${analysis.score}%` }} />
              </div>
              <p className="mt-3 text-xs text-violet-600">
                This summary is an AI health review designed to make the nutrition guidance feel more trustworthy.
              </p>
              <div className="mt-3 space-y-2">
                {analysis.suggestions.map((s, i) => (
                  <p key={i} className="text-sm text-violet-800">• {s}</p>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Payment Method</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'cash'
                    ? 'border-green-600 bg-green-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={`size-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'cash' ? 'border-green-600' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'cash' && <span className="size-2.5 rounded-full bg-green-600" />}
                </span>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">Cash on Delivery</p>
                  <p className="text-xs text-slate-500">Pay when you receive</p>
                </div>
              </button>
              <button
                onClick={() => setPaymentMethod('bkash')}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'bkash'
                    ? 'border-green-600 bg-green-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={`size-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'bkash' ? 'border-green-600' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'bkash' && <span className="size-2.5 rounded-full bg-green-600" />}
                </span>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">bKash</p>
                  <p className="text-xs text-slate-500">Pay with bKash (mock)</p>
                </div>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Delivery Address</h3>
            {!authChecked ? (
              <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
            ) : !isAuthenticated ? (
              <div className="rounded-lg border border-slate-200 bg-amber-50 p-4 text-sm text-amber-800">
                Please{' '}
                <Link href="/login" className="text-green-600 hover:text-green-700 font-medium underline">
                  sign in
                </Link>{' '}
                to place your order.
              </div>
            ) : (
              <textarea
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="House #12, Road #5, Gulshan, Dhaka 1212"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 resize-none"
              />
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-lg font-semibold text-slate-900">Total</p>
              <p className="text-sm text-slate-500">{state.items.reduce((sum, i) => sum + i.quantity, 0)} item{state.items.reduce((sum, i) => sum + i.quantity, 0) !== 1 ? 's' : ''}</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{Math.floor(state.total)} Tk</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/products"
              className="flex-1 bg-white border border-slate-300 text-slate-700 py-3 px-6 rounded-lg font-semibold hover:bg-slate-50 transition-colors text-center"
            >
              Continue Shopping
            </Link>
            {!isAuthenticated ? (
              <Link
                href="/login"
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm text-center"
              >
                Sign in to Checkout
              </Link>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={checkingOut || !canCheckout}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {checkingOut ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}