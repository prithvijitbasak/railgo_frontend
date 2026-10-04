"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, KeyRound, Loader2, Mail, ShieldCheck, TrainFront, X } from "lucide-react";

/**
 * RailGo login modal (email OTP).
 * Adjust the two endpoint paths + response shape to match your Spring Boot controllers.
 */
const SEND_OTP_URL = "/api/public/send-email-login-otp";
const VERIFY_OTP_URL = "/api/public/verify-email-login-otp";
const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

type Props = {
  open: boolean;
  onClose: () => void;
  /** Called with the new JWT after a successful login (e.g. dispatch to Redux + set cookie). */
  onSuccess?: (token: string) => void;
};

export default function LoginModal({ open, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const emailRef = useRef<HTMLInputElement>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset when closed, lock scroll + Esc to close while open
  useEffect(() => {
    if (!open) {
      setStep("email");
      setEmail("");
      setOtp(Array(OTP_LENGTH).fill(""));
      setError("");
      setLoading(false);
      setCooldown(0);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    emailRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Resend countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  if (!open) return null;

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function sendOtp() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(SEND_OTP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Could not send the code. Check your email and try again.");
      setStep("otp");
      setCooldown(RESEND_SECONDS);
      setTimeout(() => otpRefs.current[0]?.focus(), 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(code: string) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(VERIFY_OTP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      if (!res.ok) throw new Error("That code is incorrect or expired.");
      const data = await res.json();
      const token: string = data.token ?? data.accessToken ?? data.access_token;
      onSuccess?.(token);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  function setDigit(i: number, v: string) {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = d;
    setOtp(next);
    if (d && i < OTP_LENGTH - 1) otpRefs.current[i + 1]?.focus();
    if (next.every(Boolean)) verifyOtp(next.join(""));
  }

  function onOtpKeyDown(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  }

  function onOtpPaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((c, i) => (next[i] = c));
    setOtp(next);
    if (pasted.length === OTP_LENGTH) verifyOtp(pasted);
    else otpRefs.current[pasted.length]?.focus();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Blue header, same as the site hero */}
        <div className="bg-blue-600 px-8 pb-8 pt-7 text-white">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-lg p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mb-4 flex items-center gap-2">
            <TrainFront className="h-7 w-7" />
            <span className="text-xl font-bold">RailGo</span>
          </div>
          <h2 id="login-title" className="text-2xl font-bold">
            {step === "email" ? "Log in to book tickets" : "Enter your code"}
          </h2>
          <p className="mt-1 text-sm text-blue-100">
            {step === "email"
              ? "We'll email you a one-time code. No password needed."
              : `We sent a ${OTP_LENGTH}-digit code to ${email}.`}
          </p>
        </div>

        <div className="px-8 py-7">
          {step === "email" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (validEmail && !loading) sendOtp();
              }}
            >
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  ref={emailRef}
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={!validEmail || loading}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Send code <ArrowRight className="h-5 w-5" /></>}
              </button>
            </form>
          ) : (
            <div>
              <div className="flex justify-between gap-2" aria-label="One-time code">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    inputMode="numeric"
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={d}
                    disabled={loading}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => onOtpKeyDown(i, e)}
                    onPaste={onOtpPaste}
                    aria-label={`Digit ${i + 1}`}
                    className="h-12 w-12 rounded-lg border border-slate-300 text-center text-xl font-semibold text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:bg-slate-50"
                  />
                ))}
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                onClick={() => verifyOtp(otp.join(""))}
                disabled={otp.some((d) => !d) || loading}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><KeyRound className="h-5 w-5" /> Verify and log in</>}
              </button>

              <div className="mt-4 flex items-center justify-between text-sm">
                <button
                  onClick={() => {
                    setStep("email");
                    setError("");
                    setOtp(Array(OTP_LENGTH).fill(""));
                  }}
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="h-4 w-4" /> Change email
                </button>
                <button
                  onClick={sendOtp}
                  disabled={cooldown > 0 || loading}
                  className="font-semibold text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            Your data is protected with encryption.
          </div>
        </div>
      </div>
    </div>
  );
}