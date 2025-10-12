import { useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../AuthContext";

export default function AuthModal({ onClose, onLoggedOut }: { onClose: () => void, onLoggedOut?: () => void }) {
  const { status, user, login, register, logout } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      if (mode === "register") {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (e: any) {
      setFormError(e?.message || "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="font-semibold text-lg">{mode === "login" ? "Login" : "Register"}</div>
          <button onClick={onClose} className="text-sm px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">✕</button>
        </div>
        <div className="p-4">
          {status === "authenticated" && user ? (
            <div className="space-y-3">
              <div className="text-sm">Signed in as <span className="font-semibold">{user.email}</span></div>
              <button
                onClick={async () => { await logout(); onLoggedOut?.(); onClose(); }}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >Logout</button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3">
              {mode === "register" && (
                <div>
                  <label className="block text-xs mb-1">Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 px-3 py-2 text-sm" />
                </div>
              )}
              <div>
                <label className="block text-xs mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 px-3 py-2 text-sm" />
              </div>
              {formError && <div className="text-sm text-red-500">{formError}</div>}
              <button disabled={submitting} className="w-full rounded-xl border border-transparent bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-70">
                {submitting ? 'Please wait…' : (mode === 'login' ? 'Login' : 'Create Account')}
              </button>
              <div className="text-xs text-neutral-500">{mode === 'login' ? 'No account?' : 'Already have an account?'}{' '}
                <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setFormError(null); }} className="text-sky-600 hover:underline">
                  {mode === 'login' ? 'Register' : 'Login'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}


