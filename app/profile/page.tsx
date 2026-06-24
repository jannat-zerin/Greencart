'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string;
  address: string;
}

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

type View = 'menu' | 'orders' | 'address' | 'password';

export default function ProfilePage() {
  const router = useRouter();
  const [auth, setAuth] = useState<{ checking: boolean }>({ checking: true });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [view, setView] = useState<View>('menu');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((data) => {
        setAuth({ checking: false });
        setProfile(data.user);
      })
      .catch(() => router.push('/login'));
  }, [router]);

  useEffect(() => {
    if (!auth.checking && profile) {
      const loadOrders = async () => {
        try {
          const res = await fetch('/api/orders/user');
          const data = await res.json();
          if (res.ok) setOrders(data.orders || []);
        } catch {}
      };
      loadOrders();
    }
  }, [auth.checking, profile]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  if (auth.checking || !profile) {
    return (
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <div className="flex items-center justify-center py-20">
          <svg className="h-6 w-6 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </main>
    );
  }

  const viewTitles: Record<View, string> = {
    menu: 'My Profile',
    orders: 'Order History',
    address: 'Delivery Address',
    password: 'Change Password',
  };

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-3">
          {view !== 'menu' && (
            <button
              onClick={() => setView('menu')}
              className="shrink-0 size-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-green-700 transition-colors"
              aria-label="Back to menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{viewTitles[view]}</h1>
            {view === 'menu' && (
              <p className="text-sm text-slate-500 mt-1">
                {profile.email} {profile.role === 'admin' && <span className="text-green-600 font-medium">(Admin)</span>}
              </p>
            )}
          </div>
        </div>

        {view === 'menu' && <AccountMenu onSelect={setView} onLogout={handleLogout} />}
        {view === 'orders' && <OrdersTab orders={orders} />}
        {view === 'address' && <AddressTab profile={profile} setProfile={setProfile} />}
        {view === 'password' && <PasswordTab />}
      </div>
    </main>
  );
}

function AccountMenu({
  onSelect,
  onLogout,
}: {
  onSelect: (view: View) => void;
  onLogout: () => void;
}) {
  const items = [
    {
      key: 'orders' as View,
      label: 'Order History',
      description: 'Track and review your past orders',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7L12 3 4 7m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      key: 'address' as View,
      label: 'Delivery Address',
      description: 'Update your name, phone and address',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      key: 'password' as View,
      label: 'Change Password',
      description: 'Keep your account secure',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
  ];

  const links = [
    {
      href: '/policies',
      label: 'Policies',
      description: 'Return, delivery and privacy policies',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      href: '/feedback',
      label: 'Feedback',
      description: 'Tell us what you think',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      href: '/help',
      label: 'Help',
      description: 'Frequently asked questions',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onSelect(item.key)}
          className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-green-50/50 transition-colors"
        >
          <span className="shrink-0 size-10 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
            {item.icon}
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-semibold text-slate-900">{item.label}</span>
            <span className="block text-xs text-slate-500 mt-0.5">{item.description}</span>
          </span>
          <svg className="h-4 w-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ))}

      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-green-50/50 transition-colors"
        >
          <span className="shrink-0 size-10 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
            {link.icon}
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-semibold text-slate-900">{link.label}</span>
            <span className="block text-xs text-slate-500 mt-0.5">{link.description}</span>
          </span>
          <svg className="h-4 w-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ))}
    </div>
  );
}

function OrdersTab({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-slate-500 mb-4">You haven&apos;t placed any orders yet.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/orders/${order.id}`}
          className="block rounded-xl border border-slate-200 bg-white p-5 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              #{order.id.slice(-8)}
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                <span className="size-1.5 rounded-full bg-green-600" />
                {order.status}
              </span>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'bKash'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-3">
            {order.items.slice(0, 3).map((item) => (
              <div key={item.productId} className="size-10 relative rounded-lg overflow-hidden">
                <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
              </div>
            ))}
            {order.items.length > 3 && (
              <span className="text-xs text-slate-400 font-medium">+{order.items.length - 3}</span>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
            </span>
            <span className="font-bold text-slate-900">{order.total.toFixed(2)} Tk</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function AddressTab({
  profile,
  setProfile,
}: {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}) {
  const [name, setName] = useState(profile.name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [address, setAddress] = useState(profile.address || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, address }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to update' });
        return;
      }
      setMessage({ type: 'success', text: 'Delivery address updated!' });
      setProfile({ ...profile, name, phone, address });
    } catch {
      setMessage({ type: 'error', text: 'Failed to connect' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Rahim Uddin"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+880 17XX-XXXXXX"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1.5">
          Delivery Address
        </label>
        <textarea
          id="address"
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="House #12, Road #5, Gulshan, Dhaka 1212"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 resize-none"
        />
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? 'Saving...' : 'Save Address'}
      </button>
    </form>
  );
}

function PasswordTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to update password' });
        return;
      }
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setMessage({ type: 'error', text: 'Failed to connect' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
          Current Password
        </label>
        <input
          id="currentPassword"
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
        />
      </div>
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="At least 6 characters"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat new password"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
        />
        {confirmPassword && newPassword === confirmPassword && (
          <p className="text-xs text-green-600 mt-1">Passwords match</p>
        )}
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  );
}