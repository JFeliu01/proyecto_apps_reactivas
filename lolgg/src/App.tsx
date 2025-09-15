import React, { useEffect, useMemo, useState } from "react";

// ------------------------------------------------------------------
// OPGG-style Champion Grid
// - Uses a locally served champions JSON: /backend/champion.json
// - Uses locally saved square icons:   /backend/champion-icons/<Id>.png
// - Tailwind-only, no extra deps. Clean, responsive, keyboard friendly.
// ------------------------------------------------------------------

// Utility: very light role mapping to mimic op.gg filters
const ROLE_TABS = ["All", "Top", "Jungle", "Mid", "ADC", "Support"] as const;
type Role = typeof ROLE_TABS[number];

function inferRolesFromTags(tags: string[] = []): Role[] {
  const set = new Set<Role>();
  const t = tags.map((s) => s.toLowerCase());
  if (t.includes("marksman")) set.add("ADC");
  if (t.includes("support")) set.add("Support");
  if (t.includes("mage") || t.includes("assassin")) set.add("Mid");
  if (t.includes("fighter") || t.includes("tank")) set.add("Top");
  if (t.includes("fighter") || t.includes("tank")) set.add("Jungle");
  return Array.from(set.size ? set : ["All"]);
}

export default function App() {
  const [champions, setChampions] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [role, setRole] = useState<Role>("All");
  const [sort, setSort] = useState<"alpha" | "difficulty">("alpha");

  useEffect(() => {
    fetch("/backend/champion.json")
      .then((r) => {
        if (!r.ok) throw new Error("No se pudo cargar champion.json");
        return r.json();
      })
      .then((data) => setChampions(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const list = useMemo(() => {
    if (!champions?.data) return [] as any[];
    let arr = Object.values(champions.data) as any[];

    // enrich with inferred roles for filtering
    arr = arr.map((c) => ({ ...c, _roles: inferRolesFromTags(c.tags) }));

    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      arr = arr.filter((c) => c.name.toLowerCase().includes(needle) || c.id.toLowerCase().includes(needle));
    }
    if (role !== "All") {
      arr = arr.filter((c) => (c._roles as Role[]).includes(role));
    }
    if (sort === "alpha") {
      arr = arr.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      arr = arr.sort((a, b) => (b.info?.difficulty ?? 0) - (a.info?.difficulty ?? 0));
    }
    return arr;
  }, [champions, q, role, sort]);

  return (
    <div className="min-h-screen bg-neutral-800 text-neutral-100">
      <Header />

      <div className="mx-auto w-full max-w-7xl px-4 pb-16">
        {/* Controls */}
        <div className="sticky top-0 z-10 -mx-4 border-b border-neutral-800/60 bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/40">
          <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto">
              {ROLE_TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setRole(t)}
                  className={[
                    "px-3 py-1.5 rounded-full text-sm whitespace-nowrap border transition",
                    role === t
                      ? "bg-sky-500 text-white border-transparent shadow"
                      : "bg-neutral-900/70 text-neutral-200 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900",
                  ].join(" ")}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-64 max-w-[70vw]">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search champion…"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 px-10 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16a6.471 6.471 0 004.23-1.57l.27.28v.79L20 21.5 21.5 20 15.5 14m-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="alpha">Alphabetical</option>
                <option value="difficulty">By Difficulty</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
          {loading && <SkeletonGrid />}
          {error && <div className="text-red-400 text-sm">Error: {error}</div>}
          {!loading && !error && list.map((c: any) => (
            <ChampionTile key={c.id} champ={c} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">OP.GG style · Champions</h1>
      <p className="text-neutral-400 mt-1 text-sm">Local data · No external fetch (except the images you host).</p>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <>
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} className="aspect-square rounded-xl bg-neutral-900/60 border border-neutral-800 animate-pulse" />
      ))}
    </>
  );
}

function ChampionTile({ champ }: { champ: any }) {
  const [open, setOpen] = useState(false);
  const iconUrl = `/backend/champion-icons/${champ.id}.png`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60 outline-none transition hover:border-sky-600 focus-visible:ring-2 focus-visible:ring-sky-500"
        aria-label={champ.name}
      >
        <img
          src={iconUrl}
          alt={champ.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        {/* Bottom caption like op.gg */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
          <div className="text-[11px] sm:text-xs font-semibold tracking-wide text-white text-center drop-shadow">
            {champ.name}
          </div>
        </div>
      </button>

      {/* Minimal modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 text-neutral-100 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 p-4 border-b border-neutral-800">
              <img src={iconUrl} alt="" className="h-12 w-12 rounded-lg" />
              <div>
                <div className="text-lg font-bold leading-tight">{champ.name}</div>
                <div className="text-xs text-neutral-400 -mt-0.5">{champ.title}</div>
              </div>
              <div className="ml-auto flex gap-2">
                {(champ.tags || []).map((t: string) => (
                  <span key={t} className="rounded-full border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300">{t}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-neutral-300">Info</h3>
                <ul className="space-y-1 text-sm">
                  {champ.info && Object.entries(champ.info).map(([k, v]) => (
                    <li key={k} className="flex justify-between gap-2"><span className="text-neutral-400">{k}</span><span>{String(v)}</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-neutral-300">Base Stats</h3>
                <ul className="max-h-44 overflow-auto pr-1 space-y-1 text-sm">
                  {champ.stats && Object.entries(champ.stats).map(([k, v]) => (
                    <li key={k} className="flex justify-between gap-2"><span className="text-neutral-400">{k}</span><span>{String(v)}</span></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-neutral-800">
              <button onClick={() => setOpen(false)} className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm hover:bg-neutral-700">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
