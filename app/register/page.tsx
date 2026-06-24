'use client';

import { useState, FormEvent, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function getStrength(password: string): { label: string; color: string; width: string; textColor: string } {
  if (!password) return { label: '', color: 'bg-slate-200', width: 'w-0', textColor: '' };
  const checks = [
    password.length >= 6,
    password.length >= 10,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4', textColor: 'text-red-600' };
  if (score <= 2) return { label: 'Fair', color: 'bg-orange-500', width: 'w-2/4', textColor: 'text-orange-600' };
  if (score <= 3) return { label: 'Good', color: 'bg-yellow-500', width: 'w-3/4', textColor: 'text-yellow-600' };
  return { label: 'Strong', color: 'bg-green-500', width: 'w-full', textColor: 'text-green-600' };
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false });

  const strength = useMemo(() => getStrength(form.password), [form.password]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (touched.name && !form.name.trim()) e.name = 'Name is required';
    if (touched.email && !form.email.trim()) e.email = 'Email is required';
    else if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (touched.password && !form.password) e.password = 'Password is required';
    else if (touched.password && form.password.length < 6) e.password = 'At least 6 characters';
    if (touched.confirmPassword && form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  }, [form, touched]);

  const isValid = form.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && form.password.length >= 6 && form.password === form.confirmPassword;

  const handleBlur = (field: string) => () => setTouched((prev) => ({ ...prev, [field]: true }));

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (!touched[field as keyof typeof touched]) setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    if (!isValid) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, name: form.name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-sm items-center px-4 py-16">
        <div className="w-full text-center space-y-6 animate-fade-in">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Account created!</h1>
          <p className="text-sm text-slate-500">Redirecting you to sign in...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-sm items-center px-4 py-16">
      <div className="w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
          <p className="text-sm text-slate-500 mt-1">
            Get started with GreenCart Bangladesh
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange('name')}
              onBlur={handleBlur('name')}
              placeholder="Your name"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.name ? 'border-red-300 focus:ring-red-600/20 focus:border-red-500' : 'border-slate-300 focus:ring-green-600/20 focus:border-green-600'
              }`}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              placeholder="you@example.com"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.email ? 'border-red-300 focus:ring-red-600/20 focus:border-red-500' : 'border-slate-300 focus:ring-green-600/20 focus:border-green-600'
              }`}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              placeholder="Create a password"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.password ? 'border-red-300 focus:ring-red-600/20 focus:border-red-500' : 'border-slate-300 focus:ring-green-600/20 focus:border-green-600'
              }`}
            />
            {form.password && (
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`} />
                  </div>
                  <span className={`text-xs font-medium ${strength.textColor} min-w-10 text-right`}>{strength.label}</span>
                </div>
                <ul className="space-y-1">
                  {[
                    { check: form.password.length >= 6, label: 'At least 6 characters' },
                    { check: /[a-z]/.test(form.password) && /[A-Z]/.test(form.password), label: 'Upper & lowercase letters' },
                    { check: /\d/.test(form.password), label: 'At least one number' },
                    { check: /[^a-zA-Z0-9]/.test(form.password), label: 'At least one symbol' },
                  ].map(({ check, label }) => (
                    <li key={label} className={`flex items-center gap-1.5 text-xs transition-colors duration-300 ${check ? 'text-green-600' : 'text-slate-400'}`}>
                      <svg className={`h-3.5 w-3.5 shrink-0 transition-colors duration-300 ${check ? 'text-green-500' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        {check
                          ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          : <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        }
                      </svg>
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {errors.password && !form.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              placeholder="Repeat your password"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.confirmPassword ? 'border-red-300 focus:ring-red-600/20 focus:border-red-500' : 'border-slate-300 focus:ring-green-600/20 focus:border-green-600'
              }`}
            />
            {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
            {form.confirmPassword && form.password === form.confirmPassword && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Passwords match
              </p>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !isValid}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {loading ? (
              <>
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
