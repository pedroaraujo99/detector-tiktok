const { analisar } = require("./analyzer");

const { capturarTexto } = require("./scraper");

async function analisarPerfilCompleto(browser, perfilUrl) {
  const page = await browser.newPage();
  await page.goto(perfilUrl);
  await page.waitForTimeout(30000);

  const usuario = perfilUrl.match(/@([^\/]+)/)?.[1];
  if(usuario) await
  capturarPerfil(browser, usuario);

  const videos = await page.$$eval("a", els =>
    els.map(el => el.href)
       .filter(h => h.includes("/video/"))
       .slice(0, 5)
  );

  let suspeitos = 0;
  let total = 0;

  for (let v of videos) {
    const vp = await browser.newPage();
    await vp.goto(v);
    await vp.waitForTimeout(3000);

    const texto = await capturarTexto(vp);
    const score = analisar(texto);

    if (score >= 5) suspeitos++;
    total++;

    await vp.close();
  }

  await page.close();

  return {
    suspeitos,
    total,
    taxa: total > 0 ? suspeitos / total : 0
  };
}

module.exports = { analisarPerfilCompleto };