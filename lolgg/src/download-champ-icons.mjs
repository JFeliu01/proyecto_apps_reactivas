import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import os from "os";


// Este script lo sirve para descargar los iconos de los campeones xd
const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v = true] = a.startsWith("--") ? a.slice(2).split("=") : [a, true];
    return [k, v];
  })
);

const LOCALE = (args.locale || "en_US").trim();
const OUTDIR = (args.out || "public/champion-icons").trim();
const CONCURRENCY = Number(args.c || args.concurrency || 8);

async function getLatestVersion() {
  const r = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
  if (!r.ok) throw new Error(`versions.json failed: ${r.status}`);
  const versions = await r.json();
  return versions[0];
}

async function getChampionList(version, locale) {
  const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${locale}/champion.json`;
  const r = await fetch(url);
  if (!r.ok) {
    throw new Error(`champion.json failed (${locale}) ${version}: ${r.status}`);
  }
  const json = await r.json();
  return Object.values(json.data).map(ch => ch.id); // ["Aatrox","Ahri",...]
}

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

async function downloadFile(url, destPath) {
  // skip if already exists and > 0 bytes
  try {
    const stat = await fsp.stat(destPath);
    if (stat.size > 0) return "skipped";
  } catch {}
  const r = await fetch(url);
  if (!r.ok) throw new Error(`GET ${url} -> ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  await fsp.writeFile(destPath, buf);
  return "downloaded";
}

async function withConcurrency(limit, items, worker) {
  const q = [...items];
  let active = 0, done = 0;
  const results = [];
  return await new Promise((resolve, reject) => {
    const next = () => {
      while (active < limit && q.length) {
        const idx = items.length - q.length;
        const item = q.shift();
        active++;
        worker(item, idx)
          .then(res => results[idx] = res)
          .catch(reject)
          .finally(() => {
            active--; done++;
            process.stdout.write(`\r${done}/${items.length} ${" ".repeat(10)}`);
            next();
          });
      }
      if (active === 0 && q.length === 0) resolve(results);
    };
    next();
  });
}

(async () => {
  try {
    const version = (args.version || await getLatestVersion()).trim();
    console.log(`Using version: ${version}, locale: ${LOCALE}`);
    const ids = await getChampionList(version, LOCALE);
    console.log(`Found ${ids.length} champions`);

    await ensureDir(OUTDIR);

    const base = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/`;
    await withConcurrency(CONCURRENCY, ids, async (id) => {
      const url = `${base}${id}.png`;
      const dest = path.join(OUTDIR, `${id}.png`);
      let attempt = 0;
      while (attempt < 3) {
        try {
          const res = await downloadFile(url, dest);
          return { id, res };
        } catch (e) {
          attempt++;
          if (attempt >= 3) throw new Error(`Failed ${id}: ${e.message}`);
          await new Promise(r => setTimeout(r, 500 * attempt));
        }
      }
    }); 
    console.log("\nAll done.");
    } catch (e) {
    console.error(e);
  }
    process.exit(0);
})();