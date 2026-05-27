const { analisar } = require("./core/analyzer");

const {
  normalizarLink,
  extrairUsuario
} = require("./core/scraper");

const resultado = analisar("ganhe dinheiro com plataforma");

console.log("SCORE:", resultado);

console.log(normalizarLink("https://teste.com/video?id=123"));

console.log(extrairUsuario("https://www.tiktok.com/@pedro/video/123"));