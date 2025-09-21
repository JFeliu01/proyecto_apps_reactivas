import React from 'react';
// Importar iconos de subroles
import FighterIcon from './assets/Fighter_icon.png';

// Mapeo de iconos de tags
const TAG_ICONS: Record<string, string> = {
  Fighter: FighterIcon,
};

interface AatroxViewProps {
  champions: any;
  onShowGrid: () => void;
}

const AatroxView: React.FC<AatroxViewProps> = ({ champions, onShowGrid }) => {
  // Obtener datos de Aatrox
  const aatrox = champions?.data?.Aatrox;
  
  // Esto va a servir a futuro cuando si usemos la API
  if (!aatrox) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="text-center">
          <p className="text-neutral-500 dark:text-neutral-400">Cargando información de Aatrox...</p>
        </div>
      </div>
    );
  }

  const iconUrl = `/backend/champion-icons/${aatrox.id}.png`;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      {/* Botón para volver al grid */}
      <button
        onClick={onShowGrid}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver al listado de campeones
      </button>

      {/* Header con información básica */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-lg mb-6">
        <div className="p-6">
          <div className="flex items-center gap-6 mb-6">
            <img 
              src={iconUrl} 
              alt={aatrox.name}
              className="w-24 h-24 rounded-xl shadow-md"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                {aatrox.name}
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-3">
                {aatrox.title}
              </p>
              <div className="flex gap-2">
                {(aatrox.tags || []).map((tag: string) => (
                  <span 
                    key={tag} 
                    className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700"
                  >
                    {TAG_ICONS[tag] && (
                      <img 
                        src={TAG_ICONS[tag]} 
                        alt={`${tag} icon`} 
                        className="w-4 h-4 object-contain"
                      />
                    )}
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Descripción */}
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Lore</h3>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {aatrox.blurb}
            </p>
          </div>
        </div>
      </div>

      {/* Stats detalladas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info general */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
            Información General
          </h3>
          <div className="space-y-3">
            {aatrox.info && Object.entries(aatrox.info).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-400 capitalize">
                  {key}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-sm ${
                          i < (value as number) 
                            ? 'bg-sky-500' 
                            : 'bg-neutral-300 dark:bg-neutral-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-neutral-900 dark:text-white font-medium w-6">
                    {String(value)}
                  </span>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Resource Type
                </span>
                <span className="text-neutral-900 dark:text-white font-medium">
                  {aatrox.partype || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats base */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
            Estadísticas Base
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {aatrox.stats && Object.entries(aatrox.stats).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-1">
                <span className="text-neutral-600 dark:text-neutral-400 text-sm">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
                <span className="text-neutral-900 dark:text-white font-medium">
                  {typeof value === 'number' ? value.toFixed(1) : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AatroxView;