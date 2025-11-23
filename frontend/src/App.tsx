import React, { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import Layout from "./components/Layout";
import { useAuth } from "./AuthContext";
import ChampionView from "./components/ChampionView";
import HeroPage from "./components/HeroPage";
import UserProfile from "./components/Profile";
import { API_URI } from "./runtimeConfig";

// Role icons imports
import AllIcon from "./assets/120px-All_icon.png";
import TopIcon from "./assets/120px-Top_icon.png";
import JungleIcon from "./assets/120px-Jungle_icon.png";
import MidIcon from "./assets/120px-Middle_icon.png";
import ADCIcon from "./assets/Bottom_icon.png";
import SupportIcon from "./assets/Support_icon.png";

// Subrole/Tag icons imports
import TankIcon from "./assets/Tank_icon.png";
import MageIcon from "./assets/Mage_icon.png";
import FighterIcon from "./assets/Fighter_icon.png";
import AssassinIcon from "./assets/Assasin_icon.png";
import SupportTagIcon from "./assets/Support_icon.png";
import MarksmanTagIcon from "./assets/Marksman_icon.png";

// ------------------------------------------------------------------
// OPGG-style Champion Grid (con React Router)
// ------------------------------------------------------------------

const ROLE_TABS = ["All", "Top", "Jungle", "Mid", "ADC", "Support"] as const;
type Role = typeof ROLE_TABS[number];

export type AppView = "hero" | "grid" | "champion" | "profile";

const ROLE_ICONS: Record<Role, string> = {
  All: AllIcon,
  Top: TopIcon,
  Jungle: JungleIcon,
  Mid: MidIcon,
  ADC: ADCIcon,
  Support: SupportIcon,
};

const TAG_ICONS: Record<string, string> = {
  Tank: TankIcon,
  Mage: MageIcon,
  Fighter: FighterIcon,
  Assassin: AssassinIcon,
  Support: SupportTagIcon,
  Marksman: MarksmanTagIcon,
};

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

/*
  We export default App which wraps AppInner with BrowserRouter so useNavigate
  can be used inside AppInner (react-router hook requirement).
*/

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

function AppInner() {
  const { status, user } = useAuth();
  const navigate = useNavigate();

  const [champions, setChampions] = useState<any | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // keep currentView only for passing into Layout to preserve any styling / active state uses
  const [currentView, setCurrentView] = useState<AppView>("hero");
  const [selectedChampionId, setSelectedChampionId] = useState<string | null>(
    null
  );
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [role, setRole] = useState<Role>("All");
  const [sort, setSort] = useState<"alpha" | "difficulty">("alpha");

  // fetch champions (same as before)
  useEffect(() => {
    fetch(`${API_URI}/api/champions`)
      .then((r) => {
        if (!r.ok) throw new Error("Could not load champions");
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
      arr = arr.filter(
        (c) =>
          c.name.toLowerCase().includes(needle) ||
          c.id.toLowerCase().includes(needle)
      );
    }
    if (role !== "All") {
      arr = arr.filter((c) => (c._roles as Role[]).includes(role));
    }
    if (sort === "alpha") {
      arr = arr.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      arr = arr.sort(
        (a, b) => (b.info?.difficulty ?? 0) - (a.info?.difficulty ?? 0)
      );
    }
    return arr;
  }, [champions, q, role, sort]);

  // --- Navigation helpers that preserve your original auth behavior ---
  const handleShowChampionDetails = (championId: string) => {
    if (status !== "authenticated") {
      // guard identical to original: open auth modal and show hero
      setCurrentView("hero");
      setAuthOpen(true);
      // do not navigate
      return;
    }
    setSelectedChampionId(championId);
    setCurrentView("champion");
    navigate(`/champion/${encodeURIComponent(championId)}`);
  };

  const handleShowGrid = () => {
    if (status !== "authenticated") {
      setCurrentView("hero");
      setAuthOpen(true);
      return;
    }
    setSelectedChampionId(null);
    setCurrentView("grid");
    navigate("/grid");
  };

  const handleShowHero = () => {
    setSelectedChampionId(null);
    setCurrentView("hero");
    navigate("/");
  };

  const handleShowProfile = () => {
    // original behavior set authOpen false when going to profile
    setSelectedChampionId(null);
    setCurrentView("profile");
    setAuthOpen(false);
    if (status === "authenticated") {
      navigate("/profile");
    } else {
      // if not authenticated, open modal (original behavior opened modal in some flows)
      setAuthOpen(true);
    }
  };

  const toggleFavorite = (championId: string) => {
    setFavorites((prev) => {
      const isFavorite = prev.includes(championId);
      if (isFavorite) return prev.filter((id) => id !== championId);

      if (prev.length >= 3) {
        setFavoriteError("You can only select up to 3 favorite champions.");
        setTimeout(() => setFavoriteError(null), 3000);
        return prev;
      }
      return [...prev, championId];
    });
  };

  const selectedChampion = useMemo(() => {
    if (!selectedChampionId || !champions?.data) return null;
    return champions.data[selectedChampionId];
  }, [selectedChampionId, champions]);

  // --- Render Layout and Routes ---
  return (
    <>
      <Layout
        onShowGrid={handleShowGrid}
        onShowHero={handleShowHero}
        onShowProfile={handleShowProfile}
        currentView={currentView}
        authOpen={authOpen}
        onOpenAuth={() => setAuthOpen(true)}
        onCloseAuth={() => setAuthOpen(false)}
        onLoggedOut={() => {
          setSelectedChampionId(null);
          setCurrentView("hero");
          navigate("/");
        }}
      >
        <Routes>
          {/* HERO */}
          <Route
            path="/"
            element={<HeroPage onEnterApp={handleShowGrid} />}
          />

          {/* GRID */}
          <Route
            path="/grid"
            element={
              status !== "authenticated" ? (
                <Navigate to="/" />
              ) : (
                <div className="mx-auto w-full max-w-7xl px-4 pb-16">
                  {/* Controls */}
                  <div className="sticky top-0 z-10 -mx-4 border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/95 dark:bg-neutral-900 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-neutral-950/40">
                    <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 overflow-x-auto">
                        {ROLE_TABS.map((t) => (
                          <button
                            key={t}
                            onClick={() => setRole(t)}
                            className={[
                              "px-3 py-2 rounded-full text-sm whitespace-nowrap border transition flex items-center gap-2",
                              role === t
                                ? "bg-sky-500 text-white border-transparent shadow"
                                : "bg-neutral-100/70 dark:bg-neutral-900/70 text-neutral-700 dark:text-neutral-200 border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-900",
                            ].join(" ")}
                          >
                            <img
                              src={ROLE_ICONS[t]}
                              alt={`${t} role icon`}
                              className="w-4 h-4 object-contain"
                            />
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
                            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 px-10 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                          <svg
                            viewBox="0 0 24 24"
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500 dark:text-neutral-400"
                          >
                            <path
                              fill="currentColor"
                              d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16a6.471 6.471 0 004.23-1.57l.27.28v.79L20 21.5 21.5 20 15.5 14m-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                            />
                          </svg>
                        </div>
                        <select
                          value={sort}
                          onChange={(e) => setSort(e.target.value as any)}
                          className="rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                          aria-label="Sort champions by"
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
                    {!loading &&
                      !error &&
                      list.map((c: any) => (
                        <ChampionTile
                          key={c.id}
                          champ={c}
                          onShowDetails={() => handleShowChampionDetails(c.id)}
                          onToggleFavorite={() => toggleFavorite(c.id)}
                          isFavorite={favorites.includes(c.id)}
                        />
                      ))}
                  </div>
                </div>
              )
            }
          />

          {/* CHAMPION DETAILS (reads :championId param) */}
          <Route
            path="/champion/:championId"
            element={<ChampionRoute champions={champions?.data ?? {}} onShowGrid={handleShowGrid} />}
          />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={
              status === "authenticated" && user ? (
                <UserProfile
                  user={user}
                  champions={champions?.data ?? {}}
                  favorites={favorites}
                  onShowChampionDetails={handleShowChampionDetails}
                  onShowGrid={handleShowGrid}
                  onShowHero={handleShowHero}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Layout>

      {favoriteError && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in">
          {favoriteError}
        </div>
      )}
    </>
  );
}

/* Route wrapper for champion details to read the param and render your existing ChampionView */
function ChampionRoute({ champions, onShowGrid }: { champions: any; onShowGrid: () => void }) {
  const { championId } = useParams<{ championId: string }>();
  const champion = championId ? champions[championId] : null;
  // preserve original back handler: call onShowGrid (it already performs auth-checks and navigation)
  return <ChampionView champion={champion} onShowGrid={onShowGrid} />;
}

/* ChampionTile left intact: uses provided callbacks (onShowDetails, onToggleFavorite) */
function ChampionTile({ champ, onShowDetails, onToggleFavorite, isFavorite }: { champ: any; onShowDetails: () => void; onToggleFavorite: () => void; isFavorite: boolean; }) {
  const [open, setOpen] = useState(false);
  const iconUrl = `${API_URI}/images/${champ.id}.png`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-200/60 dark:bg-neutral-900/60 outline-none transition hover:border-sky-600 focus-visible:ring-2 focus-visible:ring-sky-500"
        aria-label={champ.name}
      >
        <img
          src={iconUrl}
          alt={champ.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
          <div className="text-[11px] sm:text-xs font-semibold tracking-wide text-white text-center drop-shadow">
            {champ.name}
          </div>
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div className="w-full max-w-lg rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 p-4 border-b border-neutral-200 dark:border-neutral-800">
              <img src={iconUrl} alt="" className="h-12 w-12 rounded-lg" />
              <div>
                <div className="text-lg font-bold leading-tight">{champ.name}</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 -mt-0.5">{champ.title}</div>
              </div>
              <div className="ml-auto flex gap-2">
                {(champ.tags || []).map((t: string) => (
                  <span key={t} className="rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800 px-2 py-1 text-xs text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    {TAG_ICONS[t] && (
                      <img
                        src={TAG_ICONS[t]}
                        alt={`${t} icon`}
                        className="w-3 h-3 object-contain"
                      />
                    )}
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-neutral-600 dark:text-neutral-300">Info</h3>
                <ul className="space-y-1 text-sm">
                  {champ.info && Object.entries(champ.info).map(([k, v]) => (
                    <li key={k} className="flex justify-between gap-2"><span className="text-neutral-500 dark:text-neutral-400">{k}</span><span>{String(v)}</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-neutral-600 dark:text-neutral-300">Base Stats</h3>
                <ul className="max-h-44 overflow-auto pr-1 space-y-1 text-sm">
                  {champ.stats && Object.entries(champ.stats).map(([k, v]) => (
                    <li key={k} className="flex justify-between gap-2"><span className="text-neutral-500 dark:text-neutral-400">{k}</span><span>{String(v)}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 border-t border-neutral-200 dark:border-neutral-800">
              <button onClick={onToggleFavorite}
                className={["rounded-xl border px-4 py-2 text-sm font-semibold flex items-center gap-2 transition",
                  isFavorite
                    ? "bg-yellow-400 text-neutral-900 border-yellow-500 shadow-inner hover:bg-yellow-500"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                ].join(" ")}
              >
                <span className={isFavorite ? "text-lg" : "text-lg opacity-70"}>
                  {isFavorite ? "★" : "☆"}
                </span>
                {isFavorite ? "Favorite" : "Favorite"}
              </button>

              <div className="flex gap-2">
                <button onClick={() => setOpen(false)} className="rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100">Close</button>
                <button onClick={() => { setOpen(false); onShowDetails(); }} className="rounded-xl border border-transparent bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600">View Details</button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SkeletonGrid() {
  return (
    <>
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} className="aspect-square rounded-xl bg-neutral-200/60 dark:bg-neutral-900/60 border border-neutral-300 dark:border-neutral-800 animate-pulse" />
      ))}
    </>
  );
}
