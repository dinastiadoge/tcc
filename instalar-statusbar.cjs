// Instalador da status line do Claude Code (arquivo único).
// Uso: node instalar-statusbar.cjs
const fs = require("fs"), os = require("os"), path = require("path");

const SCRIPT_B64 =
  "IyEvdXNyL2Jpbi9lbnYgbm9kZQovLyBTdGF0dXMgbGluZSBtaW5pbWFsaXN0YSBkbyBDbGF1ZGUgQ29kZTogbW9kZWxvIMK3IGNv" +
  "bnRleHRvIMK3IGxpbWl0ZSA1aCDCtyBjdXN0byDCtyB0ZW1wbwpsZXQgcmF3ID0gIiI7CnByb2Nlc3Muc3RkaW4uc2V0RW5jb2Rp" +
  "bmcoInV0ZjgiKTsKcHJvY2Vzcy5zdGRpbi5vbigiZGF0YSIsIChjKSA9PiAocmF3ICs9IGMpKTsKcHJvY2Vzcy5zdGRpbi5vbigi" +
  "ZW5kIiwgKCkgPT4gewogIGxldCBkID0ge307CiAgdHJ5IHsgZCA9IEpTT04ucGFyc2UocmF3IHx8ICJ7fSIpOyB9IGNhdGNoIHt9" +
  "CgogIGNvbnN0IHJnYiA9IChyLCBnLCBiKSA9PiAocykgPT4gYFx4MWJbMzg7Mjske3J9OyR7Z307JHtifW0ke3N9XHgxYlswbWA7" +
  "CiAgY29uc3QgZGltID0gcmdiKDExMCwgMTE4LCAxMjkpOwogIGNvbnN0IHNvZnQgPSByZ2IoMjAxLCAyMDksIDIxNyk7CiAgY29u" +
  "c3QgZ3JlZW4gPSByZ2IoMTI2LCAyMDAsIDE1NSk7CiAgY29uc3QgYW1iZXIgPSByZ2IoMjI5LCAxOTIsIDEyMyk7CiAgY29uc3Qg" +
  "cmVkID0gcmdiKDI0MCwgMTEzLCAxMjApOwogIGNvbnN0IHRvbmUgPSAocCkgPT4gKHAgPj0gODUgPyByZWQgOiBwID49IDYwID8g" +
  "YW1iZXIgOiBncmVlbik7CiAgY29uc3Qgc2VwID0gZGltKCIgIMK3ICAiKTsKCiAgY29uc3QgY2xhbXAgPSAobikgPT4gTWF0aC5t" +
  "YXgoMCwgTWF0aC5taW4oMTAwLCBuKSk7CiAgY29uc3QgYmFyID0gKHAsIHcgPSA4KSA9PiB7CiAgICBjb25zdCBmaWxsZWQgPSBN" +
  "YXRoLnJvdW5kKChjbGFtcChwKSAvIDEwMCkgKiB3KTsKICAgIHJldHVybiB0b25lKHApKCLilrAiLnJlcGVhdChmaWxsZWQpKSAr" +
  "IGRpbSgi4paxIi5yZXBlYXQodyAtIGZpbGxlZCkpOwogIH07CgogIGNvbnN0IHBhcnRzID0gW107CgogIC8vIE1vZGVsbwogIGNv" +
  "bnN0IG1vZGVsID0gZC5tb2RlbD8uZGlzcGxheV9uYW1lIHx8IGQubW9kZWw/LmlkOwogIGlmIChtb2RlbCkgcGFydHMucHVzaChz" +
  "b2Z0KG1vZGVsKSk7CgogIC8vIENvbnRleHRvCiAgbGV0IGN0eCA9IGQuY29udGV4dF93aW5kb3c/LnVzZWRfcGVyY2VudGFnZTsK" +
  "ICBpZiAoY3R4ID09IG51bGwgJiYgZC5jb250ZXh0X3dpbmRvdz8uY3VycmVudF91c2FnZSAmJiBkLmNvbnRleHRfd2luZG93Py5j" +
  "b250ZXh0X3dpbmRvd19zaXplKSB7CiAgICBjb25zdCB1ID0gZC5jb250ZXh0X3dpbmRvdy5jdXJyZW50X3VzYWdlOwogICAgY29u" +
  "c3QgdXNlZCA9ICh1LmlucHV0X3Rva2VucyB8fCAwKSArICh1LmNhY2hlX2NyZWF0aW9uX2lucHV0X3Rva2VucyB8fCAwKSArICh1" +
  "LmNhY2hlX3JlYWRfaW5wdXRfdG9rZW5zIHx8IDApOwogICAgY3R4ID0gKHVzZWQgLyBkLmNvbnRleHRfd2luZG93LmNvbnRleHRf" +
  "d2luZG93X3NpemUpICogMTAwOwogIH0KICBpZiAoY3R4ICE9IG51bGwpIHsKICAgIGN0eCA9IE1hdGgucm91bmQoY2xhbXAoY3R4" +
  "KSk7CiAgICBwYXJ0cy5wdXNoKGAke2JhcihjdHgpfSAke3RvbmUoY3R4KShjdHggKyAiJSIpfWApOwogIH0KCiAgLy8gTGltaXRl" +
  "IGRlIHVzbyAoNWgpLCBzZSBhIHZlcnPDo28gZm9ybmVjZXIKICBjb25zdCBmaXZlID0gZC5yYXRlX2xpbWl0cz8uZml2ZV9ob3Vy" +
  "Py51c2VkX3BlcmNlbnRhZ2U7CiAgaWYgKGZpdmUgIT0gbnVsbCkgewogICAgY29uc3QgcCA9IE1hdGgucm91bmQoY2xhbXAoZml2" +
  "ZSkpOwogICAgcGFydHMucHVzaChkaW0oIjVoICIpICsgdG9uZShwKShwICsgIiUiKSk7CiAgfQoKICAvLyBDdXN0bwogIGNvbnN0" +
  "IGNvc3QgPSBkLmNvc3Q/LnRvdGFsX2Nvc3RfdXNkOwogIGlmIChjb3N0ICE9IG51bGwpIHBhcnRzLnB1c2goc29mdCgiJCIgKyBj" +
  "b3N0LnRvRml4ZWQoMikpKTsKCiAgLy8gRHVyYcOnw6NvCiAgY29uc3QgbXMgPSBkLmNvc3Q/LnRvdGFsX2R1cmF0aW9uX21zOwog" +
  "IGlmIChtcyAhPSBudWxsKSB7CiAgICBjb25zdCBtID0gTWF0aC5mbG9vcihtcyAvIDYwMDAwKTsKICAgIHBhcnRzLnB1c2goZGlt" +
  "KG0gPj0gNjAgPyBgJHtNYXRoLmZsb29yKG0gLyA2MCl9aCR7U3RyaW5nKG0gJSA2MCkucGFkU3RhcnQoMiwgIjAiKX1gIDogYCR7" +
  "bX1tYCkpOwogIH0KCiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUocGFydHMuam9pbihzZXApKTsKfSk7Cg==";

const dir = path.join(os.homedir(), ".claude");
const dest = path.join(dir, "statusline.js");
const cfg = path.join(dir, "settings.json");

fs.mkdirSync(dir, { recursive: true });

let settings = {};
if (fs.existsSync(cfg)) {
  try { settings = JSON.parse(fs.readFileSync(cfg, "utf8")); }
  catch { console.error("settings.json existe mas não é JSON válido; abortando sem alterar nada."); process.exit(1); }
}

fs.writeFileSync(dest, Buffer.from(SCRIPT_B64, "base64"));
const posixDest = dest.split(path.sep).join("/");
settings.statusLine = { type: "command", command: `node "${posixDest}"` };
fs.writeFileSync(cfg, JSON.stringify(settings, null, 2) + "\n");

console.log("Pronto! Status line instalada em " + dest + "\nAbra uma nova sessão do Claude Code.");
