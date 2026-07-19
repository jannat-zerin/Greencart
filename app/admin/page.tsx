'use client';

import { useState, useEffect, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';

type AdminTab = 'product' | 'feedback' | 'orders' | 'users';

export default function AdminPage() {
  const router = useRouter();
  const [auth, setAuth] = useState<{ checking: boolean; email: string | null }>({
    checking: true,
    email: null,
  });
  const [tab, setTab] = useState<AdminTab>('product');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((data) => {
        if (data.user.role !== 'admin') throw new Error('Not authorized');
        setAuth({ checking: false, email: data.user.email });
      })
      .catch(() => router.push('/'));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (auth.checking) {
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

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Admin Panel</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Manage products and view customer feedback.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:block">{auth.email}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-slate-500 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex gap-1 border-b border-slate-200">
          {[
            { key: 'product' as AdminTab, label: 'Add Product' },
            { key: 'feedback' as AdminTab, label: 'Feedback' },
            { key: 'orders' as AdminTab, label: 'Orders' },
            { key: 'users' as AdminTab, label: 'Users & Admins' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'product' && <AddProductForm />}
        {tab === 'feedback' && <FeedbackList />}
        {tab === 'orders' && <OrdersList />}
        {tab === 'users' && <UsersAdminPanel />}
      </div>
    </main>
  );
}

interface ProductItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

function AddProductForm() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    image: '',
    category: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const formRef = useRef<HTMLDivElement | null>(null);

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetForm = () => {
    setForm({ name: '', price: '', image: '', category: '', description: '' });
    setEditingProductId(null);
  };

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        image: form.image,
        category: form.category,
        description: form.description,
      };

      const res = await fetch(`/api/products${editingProductId ? `/${editingProductId}` : ''}`, {
        method: editingProductId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Something went wrong' });
        return;
      }

      setMessage({
        type: 'success',
        text: editingProductId ? `"${data.name}" updated successfully!` : `"${data.name}" created successfully!`,
      });
      resetForm();
      await loadProducts();
    } catch {
      setMessage({ type: 'error', text: 'Failed to connect to server' });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (product: ProductItem) => {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      price: String(product.price),
      image: product.image,
      category: product.category,
      description: product.description || '',
    });
    setMessage(null);
    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="space-y-6">
      <div ref={formRef}>
      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editingProductId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-sm text-slate-500">
              {editingProductId ? 'Update the product details below.' : 'Create a fresh listing for your catalog.'}
            </p>
          </div>
          {editingProductId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          )}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Organic Apples"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1.5">
            Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">Tk</span>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0.01"
              required
              value={form.price}
              onChange={handleChange('price')}
              placeholder="2.99"
              className="w-full rounded-lg border border-slate-300 pl-7 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-slate-700 mb-1.5">
            Image URL <span className="text-red-500">*</span>
          </label>
          <input
            id="image"
            type="url"
            required
            value={form.image}
            onChange={handleChange('image')}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            id="category"
            type="text"
            required
            value={form.category}
            onChange={handleChange('category')}
            placeholder="Fruits"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={form.description}
            onChange={handleChange('description')}
            placeholder="Crisp and juicy organic apples..."
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-colors resize-none"
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
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {submitting ? 'Saving...' : editingProductId ? 'Save Changes' : 'Add Product'}
        </button>
      </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Current Products</h3>
            <p className="text-sm text-slate-500">Edit any existing listing in one click.</p>
          </div>
        </div>

        {loadingProducts ? (
          <div className="flex items-center justify-center py-8">
            <svg className="h-5 w-5 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
            No products yet. Add your first one above.
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => startEdit(product)}
                className="flex cursor-pointer flex-col gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-green-300 hover:bg-green-50/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">{product.name}</p>
                  <p className="text-sm text-slate-500">{product.category} • {product.price} Tk</p>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    startEdit(product);
                  }}
                  className="relative z-10 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'reviewed';
  createdAt: string;
}

function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const res = await fetch('/api/feedback');
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Failed to load feedback');
          return;
        }
        setFeedbacks(data.feedbacks || []);
      } catch {
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };
    loadFeedback();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <svg className="h-6 w-6 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 text-red-800 border border-red-200 px-4 py-3 text-sm">
        {error}
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No feedback submitted yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((fb) => (
        <div key={fb.id} className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">{fb.name}</p>
              <p className="text-xs text-slate-400">{fb.email}</p>
            </div>
            <span
              className={`shrink-0 text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                fb.status === 'new'
                  ? 'text-green-700 bg-green-50'
                  : 'text-slate-500 bg-slate-100'
              }`}
            >
              {fb.status}
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">{fb.message}</p>
          <p className="text-xs text-slate-400">
            {new Date(fb.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
      ))}
    </div>
  );
}

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface OrderStatusEvent {
  status: string;
  updatedAt: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  statusHistory: OrderStatusEvent[];
  paymentMethod: string;
  deliveryAddress: string;
  createdAt: string;
}

function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to load orders');
        return;
      }
      setOrders(data.orders || []);
    } catch {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update order');
        return;
      }
      setOrders((prev) => prev.map((order) =>
        order.id === orderId
          ? { ...order, status: data.order.status, statusHistory: data.order.statusHistory || order.statusHistory }
          : order
      ));
      setError(null);
    } catch {
      setError('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <svg className="h-6 w-6 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 text-red-800 border border-red-200 px-4 py-3 text-sm">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              #{order.id.slice(-8)}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full text-green-700 bg-green-50">
                {order.status}
              </span>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'bKash'}
              </span>
            </div>
          </div>
          <div className="space-y-1 mb-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-slate-600">{item.name} x{item.quantity}</span>
                <span className="text-slate-900 font-medium">{Math.round(item.price * item.quantity)} Tk</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <label htmlFor={`status-${order.id}`} className="text-sm text-slate-600">Update status</label>
              <select
                id={`status-${order.id}`}
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                disabled={updatingOrderId === order.id}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </p>
              <p className="font-bold text-slate-900">{Math.round(order.total)} Tk</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">{order.deliveryAddress}</p>
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              <p className="mb-1 font-semibold uppercase tracking-wider text-slate-400">Timeline</p>
              <div className="space-y-1">
                {order.statusHistory.slice().reverse().map((event, index) => (
                  <div key={`${event.status}-${index}`} className="flex items-center justify-between gap-3">
                    <span className="capitalize">{event.status}</span>
                    <span>{new Date(event.updatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function UsersAdminPanel() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data.users) ? data.users : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const updateUser = async (userId: string, action: 'block' | 'unblock' | 'promote' | 'demote') => {
    setBusyId(userId);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Unable to update user' });
        return;
      }

      setUsers((current) => current.map((user) => (user.id === userId ? { ...user, ...data.user } : user)));
      setMessage({ type: 'success', text: `User ${action}d successfully.` });
    } catch {
      setMessage({ type: 'error', text: 'Failed to update user' });
    } finally {
      setBusyId(null);
    }
  };

  const admins = users.filter((user) => user.role === 'admin');
  const regularUsers = users.filter((user) => user.role === 'user');

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Users and admin access</h2>
            <p className="text-sm text-slate-500">Block or unblock users, and promote or demote admins.</p>
          </div>
          <button
            onClick={() => router.push('/admin/users')}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-green-600 hover:text-green-700"
          >
            Open full page
          </button>
        </div>
      </div>

      {message && (
        <div className={`rounded-xl border px-4 py-3 text-sm ${message.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Admins</h3>
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : admins.length === 0 ? (
          <p className="text-sm text-slate-500">No admins yet.</p>
        ) : (
          <div className="space-y-3">
            {admins.map((user) => (
              <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
                <div>
                  <p className="font-medium text-slate-900">{user.name || user.email}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <button
                  onClick={() => updateUser(user.id, 'demote')}
                  disabled={busyId === user.id}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                >
                  Remove admin
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Users</h3>
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : regularUsers.length === 0 ? (
          <p className="text-sm text-slate-500">No users yet.</p>
        ) : (
          <div className="space-y-3">
            {regularUsers.map((user) => (
              <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
                <div>
                  <p className="font-medium text-slate-900">{user.name || user.email}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  {user.status === 'blocked' ? (
                    <button
                      onClick={() => updateUser(user.id, 'unblock')}
                      disabled={busyId === user.id}
                      className="rounded-lg border border-green-200 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50 disabled:opacity-60"
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={() => updateUser(user.id, 'block')}
                      disabled={busyId === user.id}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      Block
                    </button>
                  )}
                  <button
                    onClick={() => updateUser(user.id, 'promote')}
                    disabled={busyId === user.id}
                    className="rounded-lg border border-green-200 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50 disabled:opacity-60"
                  >
                    Make admin
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}