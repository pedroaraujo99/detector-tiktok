const { chromium } = require("playwright");
const fs = require("fs");

const { analisar } = require("./core/analyzer");

const {
  normalizarLink,
  extrairUsuario,
  capturarTexto
} = require("./core/scraper");

const {
  analisarPerfilCompleto
} = require("./core/profileAnalyzer");

const { capturarPerfil } = require("./core/captureService");

(async () => {
  const browser = await chromium.launch({ headless: false });

  let resultados = [];
  if (fs.existsSync("resultados.json")) {
    try {
      resultados = JSON.parse(fs.readFileSync("resultados.json"));
    } catch {}
  }

  const vistos = new Set(resultados.map(r => r.link));
  const usuariosVistos = new Set();

  const page = await browser.newPage();
  await page.goto("https://www.tiktok.com/search?q=plataforma");

  console.log("🛑 Resolva captcha/login...");
  await page.waitForTimeout(30000);

  // scroll forte
  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel(0, 4000);
    await page.waitForTimeout(1200);
  }

  await page.waitForTimeout(5000);

  const links = await page.$$eval("a", els =>
    els.map(el => el.href)
       .filter(h => h.includes("/video/") && h.includes("@"))
  );

  let coletados = 0;

  for (let link of links) {
    if (coletados >= 30) break;

    const vp = await browser.newPage();
    await vp.goto(link);

    console.log("🛑 Resolva captcha se aparecer...");
    await vp.waitForTimeout(20000);

    const texto = await capturarTexto(vp);
    const linksPagina = await vp.$$eval("a", els => els.map(e => e.href));

    let score = analisar(texto);

    // EXEMPLOS
    if (texto.includes("pix")) score += 2;
    if (texto.includes("pix na hora")) score += 3;
    if (texto.includes("retirada imediata")) score += 3;

    // LINKS
    for (let l of linksPagina) {
      l = l.toLowerCase();

      if (
        l.includes("bet") ||
        l.includes("casino") ||
        l.includes("cassino") ||
        l.includes("blaze") ||
        l.includes("stake") ||
        l.includes("slot")
      ) {
        score += 4;
      }

      if (
        l.includes("bit.ly") ||
        l.includes("cutt.ly") ||
        l.includes("tinyurl")
      ) {
        score += 3;
      }
    }

    const usuario = extrairUsuario(link);

    if (!usuario) {
      await vp.close();
      continue;
    }

    if (usuariosVistos.has(usuario)) {
      await vp.close();
      continue;
    }

    usuariosVistos.add(usuario);

    const limpo = normalizarLink(link);

    if (!vistos.has(limpo)) {
      resultados.push({ usuario, link: limpo, score });
      vistos.add(limpo);
      coletados++;

      if (score >= 5) {
        console.log("⚠️ SUSPEITO:", link);

        await capturarPerfil(browser, usuario);

        const perfil = await analisarPerfilCompleto(
          browser,
          `https://www.tiktok.com/@${usuario}`
        );

        if (perfil.taxa >= 0.6 || perfil.suspeitos >= 3) {
          console.log("🚨 PERFIL ALTAMENTE SUSPEITO:", usuario);
        }

      } else {
        console.log("Normal:", link);
      }
    }

    await vp.close();
  }

  fs.writeFileSync("resultados.json", JSON.stringify(resultados.slice(0,30), null, 2));

  console.log("✅ Finalizado com 30 resultados");

  await browser.close();
})();