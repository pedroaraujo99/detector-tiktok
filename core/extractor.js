async function extrairDados(page, url) {

  await page.goto(url);

  await page.waitForTimeout(5000);

  // TEXTO TOTAL
  const texto = await page.evaluate(() => {

    return document.body.innerText;

  });

  // LINKS
  const links = await page.$$eval("a", els =>
    els.map(e => e.href)
  );

  // HASHTAGS
  const hashtags =
    texto.match(/#[\wà-úÀ-Ú_]+/g) || [];

  // USUARIO
  const usuarioMatch =
    url.match(/@([^\/]+)/);

  const usuario =
    usuarioMatch ? usuarioMatch[1] : null;

  return {

    usuario,

    url,

    legenda: texto.slice(0, 2000),

    hashtags,

    linksExternos: links.filter(l =>
      l.includes("bit.ly") ||
      l.includes("telegram") ||
      l.includes("wa.me") ||
      l.includes("casino") ||
      l.includes("bet")
    )

  };

}

module.exports = {
  extrairDados
};