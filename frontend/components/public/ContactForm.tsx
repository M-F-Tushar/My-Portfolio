'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

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
        company: formData.get('company'),
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
    <form onSubmit={handleSubmit} className="contact-form-panel space-y-4">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Direct message</p>
          <p className="mt-1 text-sm text-slate-400">Saved privately for review.</p>
        </div>
        <Send className="h-5 w-5 text-emerald-200" />
      </div>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <label className="block">
        <span className="text-sm text-slate-300">Name</span>
        <input
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={120}
          className="mt-1 w-full rounded-md border border-cyan-200/15 bg-slate-950/80 px-3 py-3 text-white outline-none transition focus:border-cyan-300"
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
          className="mt-1 w-full rounded-md border border-cyan-200/15 bg-slate-950/80 px-3 py-3 text-white outline-none transition focus:border-cyan-300"
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
          className="mt-1 w-full resize-y rounded-md border border-cyan-200/15 bg-slate-950/80 px-3 py-3 text-white outline-none transition focus:border-cyan-300"
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
        className="inline-flex items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 py-3 font-medium text-slate-950 transition-colors hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'loading' ? 'Sending...' : 'Send message'}
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
