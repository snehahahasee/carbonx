import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  BadgeCheck,
  Banknote,
  Blocks,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Factory,
  Flame,
  Gauge,
  Home,
  Leaf,
  Loader2,
  LogOut,
  Menu,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  SunMedium,
  Wallet,
  Zap
} from "lucide-react";
import "./main.css";
import { api, clearSession, setSession, storedUser } from "./api";

const nav = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
  { id: "certificate", label: "Certificate", icon: ShieldCheck }
];

const businessTypes = ["factory", "restaurant", "logistics", "warehouse"];

function rupee(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function Toast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <div className="fixed right-5 top-5 z-50 flex w-[min(92vw,380px)] items-center gap-3 rounded-lg border border-forest/15 bg-white p-4 shadow-soft">
      <CheckCircle2 className="h-6 w-6 text-forest" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{toast.title}</p>
        <p className="truncate text-xs text-slate-500">{toast.message}</p>
      </div>
      <button className="ml-auto rounded-md px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "Aarav Precision Works",
    email: "factory@carbonx.demo",
    password: "password123",
    business_type: "factory"
  });

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api(mode === "login" ? "/auth/login" : "/auth/signup", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setSession(data);
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f4f7f1] lg:grid-cols-[1fr_480px]">
      <section className="relative flex min-h-[42vh] flex-col justify-between overflow-hidden bg-ink p-8 text-white lg:min-h-screen lg:p-12">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1600&q=80"
          alt="Clean energy grid"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-forest/70 to-clay/40" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-white text-forest">
            <Leaf className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold tracking-normal">CarbonX</p>
            <p className="text-sm text-white/70">Climate finance for SMEs</p>
          </div>
        </div>
        <div className="relative z-10 max-w-2xl">
          <p className="mb-4 inline-flex rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-mint backdrop-blur">
            Track, reduce, earn, trade
          </p>
          <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-normal md:text-6xl">
            Carbon intelligence with a working wallet.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/78">
            A clean SaaS prototype for emissions data, sustainability insights, carbon credits, and verified records.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest">{mode === "login" ? "Welcome back" : "Create workspace"}</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-normal text-ink">{mode === "login" ? "Sign in to CarbonX" : "Start CarbonX"}</h2>
          </div>

          {mode === "signup" && (
            <>
              <Label text="Business name">
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Label>
              <Label text="Industry type">
                <select className="input" value={form.business_type} onChange={(e) => setForm({ ...form, business_type: e.target.value })}>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </Label>
            </>
          )}

          <Label text="Email">
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Label>
          <Label text="Password">
            <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </Label>

          {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}

          <button className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-forest font-bold text-white transition hover:bg-[#0b5b43]" disabled={loading}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ChevronRight className="h-5 w-5" />}
            {mode === "login" ? "Login" : "Create account"}
          </button>

          <button
            type="button"
            className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-ink hover:bg-slate-50"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Need an account? Sign up" : "Already registered? Login"}
          </button>
          <p className="mt-4 text-center text-xs text-slate-500">Demo: factory@carbonx.demo / password123</p>
        </form>
      </section>
    </main>
  );
}

function Label({ text, children }) {
  return (
    <label className="mb-4 block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{text}</span>
      {children}
    </label>
  );
}

function Layout({ children, active, setActive, user, onLogout }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#f5f7f3] text-ink">
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white p-5 transition lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-forest text-white"><Leaf className="h-6 w-6" /></div>
          <div>
            <p className="text-xl font-extrabold">CarbonX</p>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">SME console</p>
          </div>
        </div>
        <nav className="space-y-2">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-bold transition ${active === item.id ? "bg-forest text-white shadow-soft" : "text-slate-600 hover:bg-slate-100"}`}
                onClick={() => { setActive(item.id); setOpen(false); }}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-slate-200 bg-[#f8faf7] p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-limewash text-forest">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold">{user?.name}</p>
              <p className="capitalize text-xs text-slate-500">{user?.business_type}</p>
            </div>
          </div>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-bold text-slate-600 hover:bg-white" onClick={onLogout}>
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-slate-200 bg-white/86 px-5 py-4 backdrop-blur lg:px-8">
          <button className="rounded-lg border border-slate-200 p-2 lg:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">Carbon finance workspace</p>
            <h1 className="text-xl font-extrabold tracking-normal md:text-2xl">{nav.find((item) => item.id === active)?.label}</h1>
          </div>
          <div className="hidden items-center gap-2 rounded-lg bg-limewash px-4 py-2 text-sm font-bold text-forest md:flex">
            <BadgeCheck className="h-4 w-4" /> Demo data live
          </div>
        </header>
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function ScoreRing({ score }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative grid place-items-center">
      <svg width="154" height="154" viewBox="0 0 154 154">
        <circle cx="77" cy="77" r={radius} fill="none" stroke="#e7ece4" strokeWidth="14" />
        <circle className="ring-score" cx="77" cy="77" r={radius} fill="none" stroke="#0F6B4F" strokeWidth="14" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90 77 77)" />
      </svg>
      <div className="absolute text-center">
        <p className="text-4xl font-extrabold">{Math.round(score)}</p>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Carbon Score</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone = "green" }) {
  const tones = {
    green: "bg-mint text-forest",
    blue: "bg-skyglass text-blue-700",
    orange: "bg-orange-50 text-clay",
    lime: "bg-limewash text-forest"
  };
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-4 grid h-11 w-11 place-items-center rounded-lg ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tracking-normal">{value}</p>
    </div>
  );
}

function Dashboard({ data, refresh, showToast }) {
  const latest = data.latestEmission || { electricity: 0, fuel: 0, transport: 0 };
  const [form, setForm] = useState({
    electricity: latest.electricity,
    fuel: latest.fuel,
    transport: latest.transport
  });
  const [saving, setSaving] = useState(false);
  const chartData = [
    { name: "Electricity", value: Number(form.electricity) * 0.82 },
    { name: "Fuel", value: Number(form.fuel) * 2.31 },
    { name: "Transport", value: Number(form.transport) * 0.08 }
  ];

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await api("/emissions", { method: "POST", body: JSON.stringify(form) });
      showToast("Emission record saved", "Your Carbon Score and wallet were refreshed.");
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard icon={Zap} label="Total emissions" value={`${data.summary.total_emissions} kg CO2`} />
          <StatCard icon={CircleDollarSign} label="Waste insight" value={rupee(data.summary.costInsight.level === "high" ? data.summary.total_emissions * 18 : 2100)} tone="orange" />
          <StatCard icon={Wallet} label="Credits earned" value={`${data.wallet.creditsEarned} CRX`} tone="blue" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold">Carbon Input Form</h2>
                <p className="mt-1 text-sm text-slate-500">Monthly operating data for emissions tracking.</p>
              </div>
              <Factory className="h-6 w-6 text-forest" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <NumberInput label="Electricity usage" suffix="kWh" value={form.electricity} onChange={(value) => setForm({ ...form, electricity: value })} />
              <NumberInput label="Fuel usage" suffix="litres" value={form.fuel} onChange={(value) => setForm({ ...form, fuel: value })} />
              <NumberInput label="Transport distance" suffix="km" value={form.transport} onChange={(value) => setForm({ ...form, transport: value })} />
            </div>
            <button className="mt-5 flex h-11 items-center justify-center gap-2 rounded-lg bg-ink px-5 text-sm font-bold text-white transition hover:bg-forest" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gauge className="h-4 w-4" />}
              Calculate and Save
            </button>
          </form>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <ScoreRing score={data.summary.carbon_score} />
            <div className="mt-4 rounded-lg bg-limewash p-4 text-sm font-semibold text-forest">
              {data.summary.costInsight.message}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-extrabold">Emission Mix</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0F6B4F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold">Recommendations</h2>
            <Sparkles className="h-5 w-5 text-clay" />
          </div>
          <div className="space-y-3">
            {data.summary.recommendations.map((item) => (
              <div key={item.title} className="rounded-lg border border-slate-200 p-4">
                <p className="font-bold text-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                  <span className="rounded-full bg-mint px-3 py-1 text-forest">{item.co2Reduction} kg CO2 reduced</span>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-clay">{rupee(item.savings)} saved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-ink p-6 text-white shadow-sm">
          <p className="text-sm font-semibold text-mint">Verified Carbon Record</p>
          <p className="mt-3 break-all font-mono text-sm text-white/82">{data.latestEmission?.certificate_hash}</p>
        </div>
      </aside>
    </div>
  );
}

function NumberInput({ label, suffix, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-forest/20">
        <input className="w-full px-4 py-3 outline-none" type="number" min="0" value={value} onChange={(e) => onChange(Number(e.target.value))} />
        <span className="grid min-w-20 place-items-center bg-slate-50 px-3 text-xs font-bold text-slate-500">{suffix}</span>
      </div>
    </label>
  );
}

function WalletView({ data, showToast, refresh }) {
  const flow = [
    { month: "Jan", credits: 8 },
    { month: "Feb", credits: 10 },
    { month: "Mar", credits: 12 },
    { month: "Apr", credits: data.wallet.balance }
  ];
  async function simulate(type) {
    await api("/transactions", { method: "POST", body: JSON.stringify({ credits: 4, type }) });
    showToast(type === "buy" ? "Credits purchased" : "Credits listed", "The simulated wallet transaction is complete.");
    refresh();
  }
  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-forest">Carbon Wallet</p>
        <h2 className="mt-2 text-4xl font-extrabold tracking-normal">{data.wallet.balance} CRX</h2>
        <p className="mt-2 text-slate-500">{rupee(data.wallet.rupeeEquivalent)} simulated equivalent</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button className="flex items-center justify-center gap-2 rounded-lg bg-forest px-4 py-3 font-bold text-white hover:bg-[#0b5b43]" onClick={() => simulate("buy")}><Banknote className="h-5 w-5" /> Buy Credits</button>
          <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 font-bold text-ink hover:bg-slate-50" onClick={() => simulate("sell")}><Blocks className="h-5 w-5" /> Sell Credits</button>
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-extrabold">Wallet Growth</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={flow}>
              <defs>
                <linearGradient id="credits" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#0F6B4F" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0F6B4F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="credits" stroke="#0F6B4F" fill="url(#credits)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

function Marketplace({ listings, showToast, refresh }) {
  async function transact(type, credits) {
    await api("/transactions", { method: "POST", body: JSON.stringify({ credits, type }) });
    showToast(type === "buy" ? "Credits bought" : "Credits listed for sale", `${credits} CRX moved through the mock marketplace.`);
    refresh();
  }
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {listings.map((item) => (
        <article key={item.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <img className="h-48 w-full object-cover" src={item.image} alt={item.title} />
          <div className="p-5">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 className="text-lg font-extrabold">{item.title}</h2>
              <span className="rounded-full bg-limewash px-3 py-1 text-xs font-extrabold text-forest">{item.rating}</span>
            </div>
            <p className="text-sm text-slate-500">{item.location}</p>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-2xl font-extrabold">{item.credits} CRX</p>
                <p className="text-sm font-semibold text-slate-500">{rupee(item.price)} / credit</p>
              </div>
              <SunMedium className="h-9 w-9 text-clay" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button className="rounded-lg bg-forest py-3 text-sm font-bold text-white hover:bg-[#0b5b43]" onClick={() => transact("buy", item.credits)}>Buy Credits</button>
              <button className="rounded-lg border border-slate-200 py-3 text-sm font-bold text-ink hover:bg-slate-50" onClick={() => transact("sell", Math.round(item.credits / 2))}>Sell Credits</button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function Certificate({ data, showToast }) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-lg bg-limewash text-forest"><ShieldCheck className="h-8 w-8" /></div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-forest">Blockchain Certificate</p>
            <h2 className="text-3xl font-extrabold tracking-normal">Verified Carbon Record</h2>
          </div>
        </div>
        <div className="mt-8 rounded-lg bg-ink p-5 text-white">
          <p className="text-sm font-semibold text-mint">Mock hash</p>
          <p className="mt-3 break-all font-mono text-lg">{data.latestEmission?.certificate_hash}</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard icon={Flame} label="Emissions" value={`${data.summary.total_emissions} kg`} />
          <StatCard icon={Gauge} label="Score" value={data.summary.carbon_score} tone="lime" />
          <StatCard icon={Leaf} label="Reduction" value={`${data.summary.reduced_emissions} kg`} tone="blue" />
        </div>
        <button className="mt-6 rounded-lg bg-forest px-5 py-3 text-sm font-bold text-white hover:bg-[#0b5b43]" onClick={() => showToast("Certificate generated", "A new mock verification event was recorded.")}>
          Generate Certificate
        </button>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-extrabold">Audit Trail</h3>
        <div className="mt-5 space-y-4">
          {["Emission inputs stored", "Score calculated", "Credits minted", "Record verified"].map((item) => (
            <div className="flex items-center gap-3" key={item}>
              <div className="grid h-8 w-8 place-items-center rounded-full bg-mint text-forest"><CheckCircle2 className="h-4 w-4" /></div>
              <p className="text-sm font-bold text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LoadingDashboard() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {[1, 2, 3].map((item) => <div key={item} className="skeleton h-36 rounded-lg" />)}
      <div className="skeleton h-96 rounded-lg md:col-span-2" />
      <div className="skeleton h-96 rounded-lg" />
    </div>
  );
}

function App() {
  const [user, setUser] = useState(storedUser());
  const [active, setActive] = useState("dashboard");
  const [data, setData] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(Boolean(storedUser()));
  const [toast, setToast] = useState(null);

  const showToast = (title, message) => {
    setToast({ title, message });
    window.setTimeout(() => setToast(null), 3200);
  };

  async function refresh() {
    setLoading(true);
    const [dashboard, market] = await Promise.all([api("/dashboard"), api("/marketplace")]);
    setData(dashboard);
    setUser(dashboard.user);
    setListings(market.listings);
    setLoading(false);
  }

  useEffect(() => {
    if (user) refresh().catch(() => { clearSession(); setUser(null); setLoading(false); });
  }, []);

  const content = useMemo(() => {
    if (loading || !data) return <LoadingDashboard />;
    if (active === "wallet") return <WalletView data={data} showToast={showToast} refresh={refresh} />;
    if (active === "marketplace") return <Marketplace listings={listings} showToast={showToast} refresh={refresh} />;
    if (active === "certificate") return <Certificate data={data} showToast={showToast} />;
    return <Dashboard data={data} refresh={refresh} showToast={showToast} />;
  }, [active, data, loading, listings]);

  if (!user) return <AuthScreen onLogin={(nextUser) => { setUser(nextUser); refresh(); }} />;

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <Layout active={active} setActive={setActive} user={user} onLogout={() => { clearSession(); setUser(null); }}>
        {content}
      </Layout>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
