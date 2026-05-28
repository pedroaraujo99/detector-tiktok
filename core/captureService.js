const fs = require("fs");
const path = require("path");

async function capturarPerfil(browser, usuario) {
  const page = await browser.newPage();

  const dir = path.resolve("data", "prints", usuario);

  console.log(" DIR ABSOLUTO:", dir);
  console.log(" __dirname:", __dirname);

  fs.mkdirSync(dir, { recursive: true });

  console.log(" VAI SALVAR PRINT AGORA EM:", dir);

  try {
    await page.goto(`https://www.tiktok.com/@${usuario}`, {
      waitUntil: "domcontentloaded"
    });

    await page.waitForTimeout(5000);

    await page.screenshot({
      path: path.join(dir, "perfil.png"),
      fullPage: true
    });

    console.log(" PRINT SALVO COM SUCESSO");

    await page.close();

  } catch (err) {
    console.log(" ERRO AO TIRAR PRINT:", err.message);
    await page.close();
  }
}

module.exports = { capturarPerfil };