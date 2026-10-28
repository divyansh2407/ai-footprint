import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, "../data");
const historyFile = path.join(dataDir, "history.json");

async function ensureFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try { await fs.access(historyFile); }
  catch { await fs.writeFile(historyFile, "[]", "utf8"); }
}
export async function getHistory() {
  await ensureFile();
  return JSON.parse(await fs.readFile(historyFile, "utf8"));
}
export async function saveHistory(item) {
  const history = await getHistory();
  history.unshift(item);
  await fs.writeFile(historyFile, JSON.stringify(history.slice(0, 100), null, 2), "utf8");
  return item;
}
export async function clearHistory() {
  await ensureFile();
  await fs.writeFile(historyFile, "[]", "utf8");
}
