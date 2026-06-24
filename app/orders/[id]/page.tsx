'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface OrderItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod: string;
  deliveryAddress: string;
  createdAt: string;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) { setError(true); return; }
        const data = await res.json();
        setOrder(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
        <div className="flex items-center justify-center py-20">
          <svg className="h-6 w-6 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Order not found</h1>
          <p className="text-slate-500 mb-6">We couldn&apos;t find this order.</p>
          <Link href="/products" className="text-green-600 hover:text-green-700 font-medium">
            ← Browse Products
          </Link>
        </div>
      </main>
    );
  }

  const createdDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
      <div className="space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Order Confirmed!</h1>
          <p className="text-slate-500">
            Thank you for your order. Your order number is <span className="font-mono text-sm text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{order.id.slice(-8)}</span>
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
          <div className="px-6 py-4 flex items-center justify-between text-sm">
            <span className="text-slate-500">Placed on</span>
            <span className="font-medium text-slate-900">{createdDate}</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between text-sm">
            <span className="text-slate-500">Status</span>
            <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              <span className="size-1.5 rounded-full bg-green-600" />
              {order.status}
            </span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between text-sm">
            <span className="text-slate-500">Payment</span>
            <span className="font-medium text-slate-900">
              {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'bKash'}
            </span>
          </div>
          {order.deliveryAddress && (
            <div className="px-6 py-4 flex items-center justify-between text-sm">
              <span className="text-slate-500">Delivering to</span>
              <span className="font-medium text-slate-900 text-right max-w-xs truncate">
                {order.deliveryAddress}
              </span>
            </div>
          )}
          <div className="px-6 py-4 flex items-center justify-between text-sm">
            <span className="text-slate-500">Items</span>
            <span className="font-medium text-slate-900">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 px-6 py-4">
              <div className="size-14 relative rounded-lg overflow-hidden flex-shrink-0">
                <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-slate-900">{(item.price * item.quantity).toFixed(2)} Tk</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-slate-900">Total</span>
            <span className="text-2xl font-bold text-green-600">{order.total.toFixed(2)} Tk</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/products"
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/cart"
            className="flex-1 bg-white border border-slate-300 text-slate-700 py-3 px-6 rounded-lg font-semibold hover:bg-slate-50 transition-colors text-center"
          >
            View Cart
          </Link>
        </div>
      </div>
    </main>
  );
}
