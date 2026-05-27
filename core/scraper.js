function normalizarLink(url) {
  return url.split("?")[0];
}

function extrairUsuario(url) {
  const match = url.match(/@([^\/]+)/);
  return match ? match[1] : null;
}

async function capturarTexto(page) {
  return await page.evaluate(() => {
    const body = document.body.innerText || "";

    const spans = Array.from(document.querySelectorAll("span"))
      .map(el => el.innerText);

    const divs = Array.from(document.querySelectorAll("div"))
      .map(el => el.innerText);

    return body + " " + spans.join(" ") + " " + divs.join(" ");
  });
}

module.exports = {
  normalizarLink,
  extrairUsuario,
  capturarTexto
};