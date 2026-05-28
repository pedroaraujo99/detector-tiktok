function analisar(texto) {

  let score = 0;

  const t = texto.toLowerCase();

  // PALAVRAS SUSPEITAS
  const palavras = [
    "plataforma",
    "ganhe dinheiro",
    "renda extra",
    "pix",
    "saque",
    "aposta",
    "cassino",
    "blaze",
    "stake",
    "tigrinho",
    "roleta",
    "bit.ly",
    "cutt.ly",
    "tinyurl",
    "bet",
    "slot",
  ];

  for (let p of palavras) {

    if (t.includes(p)) {

      score += 3;

    }

  }

  // COMBINAÇÕES COMUNS
  if (
    t.includes("ganhe") &&
    t.includes("dinheiro")
  ) {

    score += 5;

  }

  // FRASES COMUNS
  if (t.includes("plataforma chinesa")) score += 6;

  if (t.includes("pix na hora")) score += 5;

  if (t.includes("retirada imediata")) score += 5;

  return score;

}

module.exports = {
  analisar
};