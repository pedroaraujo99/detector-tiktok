const { chromium } = require("playwright");
const fs = require("fs");

const { capturarPerfil } = require("./captureService");

async function iniciarAnalise() {

  try {

    const { extrairDados } = require("./extractor");

    const browser = await chromium.launch({
      headless: false
    });

    const page = await browser.newPage();

    // URL DA PESQUISA
    const pesquisa = "plataforma chinesa";

    const url =
      `https://www.tiktok.com/search?q=${encodeURIComponent(pesquisa)}`;

    // ABRIR PESQUISA
    await page.goto(url);

    console.log("Página de pesquisa aberta!");

    // ESPERAR
    await page.waitForTimeout(15000);

    // SCROLL
    for (let i = 0; i < 10; i++) {

      await page.mouse.wheel(0, 4000);

      await page.waitForTimeout(2000);

      console.log("Scroll:", i);

    }

    // PEGAR LINKS
    const links = await page.$$eval("a", els =>
      els.map(el => el.href)
        .filter(h =>
          h.includes("/video/") &&
          h.includes("@")
        )
    );

    console.log("Links encontrados:");
    console.log(links);
    console.log("TOTAL:", links.length);

    const resultados = [];

    // controle para não repetir prints do mesmo usuário
    const usuariosVistos = new Set();

    for (const link of links) {

      console.log("Analisando:", link);

      // extrair usuário do link
      const usuario = link.match(/@([^\/]+)/)?.[1];

      //  PRINT DO PERFIL (apenas 1 vez por usuário)
      if (usuario && !usuariosVistos.has(usuario)) {
        usuariosVistos.add(usuario);

        console.log("📸 Capturando perfil:", usuario);

        await capturarPerfil(browser, usuario);
      }

      // análise normal do link
      const dados = await extrairDados(page, link);

      resultados.push(dados);
    }

    // salvar resultados
    fs.writeFileSync(
      "data/resultados.json",
      JSON.stringify(resultados, null, 2)
    );

    console.log("JSON SALVO!");

    await browser.close();

  } catch (erro) {

    console.log("ERRO:");
    console.log(erro);

  }

}

module.exports = {
  iniciarAnalise
};