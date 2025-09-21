import React, { useState } from "react";

interface ChampionProps {
  champ: any;
}

const Champion: React.FC<ChampionProps> = ({ champ }) => {
  const [open, setOpen] = useState(false);
  const iconUrl = `/backend/champion-icons/${champ.id}.png`;

  return (
    <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center cursor-pointer hover:shadow-lg transition" onClick={() => setOpen((v) => !v)}>
      <img
        src={iconUrl}
        alt={`${champ.name} icon`}
        width={64}
        height={64}
        className="rounded-lg mb-2"
      />
      <span className="font-semibold text-xs text-center">{champ.name}</span>
      {open && (
        <div className="mt-2 w-full text-xs">
          <div className="font-bold mb-1">{champ.title}</div>
          <div className="flex flex-wrap gap-1 mb-1">
            {champ.tags?.map((t: string) => (
              <span key={t} className="px-2 py-0.5 rounded-full bg-gray-100 border text-xs">{t}</span>
            ))}
          </div>
          <div className="mb-1 text-gray-600">Partype: {champ.partype}</div>
          <div className="mb-1">
            <span className="font-semibold">Info:</span>
            <ul>
              {champ.info && Object.entries(champ.info).map(([k, v]) => (
                <li key={k}>{k}: {v as any}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-semibold">Stats:</span>
            <ul>
              {champ.stats && Object.entries(champ.stats).map(([k, v]) => (
                <li key={k}>{k}: {v as any}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Champion;
