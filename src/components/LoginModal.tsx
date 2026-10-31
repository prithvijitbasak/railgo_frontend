"use client";

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
  TramFront,
  User,
  X,
} from "lucide-react";
import { clientFetch } from "@/lib/authFetch";
import { AuthUser, setCredentials } from "@/redux/slices/authSlice";
import { getClientTokenCookie, setClientTokenCookie } from "@/lib/authClient";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";


/**
 * RailGo login modal (email OTP).
 * Adjust the two endpoint paths + response shape to match your Spring Boot controllers.
 */
const SEND_OTP_URL = "/api/auth/send_email_login_otp";
const VERIFY_OTP_URL = "/api/auth/verify_email_login_otp";
const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

type Props = {
  open: boolean;
  onClose: () => void;
  /** Called with the new JWT after a successful login (e.g. dispatch to Redux + set cookie). */
  onSuccess?: (
  token: string,
  loggedInUser: AuthUser | null
) => void;
};

export default function LoginModal({ open, onClose, onSuccess }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [action, setAction] = useState<"login" | "registration">("login");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const emailRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset when closed, lock scroll + Esc to close while open
  useEffect(() => {
    if (!open) {
      setStep("email");
      setAction("login");
      setEmail("");
      setFirstName("");
      setLastName("");
      setOtp(Array(OTP_LENGTH).fill(""));
      setError("");
      setLoading(false);
      setCooldown(0);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: globalThis.KeyboardEvent) =>
      e.key === "Escape" && onClose();
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
  const isRegistration = action === "registration";
  const namesValid =
    !isRegistration || (firstName.trim() !== "" && lastName.trim() !== "");

  async function sendOtp() {
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);

      const { ok, data } = await clientFetch(SEND_OTP_URL, {
        method: "POST",
        body: formData,
      });
      if (!ok)
        throw new Error(
          "Could not send the code. Check your email and try again.",
        );

      // Backend tells us whether this email is an existing user or a new one
      const nextAction =
        data?.action === "registration" ? "registration" : "login";
      setAction(nextAction);
      setStep("otp");
      setCooldown(RESEND_SECONDS);
      setTimeout(() => {
        if (nextAction === "registration") firstNameRef.current?.focus();
        else otpRefs.current[0]?.focus();
      }, 0);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(code: string) {
    if (isRegistration && !namesValid) {
      setError("Please enter your first and last name.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("otp", code);
      if (isRegistration) {
        formData.append("firstName", firstName.trim());
        formData.append("lastName", lastName.trim());
      }

      const { ok, data, headers } = await clientFetch(VERIFY_OTP_URL, {
        method: "POST",
        body: formData,
      });
      if (!ok) throw new Error("That code is incorrect or expired.");

      const token = headers?.get("token") || getClientTokenCookie() || "";
      const rawUser = headers?.get("isuser");
      let loggedInUser: AuthUser | null = null;
      if (rawUser) {
        try {
          loggedInUser = JSON.parse(rawUser);
        } catch {
          loggedInUser = null;
        }
      }

      if (token && loggedInUser) {
        dispatch(setCredentials({ token, user: loggedInUser }));
      }

      onSuccess?.(token, loggedInUser);
      router.refresh();
      onClose();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong. Try again.",
      );
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
    if (next.every(Boolean) && namesValid) verifyOtp(next.join(""));
  }

  function onOtpKeyDown(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      otpRefs.current[i - 1]?.focus();
  }

  function onOtpPaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((c, i) => (next[i] = c));
    setOtp(next);
    if (pasted.length === OTP_LENGTH) {
      if (namesValid) verifyOtp(pasted);
    } else otpRefs.current[pasted.length]?.focus();
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
            className="absolute cursor-pointer right-4 top-4 rounded-lg p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mb-4 flex items-center gap-2">
            <TramFront className="h-7 w-7" />
            <span className="text-xl font-bold">RailGo</span>
          </div>
          <h2 id="login-title" className="text-2xl font-bold">
            {step === "email"
              ? "Log in to book tickets"
              : isRegistration
                ? "Create your account"
                : "Enter your code"}
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
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
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
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Send code <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div>
              {/* Only shown when the backend says this email needs registration */}
              {isRegistration && (
                <div className="mb-5 grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="reg-first-name"
                      className="mb-1.5 block text-sm font-semibold text-slate-700"
                    >
                      First name
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        ref={firstNameRef}
                        id="reg-first-name"
                        type="text"
                        autoComplete="given-name"
                        value={firstName}
                        disabled={loading}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:bg-slate-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="reg-last-name"
                      className="mb-1.5 block text-sm font-semibold text-slate-700"
                    >
                      Last name
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="reg-last-name"
                        type="text"
                        autoComplete="family-name"
                        value={lastName}
                        disabled={loading}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:bg-slate-50"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div
                className="flex justify-between gap-2"
                aria-label="One-time code"
              >
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
                disabled={otp.some((d) => !d) || !namesValid || loading}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="h-5 w-5" /> Verify and log in
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-between text-sm">
                <button
                  onClick={() => {
                    setStep("email");
                    setAction("login");
                    setFirstName("");
                    setLastName("");
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