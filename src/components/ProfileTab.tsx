"use client";
import { motion } from "framer-motion";
import { Badge } from "../hooks/useFinanceData";
import { Award, Star, Zap, Shield, Crown } from "lucide-react";

const TIER_STYLES: Record<string, { border: string; bg: string; label: string; icon: React.ReactNode; glow: string }> = {
  bronze:   { border: "border-amber-700/40",   bg: "bg-amber-700/10",   label: "Bronz",   icon: <Shield className="w-3 h-3" />, glow: "shadow-amber-700/20" },
  silver:   { border: "border-slate-400/40",   bg: "bg-slate-400/10",   label: "Gümüş",  icon: <Star  className="w-3 h-3" />, glow: "shadow-slate-400/20" },
  gold:     { border: "border-yellow-400/50",  bg: "bg-yellow-400/10",  label: "Altın",  icon: <Crown className="w-3 h-3" />, glow: "shadow-yellow-400/20" },
  platinum: { border: "border-primary/50",     bg: "bg-primary/10",     label: "Platin", icon: <Zap   className="w-3 h-3" />, glow: "shadow-primary/30" },
};

const TITLES = [
  { level: 1,  title: "Çırak",             color: "text-slate-400"   },
  { level: 3,  title: "Gözlemci",          color: "text-emerald-400" },
  { level: 5,  title: "Analist",           color: "text-blue-400"    },
  { level: 8,  title: "Stratejist",        color: "text-violet-400"  },
  { level: 12, title: "Portföy Uzmanı",   color: "text-amber-400"   },
  { level: 16, title: "Piyasa Okuyucu",   color: "text-orange-400"  },
  { level: 20, title: "Finansal Usta",    color: "text-rose-400"    },
  { level: 25, title: "ZetaFi Elite",     color: "text-primary"     },
  { level: 30, title: "Grandmaster",      color: "text-yellow-400"  },
  { level: 50, title: "⚡ Legend",          color: "text-primary"     },
];

export function getCurrentTitle(level: number) {
  return [...TITLES].reverse().find(t => level >= t.level) ?? TITLES[0];
}

export function getNextTitle(level: number) {
  return TITLES.find(t => level < t.level) ?? null;
}

interface Props {
  badges: Badge[];
  userLevel: number;
  userExp: number;
  zetafiScore: number;
  readArticlesCount: number;
}

export default function ProfileTab({ badges, userLevel, userExp, zetafiScore, readArticlesCount }: Props) {
  const currentTitle = getCurrentTitle(userLevel);
  const nextTitle    = getNextTitle(userLevel);

  const unlockedCount = badges.filter(b => b.isUnlocked).length;
  const investmentBadge = badges.find(b => b.id === "active_trader");

  const tierGroups = (["platinum", "gold", "silver", "bronze"] as const).map(tier => ({
    tier,
    badges: badges.filter(b => b.tier === tier),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="pb-10 space-y-6"
    >
      {/* Profile header */}
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-3xl">
            🧑‍💼
          </div>
          <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-[10px] font-black px-2 py-0.5 rounded-full shadow">
            Lv.{userLevel}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className={`text-xl font-black mb-1 ${currentTitle.color}`}>{currentTitle.title}</div>
          <div className="text-xs text-muted-foreground mb-3">Seviye {userLevel} · {unlockedCount}/{badges.length} Rozet</div>

          {/* XP bar */}
          <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
            <span>XP: {userExp}/100</span>
            {nextTitle && <span>→ Lv.{nextTitle.level} <span className={getNextTitle(userLevel + 1)?.color ?? ""}>{nextTitle.title}</span></span>}
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${userExp}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            <div className="bg-secondary rounded-xl px-3 py-1.5 text-center">
              <div className="text-xs font-black tabular-nums">{zetafiScore}</div>
              <div className="text-[10px] text-muted-foreground">ZetaFi Skoru</div>
            </div>
            <div className="bg-secondary rounded-xl px-3 py-1.5 text-center">
              <div className="text-xs font-black tabular-nums">{readArticlesCount}</div>
              <div className="text-[10px] text-muted-foreground">Makale Okundu</div>
            </div>
            <div className="bg-secondary rounded-xl px-3 py-1.5 text-center">
              <div className="text-xs font-black tabular-nums">{unlockedCount}</div>
              <div className="text-[10px] text-muted-foreground">Rozet Kazanıldı</div>
            </div>
          </div>
        </div>

        {/* Score gauge */}
        <div className="flex flex-col items-center gap-1">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="6" className="text-secondary" />
            <circle
              cx="40" cy="40" r="32"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="201"
              strokeDashoffset={201 - (201 * zetafiScore) / 1000}
              transform="rotate(-90 40 40)"
              className={`transition-all duration-1000 ${zetafiScore > 700 ? "text-emerald-500" : zetafiScore > 400 ? "text-primary" : "text-rose-500"}`}
            />
            <text x="40" y="44" textAnchor="middle" fontSize="13" fontWeight="900" fill="currentColor" className="text-foreground">{zetafiScore}</text>
          </svg>
          <span className="text-[10px] text-muted-foreground">/ 1000</span>
        </div>
      </div>

      {/* Badges by tier */}
      {tierGroups.map(({ tier, badges: tierBadges }) => {
        const style = TIER_STYLES[tier];
        return (
          <div key={tier} className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${style.bg} ${style.border}`}>
                {style.icon} {style.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {tierBadges.filter(b => b.isUnlocked).length}/{tierBadges.length} kazanıldı
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {tierBadges.map(b => (
                <motion.div
                  key={b.id}
                  whileHover={b.isUnlocked ? { scale: 1.03 } : {}}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all ${
                    b.isUnlocked
                      ? `${style.bg} ${style.border} shadow-sm ${style.glow}`
                      : "bg-secondary/30 border-border opacity-40 grayscale"
                  }`}
                >
                  <span className="text-3xl">{b.icon}</span>
                  <div className="text-xs font-bold leading-tight">{b.name}</div>
                  <div className="text-[10px] text-muted-foreground leading-tight">{b.desc}</div>
                  {b.isUnlocked && (
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                      <Award className="w-3 h-3" /> Kazanıldı
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Next badge hint */}
      {(() => {
        const nextBadge = badges.find(b => !b.isUnlocked);
        if (!nextBadge) return null;
        const style = TIER_STYLES[nextBadge.tier];
        return (
          <div className={`border rounded-2xl p-5 flex items-center gap-4 ${style.bg} ${style.border}`}>
            <span className="text-4xl">{nextBadge.icon}</span>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">Sıradaki Hedef</div>
              <div className="font-bold">{nextBadge.name}</div>
              <div className="text-sm text-muted-foreground">{nextBadge.desc}</div>
            </div>
          </div>
        );
      })()}
    </motion.div>
  );
}
