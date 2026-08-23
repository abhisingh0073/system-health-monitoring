"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  // Real-time calculation flags
  const hasTypedConfirm = confirmPassword.length > 0;
  const isMatch = password.length >= 8 && password === confirmPassword;
  const isMismatch = password !== confirmPassword && (touched || hasTypedConfirm);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
      });

      router.push("/login");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-neutral-950 text-neutral-100">
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl backdrop-blur-sm border transition-all"
        style={{
          background: "var(--surface, rgba(23, 23, 23, 0.8))",
          borderColor: "var(--border, rgba(255, 255, 255, 0.1))",
        }}
      >
        {/* Header */}
        <div className="mb-6 space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary,#fff)]">
            Create an account
          </h1>
          <p className="text-sm text-[var(--text-secondary,#a3a3a3)]">
            Set up your credentials to get started with monitoring.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-400">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900/60 px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-[var(--accent,#3b82f6)] focus:ring-1 focus:ring-[var(--accent,#3b82f6)]"
              placeholder="Name"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-400">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900/60 px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-[var(--accent,#3b82f6)] focus:ring-1 focus:ring-[var(--accent,#3b82f6)]"
              placeholder="alex@company.com"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-400">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900/60 pl-3.5 pr-11 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-[var(--accent,#3b82f6)] focus:ring-1 focus:ring-[var(--accent,#3b82f6)]"
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 text-neutral-400 hover:text-neutral-200 transition focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                Confirm Password
              </label>
              {hasTypedConfirm && (
                <span className="text-xs font-medium transition">
                  {isMatch ? (
                    <span className="text-emerald-400">✓ Match</span>
                  ) : (
                    <span className="text-rose-400">✕ Mismatch</span>
                  )}
                </span>
              )}
            </div>

            <div className="relative flex items-center">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setTouched(true)}
                required
                minLength={8}
                placeholder="Re-enter password"
                className={`w-full rounded-lg border bg-neutral-900/60 pl-3.5 pr-11 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition ${
                  hasTypedConfirm
                    ? isMatch
                      ? "border-emerald-500/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      : "border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    : "border-neutral-800 focus:border-[var(--accent,#3b82f6)] focus:ring-1 focus:ring-[var(--accent,#3b82f6)]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                className="absolute right-3 text-neutral-400 hover:text-neutral-200 transition focus:outline-none"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {isMismatch && (
              <p className="text-xs text-rose-400 pt-0.5">
                Passwords do not match.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isMatch || password.length < 8}
            className="w-full mt-2 flex items-center justify-center gap-2 cursor-pointer rounded-lg py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none transition"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Creating account...</span>
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-neutral-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-400 hover:text-blue-300 hover:underline transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}