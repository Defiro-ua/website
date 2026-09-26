// Encrypts the team-area content for private.html.
//
//   DEFIRO_PASSWORD="…" node tools/encrypt-private.mjs [source.html]
//
// Source defaults to private/team-area.html (git-ignored). Output: assets/private.enc.json.
// Uses PBKDF2-SHA256 + AES-256-GCM, matching the Web Crypto code in private.html.
import { readFileSync, writeFileSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(root, process.argv[2] || "private/team-area.html");
const out = resolve(root, "assets/private.enc.json");
const password = process.env.DEFIRO_PASSWORD;
if (!password || password.length < 12) {
  console.error("Set DEFIRO_PASSWORD (at least 12 characters).");
  process.exit(1);
}

const iter = 600000;
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: iter, hash: "SHA-256" },
  base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(readFileSync(src, "utf8")));

const b64 = (u) => Buffer.from(u).toString("base64");
writeFileSync(out, JSON.stringify({ v: 1, iter, salt: b64(salt), iv: b64(iv), data: b64(new Uint8Array(data)) }) + "\n");
console.log(`Encrypted ${src} -> ${out}`);
