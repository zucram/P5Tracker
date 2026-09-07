import { readFile, writeFile } from 'node:fs/promises';
import { PERSONA_IDS, DLC_PERSONAS } from '../src/p3/fusion.js';
import requests from '../knowledge/p3-reload/requests.json' with { type: 'json' };

// Save validation needs IDs, not the full request, fusion and skill references.
const output = new URL('../src/p3/saveCatalog.json', import.meta.url);
const data = JSON.stringify({ personaIds: PERSONA_IDS, dlcIds: DLC_PERSONAS.map(persona => persona.id), requestIds: requests.entries.map(entry => entry.id) }, null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (await readFile(output, 'utf8') !== data) throw new Error('Reload save catalog is stale. Run npm run build:catalog.');
} else {
  await writeFile(output, data);
}
console.log(`Reload save catalog: ${PERSONA_IDS.length} Personas, ${DLC_PERSONAS.length} DLC IDs, ${requests.entries.length} requests.`);
