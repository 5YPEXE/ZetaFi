"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

// Floating orb positions (static so no hydration mismatch)
const ORBS = [
  { w: 600, h: 600, x: -10, y: -10, color: "from-primary/20 to-transparent", dur: 18 },
  { w: 500, h: 500, x: 60, y: 50, color: "from-emerald-500/10 to-transparent", dur: 24 },
  { w: 400, h: 400, x: 20, y: 70, color: "from-cyan-500/10 to-transparent", dur: 20 },
];
const PARTICLES = [
  { x: 15, y: 20, dur: 6 }, { x: 80, y: 10, dur: 8 }, { x: 50, y: 80, dur: 7 },
  { x: 25, y: 60, dur: 9 }, { x: 75, y: 40, dur: 5 }, { x: 90, y: 75, dur: 10 },
  { x: 10, y: 85, dur: 7 }, { x: 60, y: 25, dur: 6 }, { x: 40, y: 50, dur: 8 },
  { x: 70, y: 90, dur: 11 }, { x: 35, y: 15, dur: 9 }, { x: 85, y: 55, dur: 6 },
];

export default function AuthModal({ onSuccess, initialMode = 'login' }: { onSuccess: () => void; initialMode?: 'login' | 'signup' }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden"
      style={{ background: 'hsl(var(--background))' }}
    >
      {/* ── Animated gradient orbs ── */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-radial-gradient pointer-events-none blur-3xl bg-gradient-radial ${orb.color}`}
          style={{ width: orb.w, height: orb.h, left: `${orb.x}%`, top: `${orb.y}%` }}
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.08, 0.95, 1] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* ── Subtle dot grid ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* ── Floating particles ── */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/40 pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [-8, 8, -8], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        />
      ))}

      {/* ── Thin top accent line ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* ── Auth card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md z-10"
      >
        {/* Glow behind card */}
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-emerald-500/10 blur-sm" />

        <div className="relative bg-card/80 backdrop-blur-xl border border-border/60 rounded-3xl shadow-2xl overflow-hidden">
          {/* Inner top shimmer */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="p-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img src="/logo.png" alt="ZetaFi Logo" className="w-20 h-20 rounded-2xl shadow-lg object-cover ring-2 ring-primary/20" />
              </motion.div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-2">
              {isLogin ? "Tekrar Hoş Geldin" : "ZetaFi'e Katıl"}
            </h2>
            <p className="text-center text-muted-foreground text-sm mb-8">
              {isLogin
                ? "Kaldığın yerden finansal zekanı geliştirmeye devam et."
                : "Finansal özgürlüğe giden yolculuğunu bugün başlat."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresin"
                  className="w-full bg-secondary/60 border border-border/60 focus:border-primary focus:bg-card/80 pl-12 pr-4 py-3.5 rounded-xl transition-all outline-none backdrop-blur-sm"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="password" required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifren (En az 6 karakter)"
                  className="w-full bg-secondary/60 border border-border/60 focus:border-primary focus:bg-card/80 pl-12 pr-4 py-3.5 rounded-xl transition-all outline-none backdrop-blur-sm"
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="text-rose-500 text-sm text-center bg-rose-500/10 p-3 rounded-lg border border-rose-500/20"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit" disabled={loading}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-70"
              >
                {loading
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : (isLogin ? "Giriş Yap" : "Hesap Oluştur")}
              </motion.button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Hesabın yok mu?" : "Zaten bir hesabın var mı?"}
              </span>
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                className="ml-2 text-primary font-bold hover:underline"
              >
                {isLogin ? "Kayıt Ol" : "Giriş Yap"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}



