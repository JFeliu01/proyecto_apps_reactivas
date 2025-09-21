import fs from 'fs';
import path from 'path';

type ChampionImage = { full: string };
type Champion = {
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  info: unknown;
  tags: string[];
  partype: string;
  stats: unknown;
  image?: ChampionImage;
  version: string;
};

type ChampionFile = {
  data: Record<string, Champion>;
};

function generateDb(): void {
  const championJsonPath = path.resolve(__dirname, '..', 'champion.json');
  const outPath = path.resolve(__dirname, '..', 'db.json');

  const raw = fs.readFileSync(championJsonPath, 'utf-8');
  const parsed = JSON.parse(raw) as ChampionFile;

  const champions = Object.values(parsed.data || {}).map((champ) => {
    const iconFile = champ.image?.full || `${champ.id}.png`;
    return {
      id: champ.id,
      key: champ.key,
      name: champ.name,
      title: champ.title,
      blurb: champ.blurb,
      info: champ.info,
      tags: champ.tags,
      partype: champ.partype,
      stats: champ.stats,
      icon: `/icons/${iconFile}`,
      image: champ.image,
      version: champ.version,
    };
  });

  const db = { champions };
  fs.writeFileSync(outPath, JSON.stringify(db, null, 2));
  // eslint-disable-next-line no-console
  console.log(`Generated ${outPath} with ${champions.length} champions.`);
}

generateDb();


