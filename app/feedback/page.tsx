'use client';

import { useState, useEffect, FormEvent } from 'react';

export default function FeedbackPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setEmail(data.user.email || '');
          if (data.user.name) setName(data.user.name);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setResult(null);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        setResult({ type: 'error', text: data.error || 'Failed to send feedback' });
        return;
      }

      setResult({ type: 'success', text: 'Thank you! Your feedback has been submitted.' });
      setMessage('');
    } catch {
      setResult({ type: 'error', text: 'Failed to connect. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Feedback</h1>
          <p className="text-sm text-slate-500 mt-1">
            We&apos;d love to hear your thoughts on GreenCart. Let us know how we&apos;re doing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rahim Uddin"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
              Your Feedback
            </label>
            <textarea
              id="message"
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you think..."
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 resize-none"
            />
          </div>

          {result && (
            <div
              className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
                result.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {result.text}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Sending...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </main>
  );
}