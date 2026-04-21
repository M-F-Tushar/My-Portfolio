'use client';

import { useState } from 'react';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus('loading');
    setMessage('');

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus('error');
      setMessage(data.error || 'Message could not be saved.');
      return;
    }

    form.reset();
    setStatus('success');
    setMessage(data.message || 'Thanks. Your message was saved for review.');
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel space-y-4 rounded-lg p-5">
      <label className="block">
        <span className="text-sm text-slate-300">Name</span>
        <input
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={120}
          className="mt-1 w-full rounded-md border border-cyan-200/15 bg-slate-950/80 px-3 py-2 text-white outline-none transition focus:border-cyan-300"
        />
      </label>
      <label className="block">
        <span className="text-sm text-slate-300">Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={180}
          className="mt-1 w-full rounded-md border border-cyan-200/15 bg-slate-950/80 px-3 py-2 text-white outline-none transition focus:border-cyan-300"
        />
      </label>
      <label className="block">
        <span className="text-sm text-slate-300">Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          className="mt-1 w-full resize-y rounded-md border border-cyan-200/15 bg-slate-950/80 px-3 py-2 text-white outline-none transition focus:border-cyan-300"
        />
      </label>
      {message ? (
        <p
          role="status"
          aria-live="polite"
          className={status === 'error' ? 'text-sm text-red-300' : 'text-sm text-cyan-200'}
        >
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-md bg-cyan-300 px-5 py-2 font-medium text-slate-950 transition-colors hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'loading' ? 'Sending...' : 'Send message'}
      </button>
    </form>
  );
}
