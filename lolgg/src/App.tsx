import React, { useMemo, useState } from "react";
import Champion from "./Champion";

// Cargar el JSON desde el backend usando fetch

// Main App component

export default function App() {
  const [champions, setChampions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    fetch("/backend/champion.json")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar champion.json");
        return res.json();
      })
      .then((data) => {
        setChampions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);



  if (loading) {
    return <div className="p-8 text-center">Cargando datos de campeones...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Op.gg fruna</h1>
        </header>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {champions?.data &&
            Object.values(champions.data).map((champ: any) => (
              <div key={champ.id} className="bg-white rounded-xl shadow p-3 flex flex-col items-center cursor-pointer hover:shadow-lg transition">
                <Champion champ={champ} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}


function guessLocaleFromPath(moduleUrl) {
  try {
    // naive: look for ".<locale>." in the import path
    const lower = (moduleUrl || "").toLowerCase();
    const known = [
      "en_us","en_gb","es_mx","es_ar","es_es","pt_br","fr_fr","de_de","it_it","ja_jp","ko_kr","zh_cn","zh_tw","pl_pl","ru_ru","tr_tr","vi_vn","th_th"
    ];
    for (const loc of known) {
      if (lower.includes(loc)) return loc.replace("_", "_").toUpperCase();
    }
  } catch {}
  return null;
}
