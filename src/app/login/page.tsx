'use client';

import { useState } from 'react';
import { API_BASE_URL } from '@/utilities/constants';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const apiUrl = API_BASE_URL + '/api/login';

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (data.access_token) {
        toast.success('Login successful!', { duration: 5000, closeButton: true });
        localStorage.setItem('auth_token', data.access_token);
        router.push('/');
      } else {
        throw new Error('Login failed: No token received');
      }

    } catch (err: any) {
       setError(err.message);
       if (err.response && err.response.data && err.response.data.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        setError(errors.join(', '));
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#141414]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#171717]/80 backdrop-blur rounded-2xl shadow-xl border border-white/5">
        <img src="/images/logo.png" alt="Logo" className="mx-auto h-16 w-auto" />
        <h1 className="text-2xl font-bold text-center text-white">Welcome back</h1>
        <p className="text-center text-sm text-gray-400">Sign in to your account</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-200">
              Email address
            </label>
            <div className="mt-1 relative group">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 pl-3 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500/60 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" aria-label="Password" className="text-sm font-medium text-gray-200">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 pr-10 rounded-lg bg-[#0a0a0a] border border-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500/60 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-400 hover:text-gray-200 focus:outline-none"
              >
                {/* Eye icon */}
                {showPassword ? (
                  // Eye-off icon
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 15.338 6.444 18 12 18c.97 0 1.87-.093 2.703-.27M6.228 6.228A10.45 10.45 0 0112 6c5.556 0 8.774 2.662 10.066 6a10.523 10.523 0 01-4.548 5.045M3 3l18 18" />
                  </svg>
                ) : (
                  // Eye icon
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.01 9.964 7.178.07.207.07.437 0 .644C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.01-9.964-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">{error}</p>}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full px-4 py-2.5 font-medium text-white rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500/70 focus:ring-offset-[#0a0a0a] transition shadow hover:shadow-lg cursor-pointer"
            >
              Sign in
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-400">
          Not a member?{' '}
          <Link href="/register" className="font-medium text-orange-400 hover:text-orange-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
