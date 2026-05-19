"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Transaction } from "../hooks/useFinanceData";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { TrendingDown, TrendingUp, Wallet, BarChart2 } from "lucide-react";

const COLORS = [
  "#10b981","#3b82f6","#f59e0b","#8b5cf6",
  "#ec4899","#0ea5e9","#f97316","#14b8a6",
  "#e11d48","#6366f1","#84cc16","#a855f7"
];

export default function BudgetTab({ transactions }: { transactions: Transaction[] }) {
  const expenses = transactions.filter(t => t.amount < 0 && t.type === "expense");
  const incomes  = transactions.filter(t => t.amount > 0);

  const totalExpense = expenses.reduce((a, t) => a + Math.abs(t.amount), 0);
  const totalIncome  = incomes.reduce((a, t) => a + t.amount, 0);
  const netFlow      = totalIncome - totalExpense;

  // Category breakdown for expenses
  const categoryMap: Record<string, number> = {};
  expenses.forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + Math.abs(t.amount);
  });

  const categoryData = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Monthly income vs expense (last 6 months)
  const monthlyData = useMemo(() => {
    const map: Record<string, { month: string; gelir: number; gider: number }> = {};
    transactions.forEach(t => {
      // date format: DD.MM.YYYY or similar
      const parts = t.date.split(".");
      if (parts.length < 2) return;
      const key = `${parts[1]}/${parts[2] ?? ""}`.replace(/\/$/, "");
      if (!map[key]) map[key] = { month: `${parts[1]}/${(parts[2] ?? "").slice(2)}`, gelir: 0, gider: 0 };
      if (t.amount > 0) map[key].gelir += t.amount;
      else map[key].gider += Math.abs(t.amount);
    });
    return Object.values(map).slice(-6);
  }, [transactions]);

  const fmt = (v: number) =>
    `₺${v.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="pb-10 space-y-6"
    >
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Toplam Gelir</span>
          <span className="text-2xl font-black text-emerald-500 tabular-nums">{fmt(totalIncome)}</span>
          <div className="flex items-center gap-1 text-xs text-emerald-500 font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> Tüm zamanlar
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Toplam Harcama</span>
          <span className="text-2xl font-black text-rose-500 tabular-nums">{fmt(totalExpense)}</span>
          <div className="flex items-center gap-1 text-xs text-rose-500 font-bold">
            <TrendingDown className="w-3.5 h-3.5" /> Gider kalemleri
          </div>
        </div>
        <div className={`bg-card border rounded-2xl p-5 flex flex-col gap-2 ${netFlow >= 0 ? "border-emerald-500/20" : "border-rose-500/20"}`}>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Net Akış</span>
          <span className={`text-2xl font-black tabular-nums ${netFlow >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
            {netFlow >= 0 ? "+" : ""}{fmt(netFlow)}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-bold">
            <Wallet className="w-3.5 h-3.5" /> Gelir − Gider
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-primary">
            <BarChart2 className="w-4 h-4" /> Harcama Kategorileri
          </h3>
          {categoryData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
              Henüz gider kaydı yok
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-48 h-48 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" innerRadius={40} outerRadius={70} paddingAngle={3} stroke="none">
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: any) => fmt(Number(v))}
                      contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2 w-full">
                {categoryData.slice(0, 6).map((item, i) => {
                  const pct = totalExpense > 0 ? (item.value / totalExpense) * 100 : 0;
                  return (
                    <div key={item.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          {item.name}
                        </span>
                        <span className="font-bold tabular-nums text-muted-foreground">{fmt(item.value)} · %{pct.toFixed(0)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Monthly bar chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-primary">
            <TrendingUp className="w-4 h-4" /> Aylık Gelir / Gider
          </h3>
          {monthlyData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
              Yeterli veri yok
            </div>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#64748b" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#64748b" tickFormatter={v => `₺${(v / 1000).toFixed(0)}K`} />
                  <Tooltip
                    formatter={(v: any, name: any) => [fmt(Number(v)), name === "gelir" ? "Gelir" : "Gider"]}
                    contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", fontSize: "12px" }}
                  />
                  <Bar dataKey="gelir" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="gider" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="flex gap-4 mt-3 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Gelir</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Gider</span>
          </div>
        </div>
      </div>

      {/* Top transactions */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-sm font-bold mb-4 uppercase tracking-widest text-primary">En Büyük Harcamalar</h3>
        {expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground">Henüz gider kaydı yok.</p>
        ) : (
          <div className="space-y-2">
            {[...expenses].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount)).slice(0, 5).map((tx, i) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 hover:bg-secondary/60 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-muted-foreground w-5 text-right">{i + 1}</span>
                  <div>
                    <div className="font-semibold text-sm">{tx.name}</div>
                    <div className="text-[10px] text-muted-foreground">{tx.category} · {tx.date}</div>
                  </div>
                </div>
                <span className="font-black tabular-nums text-rose-500 text-sm">{fmt(Math.abs(tx.amount))}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
