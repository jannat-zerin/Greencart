'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type UserRow = {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  role: 'user' | 'admin';
  status: 'active' | 'blocked';
  createdAt: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [auth, setAuth] = useState<{ checking: boolean; email: string | null }>({ checking: true, email: null });
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const admins = useMemo(() => users.filter((user) => user.role === 'admin'), [users]);
  const regularUsers = useMemo(() => users.filter((user) => user.role === 'user'), [users]);

  useEffect(() => {
    const load = async () => {
      try {
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) throw new Error('Not authenticated');
        const meData = await meRes.json();
        if (meData.user.role !== 'admin') throw new Error('Not authorized');

        setAuth({ checking: false, email: meData.user.email });

        const usersRes = await fetch('/api/admin/users');
        const usersData = await usersRes.json();
        if (!usersRes.ok) throw new Error(usersData.error || 'Failed to load users');
        setUsers(Array.isArray(usersData.users) ? usersData.users : []);
      } catch {
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

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

  if (auth.checking || loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-center py-20">
          <svg className="h-6 w-6 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-green-700">Admin control center</p>
            <h1 className="text-2xl font-semibold text-slate-900">Users and admin access</h1>
            <p className="mt-1 text-sm text-slate-500">View every signed-up user, manage access, and control account status.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{auth.email}</span>
            <button
              onClick={() => router.push('/admin')}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-green-600 hover:text-green-700"
            >
              Back to admin
            </button>
          </div>
        </div>

        {message && (
          <div className={`rounded-xl border px-4 py-3 text-sm ${message.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Administrators</h2>
              <p className="text-sm text-slate-500">Current admins can be removed from admin access.</p>
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">{admins.length} admin(s)</span>
          </div>

          <div className="space-y-3">
            {admins.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">No admins yet.</p>
            ) : (
              admins.map((user) => (
                <div key={user.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{user.name || user.email}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateUser(user.id, 'demote')}
                      disabled={busyId === user.id}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      Remove admin
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Signed-up users</h2>
              <p className="text-sm text-slate-500">Manage user access and block or unblock accounts.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{regularUsers.length} user(s)</span>
          </div>

          <div className="space-y-3">
            {regularUsers.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">No regular users available.</p>
            ) : (
              regularUsers.map((user) => (
                <div key={user.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-slate-900">{user.name || user.email}</p>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${user.status === 'blocked' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {user.status === 'blocked' ? 'Blocked' : 'Active'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">{user.email}</p>
                      <p className="text-sm text-slate-500">Phone: {user.phone || 'Not provided'}</p>
                      <p className="text-sm text-slate-500">Address: {user.address || 'Not provided'}</p>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
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
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
