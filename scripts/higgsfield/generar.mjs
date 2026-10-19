#!/usr/bin/env node
/**
 * Lanza un trabajo de generación en la API de Higgsfield y descarga el
 * resultado en el proyecto.
 *
 * ATENCIÓN: cada ejecución consume saldo real de la cuenta de API.
 * Las credenciales se leen de ~/.config/higgsfield/credentials.env; nunca
 * se guardan en este repositorio.
 *
 * Uso:
 *   node scripts/higgsfield/generar.mjs <endpoint> '<input-json>' <destino>
 */
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { homedir } from "node:os";

const { createHiggsfieldClient } = await import(
  `${homedir()}/.claude/tools/higgsfield-api/node_modules/@higgsfield/client/dist/v2/index.js`
);
const { loadCredentials } = await import(
  `${homedir()}/.claude/tools/higgsfield-api/lib/credentials.mjs`
);

const credentials = loadCredentials();
if (!credentials) {
  console.error("ERROR: faltan credenciales de Higgsfield.");
  process.exit(1);
}

const [, , endpoint, inputJson, destino] = process.argv;
if (!endpoint || !inputJson || !destino) {
  console.error("Uso: node scripts/higgsfield/generar.mjs <endpoint> '<input-json>' <destino>");
  process.exit(1);
}

const client = createHiggsfieldClient({ credentials });
console.log(`[higgsfield] endpoint=${endpoint}`);
console.log(`[higgsfield] destino=${destino}`);

const jobSet = await client.subscribe(endpoint, {
  input: JSON.parse(inputJson),
  withPolling: true,
});

/**
 * La API devuelve el resultado en formas distintas según el modelo:
 * `{ video: { url } }`, `{ image: { url } }` o `jobs[].results.raw.url`.
 * Normalizamos las tres.
 */
function urlsDelResultado(resultado) {
  const urls = [];
  const directo = resultado?.video?.url ?? resultado?.image?.url ?? resultado?.raw?.url;
  if (directo) urls.push(directo);
  for (const item of resultado?.images ?? resultado?.videos ?? []) {
    const url = item?.url;
    if (url && !urls.includes(url)) urls.push(url);
  }
  for (const job of resultado?.jobs ?? []) {
    const url = job?.results?.raw?.url ?? job?.video?.url ?? job?.image?.url;
    if (url && !urls.includes(url)) urls.push(url);
  }
  return urls;
}

const urls = urlsDelResultado(jobSet);

if (urls.length === 0) {
  console.error("[higgsfield] sin resultados utilizables:", JSON.stringify(jobSet, null, 2));
  process.exit(1);
}

await mkdir(dirname(destino), { recursive: true });

let n = 0;
for (const url of urls) {
  const salida = n === 0 ? destino : destino.replace(/(\.[^.]+)$/, `-${n}$1`);
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    console.error(`[higgsfield] descarga fallida ${respuesta.status} ${url}`);
    continue;
  }
  await pipeline(Readable.fromWeb(respuesta.body), createWriteStream(salida));
  console.log(`[higgsfield] guardado: ${salida}`);
  console.log(`[higgsfield] url_origen: ${url}`);
  n += 1;
}
console.log(`[higgsfield] OK (${n} archivo(s))`);
