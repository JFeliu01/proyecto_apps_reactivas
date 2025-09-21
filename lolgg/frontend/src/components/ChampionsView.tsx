import { useEffect, useState } from 'react';

type Champion = {
  id: string;
  name: string;
  title: string;
  icon: string; // /icons/<file>
  tags: string[];
};

export default function ChampionsView() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        const url = query ? `/api/champions?q=${encodeURIComponent(query)}` : '/api/champions';
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Champion[];
        if (!ignore) setChampions(data);
      } catch (e) {
        if (!ignore) setError((e as Error).message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [query]);

  if (loading) return <p>Loading champions…</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
      <div style={{ gridColumn: '1 / -1', marginBottom: 8 }}>
        <input
          placeholder="Search champions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '100%', padding: '8px 12px' }}
        />
      </div>
      {champions.map((c) => (
        <div key={c.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
          <img src={c.icon} alt={c.name} width={96} height={96} style={{ objectFit: 'contain' }} />
          <div style={{ fontWeight: 600 }}>{c.name}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{c.title}</div>
        </div>
      ))}
    </div>
  );
}


