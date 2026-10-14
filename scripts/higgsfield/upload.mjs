#!/usr/bin/env node
/**
 * Sube un archivo local al CDN de Higgsfield y devuelve su URL pública.
 *
 * Subir un archivo NO crea un trabajo de generación y no consume saldo:
 * solo deja la imagen accesible para los endpoints image-to-video.
 *
 * Las credenciales se leen de ~/.config/higgsfield/credentials.env y nunca
 * se escriben en este repositorio ni se imprimen.
 *
 * Uso: node scripts/higgsfield/upload.mjs <ruta-imagen>
 */
import { readFileSync } from "node:fs";
import { extname } from "node:path";

import { HiggsfieldClient } from "@higgsfield/client";
import { loadCredentials } from "../../../../../Users/alfredo/.claude/tools/higgsfield-api/lib/credentials.mjs";

const credenciales = loadCredentials();
if (!credenciales) {
  console.error("Faltan credenciales de Higgsfield.");
  process.exit(1);
}

const [keyId, keySecret] = credenciales.split(":");
const ruta = process.argv[2];
if (!ruta) {
  console.error("Uso: node scripts/higgsfield/upload.mjs <ruta-imagen>");
  process.exit(1);
}

const formato = extname(ruta).slice(1).toLowerCase().replace("jpg", "jpeg");
const cliente = new HiggsfieldClient({ apiKey: keyId, apiSecret: keySecret });
const url = await cliente.uploadImage(readFileSync(ruta), formato);
console.log(url);
