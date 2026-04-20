'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, ShieldCheck, LoaderCircle } from 'lucide-react';

function getSafeNextPath(value: string | null) {
    if (!value || !value.startsWith('/') || value.startsWith('//')) {
        return '/admin';
    }

    return value;
}

export default function AdminLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nextPath = useMemo(() => getSafeNextPath(searchParams.get('next')), [searchParams]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => null);
                if (response.status === 401) {
                    setError('Invalid email or password.');
                } else {
                    setError(payload?.error || 'Unable to sign in right now.');
                }
                return;
            }

            router.replace(nextPath);
            router.refresh();
        } catch {
            setError('Unable to sign in right now.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid w-full gap-8 rounded-[24px] border border-cyan-500/20 bg-slate-900/70 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_24px_80px_rgba(2,6,23,0.65)] backdrop-blur xl:grid-cols-[1.1fr_0.9fr]">
                    <section className="flex flex-col justify-between gap-8 border-b border-cyan-500/10 p-8 xl:border-b-0 xl:border-r xl:p-10">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Admin Access
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                                    Portfolio control panel
                                </h1>
                                <p className="max-w-xl text-base leading-7 text-slate-300">
                                    Sign in with your admin email to manage the portfolio content, reviews, and site settings.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                                <p className="text-cyan-200">Protected session</p>
                                <p className="mt-1 leading-6">HTTP-only cookie, seven-day expiry, and middleware protection for every admin route.</p>
                            </div>
                            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                                <p className="text-cyan-200">Fast handoff</p>
                                <p className="mt-1 leading-6">Invalid attempts stay on this screen; valid sessions jump straight into the dashboard.</p>
                            </div>
                        </div>
                    </section>

                    <section className="p-8 sm:p-10">
                        <div className="mx-auto max-w-md">
                            <div className="mb-8 space-y-2">
                                <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">Sign in</p>
                                <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
                                <p className="text-sm leading-6 text-slate-400">
                                    Use the admin email address and password associated with the portfolio account.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-200">Email</span>
                                    <span className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3.5 text-slate-200 focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-400/20">
                                        <Mail className="h-4 w-4 shrink-0 text-cyan-300" />
                                        <input
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                                            placeholder="admin@example.com"
                                        />
                                    </span>
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-200">Password</span>
                                    <span className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3.5 text-slate-200 focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-400/20">
                                        <Lock className="h-4 w-4 shrink-0 text-cyan-300" />
                                        <input
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            minLength={8}
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                                            placeholder="Password"
                                        />
                                    </span>
                                </label>

                                {error ? (
                                    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                                        {error}
                                    </div>
                                ) : null}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loading ? (
                                        <>
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            Signing in
                                        </>
                                    ) : (
                                        <>
                                            Continue
                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
