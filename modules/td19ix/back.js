/* kuruyemis-terazi — Kuruyemiş Terazi — kavanoz raf ızgarası ve kadranlı tartı paneli (16 Kas 2026 · mcp:webmaker/20261116-181132-t332 · D17).
   Solda kavanoz kapaklı ürün karoları (ikon, ad, köken, kg fiyatı, rozet) radyo olarak seçilir; sağda yapışkan tartı paneli: yarım daire kadran ve yaylanan ibre, seçili ürün, gram ve canlı tutar, gram sürgüsü ve hazır gram çipleri (100 · 250 · 500 · 1000). Kayıt alanları: `fiyat` (kg), `rozet`. JS yokken tartı gizli; her karoda ilk üç gramın hazır fiyatı yazılı.
   Üretici: scripts/modul-fabrika (aile module) — elle düzenleme yerine tanımı değiştirip yeniden üret.
   Veri: desing: ust · baslik · metin · img · img2 · cta_ad/cta_url · cta2_ad/cta2_url; data (maddeler): [{ ikon?, baslik, metin?, url? }] — metinler dil sözlüğü. */
const P = "modulex-kuruyemis-terazi";
const IMG_KOK = `/img/${json.id}/`;
/* --- ortak ön ek (scripts/modul-fabrika/on-ek.js) — dil · güvenlik · sayı yardımcıları --- */
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) { /* alt satır */ } }
  return String(v[json.lang] ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const medyaUrl = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|file):/i.test(s)) return "";
  if (/^data:/i.test(s)) return /^data:(image|video|audio)\//i.test(s) ? s : "";
  if (s.startsWith("/") || /^https?:\/\//i.test(s)) return s;
  return `${IMG_KOK}${s}`;
};
const href = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|data):/i.test(s)) return "";
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s)) return s;
  return wxLangInternalHref(s);
};
const dogru = (v, d) => (v === undefined || v === null || v === "") ? d : !(v === false || v === "false" || v === 0 || v === "0");
const ikonAd = (v) => String(v ?? "").trim().replace(/[^a-z0-9_]/gi, "");
const satirlar = (s) => esc(s).replace(/\r?\n/g, "<br />");
/* ilk dolu alan: yeni ad önce, eski kuşak şablonun adı yedek (G6 yalnız path değiştirerek takas eder) */
const ilk = (o, ks) => {
  for (const k of ks) {
    const v = o == null ? undefined : o[k];
    if (v == null || v === "") continue;
    if (typeof v === "object" && !Array.isArray(v) && !Object.keys(v).length) continue;
    return v;
  }
  return "";
};
const metinAl = (o, ks) => pick(ilk(o, ks)).trim();
const { desing: des = {} } = json;
const setting = webmakerdata?.setting ?? {};
const veri = Array.isArray(json.data) ? json.data : [];
const dil = String(json.lang || "");
const sayiBicim = (v, ondalik) => {
  try { return new Intl.NumberFormat(dil || undefined, { minimumFractionDigits: ondalik, maximumFractionDigits: ondalik }).format(v); } catch (e) { return String(v); }
};
const ikonH = (ad, sinif) => (ad ? `<span class="${sinif} material-symbols-outlined" aria-hidden="true">${ad}</span>` : "");
const no = (i) => String(i + 1).padStart(2, "0");
const ctaHtml = () => {
  const a1 = metinAl(des, ["cta_ad", "button"]); const u1 = href(ilk(des, ["cta_url", "buttonurl", "url"]));
  const a2 = metinAl(des, ["cta2_ad"]); const u2 = href(ilk(des, ["cta2_url"]));
  const d = (a, u, ek) => (a && u ? `<a class="${P}-dugme${ek}" href="${esc(u)}">${esc(a)}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "");
  const ic = d(a1, u1, "") + d(a2, u2, ` ${P}-dugme--ikincil`);
  return ic ? `<div class="${P}-cta">${ic}</div>` : "";
};
const basHtml = (B, ek) => {
  if (!B.ust && !B.baslik && !B.metin && !ek) return "";
  return `<header class="${P}-bas">`
    + (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "")
    + (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "")
    + (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "")
    + (ek || "")
    + "</header>";
};
/* --- aile: module --- */
const yeniMadde = veri.map((o) => ({
  ikon: ikonAd(ilk(o, ["ikon", "icon"])), baslik: metinAl(o, ["baslik", "name", "title"]),
  metin: metinAl(o, ["metin", "text", "description", "spot"]), url: href(ilk(o, ["url", "link"])),
})).filter((k) => k.baslik);
/* module-1 eski şeması: name2/spot2/icon2 … name4 → madde */
const eskiMadde = [2, 3, 4].map((n) => ({ ikon: ikonAd(des["icon" + n]), baslik: metinAl(des, ["name" + n]), metin: metinAl(des, ["spot" + n]), url: "" })).filter((k) => k.baslik);
const kayitlar = yeniMadde.length ? yeniMadde : eskiMadde;
const G1 = medyaUrl(ilk(des, ["img", "image"]));
const G2 = medyaUrl(ilk(des, ["img2", "image2"]));
const gH = (src, s, w, h) => (src ? `<img class="${P}-${s}" src="${esc(src)}" alt="" width="${w || 1200}" height="${h || 900}" loading="lazy" decoding="async" />` : "");
const ustH = (B) => (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "");
const basH = (B) => (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "");
const metH = (B) => (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "");
const listeH = (ic) => (ic ? `<ul class="${P}-maddeler" role="list">${ic}</ul>` : "");
const maddeVar = (k, i) => `<li class="${P}-madde">${ikonH(k.ikon || "check_circle", `${P}-mikon`)}<div class="${P}-myazi"><h3 class="${P}-mbaslik">${k.url ? `<a class="${P}-bag" href="${esc(k.url)}">${esc(k.baslik)}</a>` : esc(k.baslik)}</h3>${k.metin ? `<p class="${P}-mmetin">${satirlar(k.metin)}</p>` : ""}</div></li>`;
/* --- modül: kuruyemis-terazi --- */
const kart = () => "";
const sar = (ic, A, B) => {
    const R = yeniMadde.length ? veri.filter((o) => metinAl(o, ["baslik", "name", "title"])) : [];
    const x = (i, ks) => metinAl(R[i] || {}, ks);
    const sy = (i, ks) => {
      const v = ilk(R[i] || {}, ks);
      if (typeof v === "number") return v;
      let t = pick(v).replace(/[^\d.,]/g, "");
      t = /,\d{1,2}$/.test(t) ? t.replace(/\./g, "").replace(",", ".") : t.replace(/[.,](?=\d{3}(\D|$))/g, "").replace(",", ".");
      const n = t ? Number(t) : NaN;
      return Number.isFinite(n) ? n : NaN;
    };
    const PB = /^[A-Za-z]{3}$/.test(metinAl(des, ["paraBirimi"])) ? metinAl(des, ["paraBirimi"]).toUpperCase() : "";
    const para = (v) => { try { return new Intl.NumberFormat(dil || undefined, PB ? { style: "currency", currency: PB, maximumFractionDigits: v % 1 ? 2 : 0 } : { maximumFractionDigits: 2 }).format(v); } catch (e) { return String(v); } };
    let GR = (Array.isArray(des.gramlar) ? des.gramlar : String(pick(des.gramlar) || "").split(",")).map(Number).filter((n) => Number.isFinite(n) && n > 0);
    if (!GR.length) GR = [100, 250, 500, 1000];
    GR = [...new Set(GR)].sort((a, b) => a - b).slice(0, 6);
    const BR = metinAl(des, ["birimAd"]) || "g";
    const KG = metinAl(des, ["kgAd"]);
    const U = A.map((k, i) => ({ k, i, f: sy(i, ["fiyat", "price", "kg"]), rz: x(i, ["rozet", "badge"]) }));
    const ilkF = U.find((u) => Number.isFinite(u.f));
    const kavanoz = (u) => {
      const fiyatli = Number.isFinite(u.f);
      const ic2 = `<span class="${P}-kapak" aria-hidden="true"></span>${ikonH(u.k.ikon || "grain", `${P}-kikon`)}<span class="${P}-kad">${esc(u.k.baslik)}</span>${u.k.metin ? `<span class="${P}-kkoken">${satirlar(u.k.metin)}</span>` : ""}${fiyatli ? `<span class="${P}-kfiyat"><bdi>${esc(para(u.f))}</bdi>${KG ? ` <small>${esc(KG)}</small>` : ""}</span><span class="${P}-khazir">${GR.slice(0, 3).map((g) => `<span><bdi>${sayiBicim(g, 0)} ${esc(BR)}</bdi> <bdi>${esc(para((u.f * g) / 1000))}</bdi></span>`).join("")}</span>` : ""}${u.rz ? `<span class="${P}-krozet">${esc(u.rz)}</span>` : ""}`;
      return `<li class="${P}-kavanoz">${fiyatli ? `<label class="${P}-ketiket"><input class="${P}-kradyo" type="radio" name="urun" value="${u.i}" data-ad="${esc(u.k.baslik)}" data-kg="${u.f}"${u === ilkF ? " checked" : ""} />${ic2}</label>` : `<div class="${P}-ketiket">${ic2}</div>`}</li>`;
    };
    const SN = metinAl(des, ["sonucAd"]);
    const TN = metinAl(des, ["tartiNot"]);
    const enc = Math.max(1000, GR[GR.length - 1]);
    const ilkG = GR[Math.min(1, GR.length - 1)];
    const panel = ilkF ? `<div class="${P}-terazi" data-tpanel hidden><div class="${P}-kadran" aria-hidden="true"><span class="${P}-ibre" data-ibre style="--fb-aci: ${(((ilkG / enc) * 180) - 90).toFixed(1)}deg"></span><span class="${P}-gobek"></span></div><p class="${P}-tad" data-tad></p><p class="${P}-tgram" data-tgram></p><p class="${P}-tset">${esc(SN || "@total@")}</p><p class="${P}-ttutar" data-ttutar aria-live="polite">—</p><label class="${P}-sur"><span class="${P}-gizli">${esc(metinAl(des, ["gramAd"]) || BR)}</span><input class="${P}-surgu" type="range" min="50" max="${enc}" step="50" value="${ilkG}" data-gram /></label><div class="${P}-gcipler">${GR.map((g) => `<label class="${P}-gcip"><input class="${P}-gradyo" type="radio" name="gram" value="${g}" data-gcip /><span><bdi>${sayiBicim(g, 0)} ${esc(BR)}</bdi></span></label>`).join("")}</div>${TN ? `<p class="${P}-tnot">${esc(TN)}</p>` : ""}</div>` : "";
    const UA = metinAl(des, ["urunAd"]);
    return `<div class="${P}-giris">${ustH(B)}${basH(B)}${metH(B)}</div><form class="${P}-dukkan" data-terazi data-para="${PB}" data-birim="${esc(BR)}"><fieldset class="${P}-raf"><legend class="${P}-gizli">${esc(UA || B.baslik)}</legend><ul class="${P}-kavanozlar" role="list">${U.map(kavanoz).join("")}</ul></fieldset>${panel}</form>${ctaHtml()}`;
  };
const B = { ust: metinAl(des, ["ust","title","badge"]), baslik: metinAl(des, ["baslik","name"]), metin: metinAl(des, ["metin","description"]) };
/* veri yoksa gövde hiç kurulmaz (sarmalayıcı boş listeye dokunmaz) */
const BOS = !B.baslik && !B.metin;
const govde = BOS ? "" : sar(kayitlar.map((k, i) => kart(k, i, kayitlar.length, kayitlar)).join(""), kayitlar, B);
const bas = "";
const sinif = (bas || B.ust || B.baslik || B.metin ? "" : ` ${P}--bassiz`);
html = html
  .replaceAll("{{fbsinif}}", () => sinif)
  .replaceAll("{{fbetiket}}", () => (B.baslik ? `aria-labelledby="${P}-{{id}}-b"` : ""))
  .replaceAll("{{fbbas}}", () => bas)
  .replaceAll("{{fbgovde}}", () => govde);
if (BOS) html = "";
