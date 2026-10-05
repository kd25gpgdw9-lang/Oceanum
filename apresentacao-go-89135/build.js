// Gera a apresentação "Nata Lisboa" (Gestão das Organizações 89135).
// Coordenadas em px de uma tela 1920×1080 (144 px = 1 polegada); tamanhos de letra em px (÷2 = pt).
// Nomes dos objetos: "A<n>|<efeito>|<rótulo>" = animação automática (passo n),
// "K<n>|<efeito>|<rótulo>" = animação ao clique. O script animate.py converte-os em animações reais.
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "Nata Lisboa — Gestão das Organizações (89135)";
pres.subject = "Caracterização de uma organização";
pres.theme = { headFontFace: "Arial", bodyFontFace: "Arial" };

const I = (v) => v / 144;
const C = {
  bg: "0B1F4D", card: "102A63", card2: "1A3C80", line: "2C4C8C", text: "EAF0FA", muted: "9FB4DB",
  dim: "7F96C2", or: "F5822A", ph: "F9C08F", phLabel: "F5A262", cream: "F3EBDC", quote: "A3410C",
  creamLabel: "6B5D4C", blue2: "1E3F86", ring: "6F8DC7", badge: "C9D6EE",
};
const F = { head: "Arial", body: "Arial", mono: "Courier New", serif: "Times New Roman" };
const TOTAL = 17;

pres.defineSlideMaster({
  title: "CAPA",
  background: { path: "bg.png" },
});
pres.defineSlideMaster({
  title: "CONTEUDO",
  background: { path: "bg.png" },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: I(272), y: I(100), w: I(1520), h: I(96),
      fontFace: F.head, fontSize: 36, bold: true, color: C.text, align: "left", valign: "middle", margin: 0 }, text: "" } },
    { text: { text: "GESTÃO DAS ORGANIZAÇÕES (89135) · NATA LISBOA · FOLHA", options: {
      x: I(820), y: I(990), w: I(860), h: I(34), fontFace: F.mono, fontSize: 10.5, color: C.dim,
      align: "right", valign: "middle", margin: 0, charSpacing: 1 } } },
  ],
  slideNumber: { x: I(1690), y: I(990), w: I(100), h: I(34), fontFace: F.mono, fontSize: 10.5, color: C.or, align: "left", margin: 0 },
});

let cur;
let notes = "";
function slide(master, section) {
  if (section) pres.addSection({ title: section });
  cur = pres.addSlide({ masterName: master, sectionTitle: currentSection });
  return cur;
}
let currentSection = "";
function section(t) { currentSection = t; pres.addSection({ title: t }); }

function T(text, o) {
  cur.addText(text, {
    x: I(o.x), y: I(o.y), w: I(o.w), h: I(o.h),
    fontFace: o.font || F.body, fontSize: (o.size || 28) / 2, color: o.color || C.text,
    bold: !!o.bold, italic: !!o.italic, align: o.align || "left", valign: o.valign || "top",
    margin: o.margin !== undefined ? o.margin : 0, charSpacing: o.cs, isTextBox: true,
    objectName: o.name, paraSpaceAfter: o.psa, lineSpacingMultiple: o.lsm,
    fill: o.fill ? { color: o.fill } : undefined, rotate: o.rot,
    line: o.line ? { color: o.line, width: o.lw || 1, dashType: o.dash || "solid" } : undefined,
    shadow: o.shadow ? { type: "outer", color: "030A1E", blur: 14, offset: 6, angle: 90, opacity: 0.45 } : undefined,
    shape: o.shape, hyperlink: o.link ? { slide: o.link, tooltip: 'Ir para este tema' } : undefined,
  });
}
function R(o) {
  cur.addShape(o.shape || pres.shapes.RECTANGLE, {
    x: I(o.x), y: I(o.y), w: I(o.w), h: I(o.h),
    fill: o.fill ? { color: o.fill, transparency: o.ft || 0 } : { color: "FFFFFF", transparency: 100 },
    line: o.line ? { color: o.line, width: o.lw || 1, dashType: o.dash || "solid" } : { type: "none" },
    objectName: o.name, rotate: o.rot, rectRadius: o.radius, hyperlink: o.link ? { slide: o.link, tooltip: 'Ir para este tema' } : undefined,
    shadow: o.shadow ? { type: "outer", color: "030A1E", blur: 14, offset: 6, angle: 90, opacity: 0.45 } : undefined,
  });
}
const mono = (t, o) => T(t, { font: F.mono, size: 22, color: C.muted, cs: 2, ...o });

// Cabeçalho comum: emblema com letra, sobretítulo e título (placeholder do layout)
function header(letter, eyebrow, titleRuns) {
  R({ x: 128, y: 72, w: 112, h: 112, shape: pres.shapes.OVAL, line: C.badge, lw: 1.5 });
  T(letter, { x: 128, y: 72, w: 112, h: 112, font: F.serif, italic: true, size: 64, color: C.or, align: "center", valign: "middle" });
  mono(eyebrow, { x: 272, y: 70, w: 1500, h: 32 });
  const runs = titleRuns.map((r) => (typeof r === "string" ? { text: r } : { text: r[0], options: { color: C.or } }));
  cur.addText(runs, { placeholder: "title" });
}
// Caixa tracejada para a parte específica (a preencher pelo grupo)
function phBox(x, y, w, h, text, name, label = "NA NATA LISBOA") {
  R({ x, y, w, h, fill: C.or, ft: 93, line: C.or, lw: 1.25, dash: "dash", name });
  mono(label, { x: x + 20, y: y + 16, w: w - 40, h: 30, color: C.phLabel, name });
  T(text, { x: x + 20, y: y + 52, w: w - 40, h: h - 64, size: 25, italic: true, color: C.ph, name });
}
// Post-it creme com citação da entrevista (aparece ao clique)
function quote(x, y, w, h, text, name = "K1|rise|citacao", label = "CITAÇÃO · MÔNICA CARDOSO, GERENTE OPERACIONAL") {
  T([
    { text: text, options: { fontFace: F.serif, italic: true, fontSize: 16, color: C.quote, breakLine: true } },
    { text: label, options: { fontFace: F.mono, fontSize: 10.5, color: C.creamLabel, charSpacing: 2 } },
  ], { x, y, w, h, fill: C.cream, margin: 9, valign: "middle", rot: -0.6, shadow: true, name, psa: 4 });
}
function card(x, y, w, h, name, fill = C.card) { R({ x, y, w, h, fill, line: C.line, lw: 1.25, name }); }
function chip(x, y, t, name, color = C.or) {
  const w = Math.round(t.length * 12.6 + 40);
  T(t, { x, y, w, h: 46, size: 22, font: F.mono, color, align: "center", valign: "middle", line: color, lw: 1, name });
  return w;
}

// ───────────────────────── 1. CAPA
section("Abertura");
slide("CAPA");
R({ x: 1150, y: 170, w: 740, h: 740, shape: pres.shapes.OVAL, line: "3E5C99", lw: 1.5, name: "A1|zoom|aro" });
R({ x: 1250, y: 270, w: 540, h: 540, shape: pres.shapes.OVAL, line: "3E5C99", lw: 1.25, dash: "dash", name: "A1|zoom|aro2" });
R({ x: 1506, y: 256, w: 28, h: 28, shape: pres.shapes.OVAL, fill: C.or, name: "A2|zoom|ponto" });
mono("GESTÃO DAS ORGANIZAÇÕES · 89135", { x: 128, y: 108, w: 1000, h: 36, size: 26, color: C.or, cs: 4 });
mono("ESCALA 1:1 · PLANTA GERAL", { x: 128, y: 176, w: 900, h: 30, color: C.dim });
R({ x: 128, y: 222, w: 960, h: 0, shape: pres.shapes.LINE, line: "4E6CA8", lw: 1.5, name: "A2|wipeL|regua" });
mono("// CARACTERIZAÇÃO DE UMA ORGANIZAÇÃO", { x: 128, y: 300, w: 1000, h: 30, name: "A3|fade|kicker" });
T("NATA\nLISBOA", { x: 128, y: 340, w: 1000, h: 330, size: 160, bold: true, font: F.head, color: "EEF3FB", lsm: 0.9, name: "A3|rise|titulo" });
R({ x: 128, y: 690, w: 960, h: 0, shape: pres.shapes.LINE, line: C.or, lw: 2.5, dash: "dash", name: "A4|wipeL|sublinhado" });
T([{ text: "Entrevista a ", options: {} }, { text: "Mônica Cardoso", options: { bold: true, color: C.text } }, { text: " · Gerente Operacional", options: {} }],
  { x: 128, y: 714, w: 1000, h: 44, size: 30, color: C.muted, name: "A4|fade|subtitulo" });
R({ x: 1300, y: 330, w: 440, h: 380, fill: C.cream, shadow: true, name: "A5|zoom|polaroid" });
R({ x: 1320, y: 350, w: 400, h: 270, fill: C.blue2, name: "A5|zoom|polaroid" });
cur.addImage({ path: "logo.png", x: I(1397), y: I(360), w: I(245), h: I(250), altText: "Logótipo da Nata Lisboa", objectName: "A6|zoom|logo" });
T("Nata Lisboa", { x: 1300, y: 630, w: 440, h: 70, size: 34, italic: true, font: F.serif, color: "33415C", align: "center", valign: "middle", name: "A5|zoom|polaroid" });
R({ x: 128, y: 800, w: 1160, h: 112, fill: "0F2860", line: "34548F", lw: 1.25, name: "A6|rise|ficha" });
[[128, 250, "CURSO", "Contabilidade", false], [378, 170, "GRUPO", "n.º 8", false], [548, 250, "DOCENTE", "Hugo de Almeida", false],
 [798, 490, "INSTITUIÇÃO", "ISCA · Univ. Aveiro · 2026/27", false]].forEach(([x, w, l, v, ph], i) => {
  if (i > 0) R({ x, y: 800, w: 0, h: 112, shape: pres.shapes.LINE, line: "34548F", lw: 1.25, name: "A6|rise|ficha" });
  mono(l, { x: x + 22, y: 818, w: w - 30, h: 30, name: "A6|rise|ficha" });
  T(v, { x: x + 22, y: 856, w: w - 30, h: 40, size: 26, italic: ph, color: ph ? C.ph : C.text, name: "A6|rise|ficha" });
});
cur.addNotes("ABERTURA (≈30 s)\nApresentar a organização: Nata Lisboa — [setor, ano de fundação, localização]. Explicar que a caracterização se baseia na teoria dos Tópicos 1 e 2 e numa entrevista à Mônica Cardoso, gerente operacional.\nSubstituir o quadro azul pelo logótipo ou por uma foto da fachada (Inserir > Imagem).");

// ───────────────────────── 2. GRUPO
slide("CONTEUDO");
header("G", "// QUEM SOMOS", ["O GRUPO"]);
const membros = [["Ryan Magalhães", "137142"], ["Guilherme Barreiro", ""], ["", ""], ["", ""], ["", ""]];
for (let i = 0; i < 5; i++) {
  const x = 128 + i * 338, y = 236, n = `A${i + 1}|rise|membro${i + 1}`;
  card(x, y, 312, 300, n);
  R({ x: x + 28, y: y + 28, w: 120, h: 120, shape: pres.shapes.OVAL, fill: "2A4C93", line: C.or, lw: 1.25, name: n });
  mono("FOTO", { x: x + 28, y: y + 28, w: 120, h: 120, align: "center", valign: "middle", color: "8FB0EE", name: n });
  const [nm, mec] = membros[i];
  T(nm || "[Nome completo]", { x: x + 28, y: y + 172, w: 256, h: 40, size: 28, italic: !nm, bold: !!nm, color: nm ? C.text : C.ph, name: n });
  mono("N.º MEC. " + (mec || "[______]"), { x: x + 28, y: y + 230, w: 256, h: 30, name: n });
}
card(128, 572, 1664, 170, "A6|rise|escolha");
mono("PORQUE ESCOLHEMOS A NATA LISBOA", { x: 156, y: 596, w: 1600, h: 30, name: "A6|rise|escolha" });
T("Um dos membros do grupo trabalha na Nata Lisboa, o que nos deu contacto direto com a gerente operacional, Mônica Cardoso.",
  { x: 156, y: 640, w: 1600, h: 80, size: 28, color: C.text, name: "A6|rise|escolha" });
card(128, 766, 1664, 140, "A7|rise|divisao");
mono("QUEM APRESENTA O QUÊ", { x: 156, y: 788, w: 1600, h: 30, name: "A7|rise|divisao" });
T("[0–a: ______ · b–c: ______ · d–e: ______ · f: ______ · g e conclusões: ______]",
  { x: 156, y: 830, w: 1600, h: 50, size: 28, italic: true, color: C.ph, name: "A7|rise|divisao" });
cur.addNotes("O GRUPO (≈20 s)\nCada membro apresenta-se rapidamente. Explicar porque escolhemos a Nata Lisboa e como chegámos à entrevistada. Para as fotos: clicar no círculo e usar Inserir > Imagem, ou apagar o texto FOTO.");

// ───────────────────────── 3. ROTEIRO
slide("CONTEUDO");
header("i", "// ROTEIRO · CLIQUE NUM TEMA PARA SALTAR", ["O QUE VAMOS ", ["APRESENTAR"]]);
const roteiro = [
  ["1", "A entrevista", "Mônica Cardoso, gerente operacional"],
  ["2", "3 características comuns", "Objetivos, pessoas, estrutura"],
  ["3", "Sistema aberto", "Inputs, processo, outputs"],
  ["4", "Forças do ambiente externo", "Ambiente geral e de tarefa"],
  ["5", "Complexidade do ambiente", "Mudança × complexidade"],
  ["6", "Cultura organizacional", "6 dimensões e como se aprende"],
  ["7", "Os gestores", "Níveis, funções, papéis, competências"],
  ["8", "Desafios da gestão", "Diversidade, globalização, tecnologia"],
];
const alvo = [4, 5, 6, 7, 9, 10, 12, 14];
roteiro.forEach(([l, t, d], i) => {
  const x = 128 + (i % 4) * 422, y = i < 4 ? 236 : 580, n = `A${i + 1}|rise|item${i}`, link = alvo[i];
  card(x, y, 398, 316, n);
  T(l, { x: x + 28, y: y + 18, w: 120, h: 96, font: F.serif, italic: true, size: 80, color: C.or, name: n });
  T(t, { x: x + 28, y: y + 128, w: 342, h: 84, size: 32, bold: true, name: n });
  T(d + "  →", { x: x + 28, y: y + 222, w: 342, h: 70, size: 24, color: C.muted, name: n });
  R({ x, y, w: 398, h: 316, fill: "FFFFFF", ft: 100, name: n, link });
});
cur.addNotes("ROTEIRO (≈15 s)\nA apresentação segue as alíneas a) a g) do enunciado. Em cada tema: primeiro a teoria em geral, depois como se verifica na Nata Lisboa e, por fim, um exemplo ou citação da entrevista (caixas creme, que aparecem ao clique).");

// ───────────────────────── 4. ENTREVISTA
slide("CONTEUDO");
header("0", "// METODOLOGIA", ["A ", ["ENTREVISTA"]]);
R({ x: 128, y: 236, w: 220, h: 220, fill: C.blue2, line: C.line, name: "A1|zoom|icone" });
R({ x: 168, y: 280, w: 140, h: 96, shape: pres.shapes.WEDGE_ROUND_RECT_CALLOUT, fill: C.or, name: "A1|zoom|icone" });
T("• • •", { x: 168, y: 280, w: 140, h: 86, size: 36, bold: true, color: "FFFFFF", align: "center", valign: "middle", name: "A1|zoom|icone" });
R({ x: 200, y: 392, w: 120, h: 32, shape: pres.shapes.ROUNDED_RECTANGLE, radius: 0.1, fill: "8FB0EE", name: "A1|zoom|icone" });
card(372, 236, 660, 220, "A2|rise|ficha");
[[400, 258, "ENTREVISTADA", "Mônica Cardoso", false], [720, 258, "CARGO / NÍVEL", "Gerente Operacional", false],
 [400, 356, "DATA · DURAÇÃO", "03/10/2026 · 1 hora", false], [720, 356, "MODALIDADE", "Presencial", false]].forEach(([x, y, l, v, ph]) => {
  mono(l, { x, y, w: 300, h: 30, name: "A2|rise|ficha" });
  T(v, { x, y: y + 36, w: 300, h: 40, size: 28, bold: !ph, italic: ph, color: ph ? C.ph : C.text, name: "A2|rise|ficha" });
});
mono("PORQUÊ UMA ENTREVISTA", { x: 128, y: 492, w: 900, h: 30, color: C.or, name: "A3|fade|porque" });
T("Ouvir quem gere o dia a dia da organização permite confrontar a teoria dos Tópicos 1 e 2 com a prática real da Nata Lisboa.",
  { x: 128, y: 530, w: 904, h: 80, size: 26, name: "A3|fade|porque" });
mono("BLOCOS DO GUIÃO", { x: 128, y: 646, w: 900, h: 30, name: "A4|fade|blocos" });
["Caracterização", "Estrutura", "Ambiente externo", "Cultura", "Gestão e liderança", "Diversidade e futuro"].forEach((b, i) => {
  const x = 128 + (i % 3) * 306, y = 688 + Math.floor(i / 3) * 72, n = `A${5 + i}|rise|bloco${i}`;
  T(b, { x, y, w: 290, h: 56, size: 24, color: C.text, valign: "middle", margin: 6, fill: C.card, line: C.line, name: n });
});
quote(1072, 236, 720, 200, "“[Frase marcante da Mônica Cardoso, tal como foi dita.]”", "K1|rise|citacao", "EXCERTO DA ENTREVISTA");
card(1072, 480, 720, 330, "A11|rise|tratamento");
mono("TRATAMENTO DA INFORMAÇÃO", { x: 1100, y: 504, w: 660, h: 30, name: "A11|rise|tratamento" });
T([
  { text: "+  ", options: { color: C.or, bold: true } }, { text: "Gravação com consentimento: " }, { text: "sim", options: { bold: true, breakLine: true } },
  { text: "+  ", options: { color: C.or, bold: true } }, { text: "Transcrição revista pelo grupo", options: { breakLine: true } },
  { text: "+  ", options: { color: C.or, bold: true } }, { text: "Excertos organizados por bloco do guião", options: { breakLine: true } },
  { text: "+  ", options: { color: C.or, bold: true } }, { text: "Citações destacadas nas caixas creme" },
], { x: 1100, y: 550, w: 670, h: 240, size: 26, psa: 8, name: "A11|rise|tratamento" });
cur.addNotes("A ENTREVISTA (≈45 s)\nQuem foi entrevistada: Mônica Cardoso, gerente operacional da Nata Lisboa. Indicar data, duração e modalidade. Explicar que o guião foi organizado em blocos que correspondem aos temas da apresentação.\nClique: aparece a frase marcante da entrevista.");

// ───────────────────────── 5. a) 3 CARACTERÍSTICAS
section("a) Três características");
slide("CONTEUDO");
header("a", "// IDENTIFICAÇÃO", ["AS ", ["3 CARACTERÍSTICAS"], " COMUNS"]);
T("Segundo Robbins & Coulter, todas as organizações — qualquer que seja o setor ou a dimensão — partilham três características.",
  { x: 128, y: 206, w: 1664, h: 40, size: 26, color: C.muted, name: "A1|fade|intro" });
[
  ["1", "Objetivo distinto", "Toda a organização existe para alcançar algo: a sua razão de ser, expressa na missão e em metas concretas.", "[Missão / objetivo principal da Nata Lisboa]"],
  ["2", "Pessoas", "Os objetivos não se cumprem sozinhos: são as pessoas que tomam decisões e realizam o trabalho.", "[N.º aproximado de colaboradores e principais funções]"],
  ["3", "Estrutura deliberada", "Regras, funções e relações de autoridade definem quem faz o quê e como o trabalho se coordena.", "[Como está organizada: lojas, equipas, hierarquia]"],
].forEach(([num, t, g, p], i) => {
  const x = 128 + i * 554, y = 270, n = `A${i + 2}|rise|car${num}`;
  card(x, y, 538, 480, n);
  T(num, { x: x + 28, y: y + 18, w: 120, h: 96, size: 88, bold: true, color: C.or, name: n });
  T(t, { x: x + 28, y: y + 118, w: 482, h: 48, size: 36, bold: true, name: n });
  T(g, { x: x + 28, y: y + 176, w: 482, h: 120, size: 26, color: C.text, name: n });
  phBox(x + 20, y + 310, 498, 150, p, n);
});
quote(128, 784, 1664, 120, "“[Excerto da entrevista que mostra uma destas características na Nata Lisboa.]”");
cur.addNotes("a) 3 CARACTERÍSTICAS COMUNS (≈1 min)\nEM GERAL: qualquer organização é uma entidade com (1) um objetivo distinto, (2) pessoas e (3) uma estrutura deliberada (Robbins & Coulter, Tópico 1).\nNA NATA LISBOA: preencher cada caixa tracejada.\nClique: citação da entrevista.");

// ───────────────────────── 6. b) SISTEMA ABERTO
section("b) Sistema aberto");
slide("CONTEUDO");
header("b", "// ABORDAGEM SISTÉMICA", ["UM ", ["SISTEMA ABERTO"]]);
T("A organização troca continuamente recursos e informação com o ambiente: recebe entradas, transforma-as e devolve saídas — e ajusta-se com base no feedback.",
  { x: 128, y: 206, w: 1664, h: 72, size: 26, color: C.muted, name: "A1|fade|intro" });
[
  ["ENTRADAS", "INPUTS", "Recursos obtidos do ambiente: pessoas, matérias-primas, capital, informação e tecnologia.", "[Ex.: farinha, ovos, leite, açúcar, colaboradores, fornos]", C.card],
  ["TRANSFORMAÇÃO", "PROCESSO", "Atividades que transformam as entradas: produção, operações, trabalho das equipas e gestão.", "[Ex.: produção dos pastéis, atendimento, gestão da loja]", C.card2],
  ["SAÍDAS", "OUTPUTS", "O que devolve ao ambiente: produtos e serviços, resultados financeiros, emprego e impacto social.", "[Ex.: pastéis de nata, cafés, experiência do cliente, lucro]", C.card],
].forEach(([l, t, g, p, fill], i) => {
  const x = 128 + i * 576, y = 296, n = `A${2 + i * 2}|rise|bloco${i}`;
  card(x, y, 512, 410, n, fill);
  mono(l, { x: x + 28, y: y + 22, w: 456, h: 30, name: n });
  T(t, { x: x + 28, y: y + 56, w: 456, h: 50, size: 40, bold: true, name: n });
  T(g, { x: x + 28, y: y + 116, w: 456, h: 110, size: 24, name: n });
  phBox(x + 20, y + 240, 472, 150, p, n);
  if (i < 2) R({ x: x + 524, y: y + 180, w: 40, h: 50, shape: pres.shapes.RIGHT_ARROW, fill: C.or, name: `A${3 + i * 2}|wipeL|seta${i}` });
});
T([
  { text: "↻  FEEDBACK  ", options: { bold: true, color: C.text } },
  { text: "As reações do ambiente (clientes, vendas, avaliações) voltam a entrar no sistema e permitem ajustar.  ", options: { color: C.muted } },
  { text: "[Como a Nata Lisboa recebe retorno e se ajusta]", options: { italic: true, color: C.ph } },
], { x: 128, y: 724, w: 1664, h: 74, size: 24, valign: "middle", margin: 7, line: C.dim, dash: "dash", name: "A7|fade|feedback" });
quote(128, 818, 1664, 104, "“[Excerto da entrevista sobre o funcionamento da Nata Lisboa.]”");
cur.addNotes("b) SISTEMA ABERTO (≈1 min)\nEM GERAL: a abordagem sistémica (Teoria Geral dos Sistemas; Katz & Kahn) vê a organização como um sistema aberto que depende do ambiente: inputs → processo de transformação → outputs, com feedback que permite corrigir.\nNA NATA LISBOA: substituir os exemplos [Ex.: …] pelos dados confirmados na entrevista.\nClique: citação.");

// ───────────────────────── 7. c) AMBIENTE EXTERNO (geral)
section("c) Forças do ambiente externo");
slide("CONTEUDO");
header("c", "// AMBIENTE EXTERNO · EM GERAL", ["O ", ["AMBIENTE"], " EXTERNO"]);
R({ x: 140, y: 250, w: 640, h: 640, shape: pres.shapes.OVAL, line: C.ring, lw: 1.25, dash: "dash", name: "A1|zoom|geral" });
mono("AMBIENTE GERAL", { x: 310, y: 290, w: 300, h: 30, align: "center", name: "A1|zoom|geral" });
R({ x: 270, y: 380, w: 380, h: 380, shape: pres.shapes.OVAL, fill: C.or, ft: 90, line: C.or, lw: 1.5, name: "A2|zoom|tarefa" });
mono("AMBIENTE DE TAREFA", { x: 310, y: 414, w: 300, h: 30, size: 20, color: C.phLabel, align: "center", cs: 0, name: "A2|zoom|tarefa" });
R({ x: 370, y: 480, w: 180, h: 180, shape: pres.shapes.OVAL, fill: C.or, name: "A3|zoom|org" });
T("NATA\nLISBOA", { x: 370, y: 480, w: 180, h: 180, size: 28, bold: true, color: C.bg, align: "center", valign: "middle", name: "A3|zoom|org" });
card(840, 250, 952, 300, "A4|rise|cardTarefa");
mono("AMBIENTE DE TAREFA (ESPECÍFICO) · IMPACTO DIRETO", { x: 868, y: 274, w: 900, h: 30, color: C.or, name: "A4|rise|cardTarefa" });
T("Grupos com que a organização interage diretamente e que afetam, de imediato, o cumprimento dos seus objetivos.",
  { x: 868, y: 318, w: 896, h: 80, size: 26, name: "A4|rise|cardTarefa" });
{ let cx = 868; ["Clientes", "Fornecedores", "Concorrentes", "Grupos de pressão"].forEach((t) => { cx += chip(cx, 470, t, "A4|rise|cardTarefa") + 14; }); }
card(840, 578, 952, 312, "A5|rise|cardGeral");
mono("AMBIENTE GERAL (CONTEXTUAL) · IMPACTO INDIRETO", { x: 868, y: 602, w: 900, h: 30, color: C.muted, name: "A5|rise|cardGeral" });
T("Condições amplas, fora do controlo da organização, que afetam todas as organizações do setor.",
  { x: 868, y: 646, w: 896, h: 80, size: 26, name: "A5|rise|cardGeral" });
{ let cx = 868; ["Económicas", "Político-legais", "Socioculturais"].forEach((t) => { cx += chip(cx, 744, t, "A5|rise|cardGeral", C.muted) + 14; }); }
{ let cx = 868; ["Demográficas", "Tecnológicas", "Globais"].forEach((t) => { cx += chip(cx, 806, t, "A5|rise|cardGeral", C.muted) + 14; }); }
cur.addNotes("c) AMBIENTE EXTERNO — EM GERAL (≈45 s)\nO ambiente externo são as forças e instituições fora da organização que a podem afetar.\n• Ambiente de tarefa (específico): impacto direto e imediato — clientes, fornecedores, concorrentes e grupos de pressão.\n• Ambiente geral (contextual): impacto indireto — condições económicas, político-legais, socioculturais, demográficas, tecnológicas e globais.\nConfirmar a lista de forças com o PDF do Tópico 1.");

// ───────────────────────── 8. c) FORÇAS NA NATA LISBOA
slide("CONTEUDO");
header("c", "// AMBIENTE EXTERNO · NA NATA LISBOA", ["FORÇAS NA ", ["NATA LISBOA"]]);
mono("FORÇAS DE TAREFA · IMPACTO DIRETO", { x: 128, y: 214, w: 1200, h: 30, color: C.or, name: "A1|fade|lblTarefa" });
[["CLIENTES", "[Quem são: turistas, residentes, empresas…?]"], ["FORNECEDORES", "[Principais: matérias-primas, embalagens, café…]"],
 ["CONCORRENTES", "[Outras pastelarias e cadeias de pastéis de nata]"], ["GRUPOS DE PRESSÃO", "[ASAE, autarquia, media, avaliações online…]"]].forEach(([l, p], i) => {
  const x = 128 + i * 420, n = `A${2 + i}|rise|tarefa${i}`;
  card(x, 254, 404, 160, n);
  mono(l, { x: x + 22, y: 272, w: 360, h: 30, name: n });
  T(p, { x: x + 22, y: 310, w: 360, h: 90, size: 25, italic: true, color: C.ph, name: n });
});
mono("FORÇAS GERAIS · IMPACTO INDIRETO", { x: 128, y: 444, w: 1200, h: 30, name: "A6|fade|lblGeral" });
[["ECONÓMICAS", "[Ex.: inflação, preço dos ovos e da energia, turismo]"], ["POLÍTICO-LEGAIS", "[Ex.: segurança alimentar, leis laborais, IVA]"],
 ["SOCIOCULTURAIS", "[Ex.: hábitos de consumo, tradição do pastel de nata]"], ["DEMOGRÁFICAS", "[Ex.: turistas vs. residentes, faixa etária]"],
 ["TECNOLÓGICAS", "[Ex.: entregas por app, pagamentos, redes sociais]"], ["GLOBAIS", "[Ex.: presença internacional, turismo global]"]].forEach(([l, p], i) => {
  const x = 128 + (i % 3) * 560, y = 484 + Math.floor(i / 3) * 136, n = `A${7 + i}|rise|geral${i}`;
  card(x, y, 544, 122, n);
  mono(l, { x: x + 22, y: y + 16, w: 500, h: 30, name: n });
  T(p, { x: x + 22, y: y + 52, w: 500, h: 60, size: 25, italic: true, color: C.ph, name: n });
});
quote(128, 778, 1664, 120, "“[Excerto em que a Mônica fala de clientes, concorrência ou mercado.]”");
cur.addNotes("c) FORÇAS NA NATA LISBOA (≈1 min)\nPara cada força, indicar o que a afeta em concreto. Os textos [Ex.: …] são sugestões a confirmar com a entrevista — substituir ou apagar.\nDestacar as 2 ou 3 forças com mais impacto.\nClique: citação.");

// ───────────────────────── 9. d) COMPLEXIDADE
section("d) Complexidade do ambiente");
slide("CONTEUDO");
header("d", "// AMBIENTE EXTERNO", ["GRAU DE ", ["COMPLEXIDADE"]]);
mono("GRAU DE MUDANÇA →", { x: 318, y: 222, w: 620, h: 30, align: "center", name: "A1|fade|eixos" });
T("Estável", { x: 318, y: 262, w: 310, h: 44, size: 28, bold: true, align: "center", name: "A1|fade|eixos" });
T("Dinâmico", { x: 628, y: 262, w: 310, h: 44, size: 28, bold: true, align: "center", name: "A1|fade|eixos" });
mono("COMPLEXIDADE ↓", { x: 128, y: 270, w: 180, h: 30, size: 20, cs: 0, name: "A1|fade|eixos" });
T("Simples", { x: 128, y: 314, w: 180, h: 230, size: 28, bold: true, valign: "middle", name: "A1|fade|eixos" });
T("Complexo", { x: 128, y: 544, w: 180, h: 230, size: 28, bold: true, valign: "middle", name: "A1|fade|eixos" });
[["1", "Estável e simples", "Incerteza BAIXA", "13306E"], ["2", "Dinâmico e simples", "Incerteza MODERADA", "1A3C80"],
 ["3", "Estável e complexo", "Incerteza MODERADA", "1A3C80"], ["4", "Dinâmico e complexo", "Incerteza ELEVADA", "254C96"]].forEach(([num, a, b, fill], i) => {
  const x = 318 + (i % 2) * 310, y = 314 + Math.floor(i / 2) * 230, n = `A${2 + i}|zoom|cel${num}`;
  R({ x, y, w: 310, h: 230, fill, line: "4E6CA8", lw: 1.25, name: n });
  T(num, { x: x + 24, y: y + 18, w: 80, h: 64, size: 52, bold: true, color: C.or, name: n });
  T(a, { x: x + 24, y: y + 100, w: 270, h: 40, size: 25, name: n });
  T(b, { x: x + 24, y: y + 146, w: 270, h: 40, size: 25, bold: true, color: i === 3 ? C.or : C.muted, name: n });
});
mono("Matriz de incerteza ambiental (Duncan, 1972)", { x: 128, y: 800, w: 810, h: 30, size: 20, cs: 0, color: C.dim, name: "A5|fade|fonte" });
mono("EM GERAL", { x: 1000, y: 222, w: 792, h: 30, color: C.or, name: "A6|fade|geral" });
T("A complexidade mede quantos componentes do ambiente afetam a organização; a mudança, a rapidez com que esses fatores se alteram. Juntos determinam o grau de incerteza que os gestores enfrentam.",
  { x: 1000, y: 260, w: 792, h: 160, size: 26, name: "A6|fade|geral" });
R({ x: 1000, y: 436, w: 792, h: 230, fill: C.or, ft: 93, line: C.or, lw: 1.25, dash: "dash", name: "A7|rise|especifico" });
mono("NA NATA LISBOA", { x: 1020, y: 452, w: 752, h: 30, color: C.phLabel, name: "A7|rise|especifico" });
T([
  { text: "N.º de componentes: ", options: { bold: true, color: C.text } }, { text: "[poucos / muitos — quais?]", options: { italic: true, color: C.ph, breakLine: true } },
  { text: "Ritmo de mudança: ", options: { bold: true, color: C.text } }, { text: "[lento / rápido — porquê?]", options: { italic: true, color: C.ph, breakLine: true } },
  { text: "Conclusão: ", options: { bold: true, color: C.text } }, { text: "[Célula _ · incerteza ______]", options: { italic: true, color: C.ph } },
], { x: 1020, y: 494, w: 752, h: 160, size: 26, psa: 10, name: "A7|rise|especifico" });
quote(1000, 696, 792, 170, "“[Excerto em que a Mônica fala de mudanças no mercado ou na concorrência.]”");
cur.addNotes("d) GRAU DE COMPLEXIDADE (≈45 s)\nEM GERAL: dois eixos — grau de mudança (estável ↔ dinâmico) e grau de complexidade (poucos ↔ muitos componentes). Da combinação resultam 4 células, da incerteza mais baixa (1) à mais elevada (4).\nNA NATA LISBOA: indicar em que célula fica e justificar com as forças do slide anterior. Sugestão: pintar a célula escolhida de laranja.\nClique: citação.");

// ───────────────────────── 10. e) CULTURA — 6 DIMENSÕES
section("e) Cultura organizacional");
slide("CONTEUDO");
header("e", "// CULTURA ORGANIZACIONAL", ["CULTURA: AS ", ["6 DIMENSÕES"]]);
T("Valores, crenças e práticas partilhadas que orientam o comportamento dos membros. Cada dimensão é um contínuo entre dois polos — o ● marca onde a Nata Lisboa se situa.",
  { x: 128, y: 206, w: 1664, h: 72, size: 25, color: C.muted, name: "A1|fade|intro" });
mono("POLO A", { x: 230, y: 292, w: 280, h: 30, size: 20, align: "right", name: "A1|fade|intro" });
mono("POSIÇÃO NA NATA LISBOA", { x: 550, y: 292, w: 360, h: 30, size: 20, align: "center", cs: 0, name: "A1|fade|intro" });
mono("POLO B", { x: 950, y: 292, w: 280, h: 30, size: 20, name: "A1|fade|intro" });
mono("EVIDÊNCIA (OBSERVADO / DITO)", { x: 1260, y: 292, w: 520, h: 30, size: 20, name: "A1|fade|intro" });
[["Processos", "Resultados"], ["Colaborador", "Tarefa"], ["Paroquial", "Profissional"],
 ["Sistema aberto", "Sistema fechado"], ["Controlo flexível", "Controlo apertado"], ["Normativa", "Pragmática"]].forEach(([a, b], i) => {
  const y = 332 + i * 92, n = `A${2 + i}|wipeL|dim${i + 1}`;
  card(128, y, 1664, 80, n);
  mono(`D${i + 1}`, { x: 150, y: y + 24, w: 60, h: 32, size: 24, color: C.or, name: n });
  T(a, { x: 210, y: y + 20, w: 300, h: 40, size: 26, bold: true, align: "right", name: n });
  R({ x: 550, y: y + 40, w: 360, h: 0, shape: pres.shapes.LINE, line: "6F8DC7", lw: 2, name: n });
  R({ x: 544, y: y + 34, w: 12, h: 12, shape: pres.shapes.OVAL, fill: "6F8DC7", name: n });
  R({ x: 904, y: y + 34, w: 12, h: 12, shape: pres.shapes.OVAL, fill: "6F8DC7", name: n });
  R({ x: 716, y: y + 26, w: 28, h: 28, shape: pres.shapes.OVAL, fill: C.or, line: "FFFFFF", lw: 1.5, name: n });
  T(b, { x: 950, y: y + 20, w: 290, h: 40, size: 26, bold: true, name: n });
  T("[O que observámos / o que foi dito]", { x: 1260, y: y + 20, w: 520, h: 40, size: 24, italic: true, color: C.ph, name: n });
});
T("↳ Arrastar cada ● para a posição certa. Confirmar os nomes das 6 dimensões com o PDF do Tópico 2.",
  { x: 128, y: 892, w: 1664, h: 36, size: 22, italic: true, color: C.dim, name: "A8|fade|nota" });
cur.addNotes("e) CULTURA — 6 DIMENSÕES (≈1 min 15 s)\nEM GERAL: cultura organizacional = valores, crenças e práticas partilhadas. Modelo de 6 dimensões (Hofstede et al., 1990):\nD1 Processos ↔ Resultados: foco em \"como\" se faz vs. no resultado.\nD2 Colaborador ↔ Tarefa: preocupação com as pessoas vs. apenas com o trabalho feito.\nD3 Paroquial ↔ Profissional: identidade ligada à empresa vs. à profissão.\nD4 Sistema aberto ↔ fechado: facilidade de integrar pessoas novas.\nD5 Controlo flexível ↔ apertado: rigor com custos, horários, regras.\nD6 Normativa ↔ Pragmática: seguir regras vs. orientar-se para o cliente.\nSe o PDF do Tópico 2 usar outras dimensões, trocar os nomes dos polos.");

// ───────────────────────── 11. e) COMO SE APRENDE A CULTURA
slide("CONTEUDO");
header("e", "// CULTURA ORGANIZACIONAL", ["COMO SE ", ["APRENDE"], " A CULTURA"]);
[["1", "Histórias", "Narrativas sobre pessoas e acontecimentos marcantes que mostram o que a organização valoriza.", "[Ex.: a história da fundação, um cliente marcante]"],
 ["2", "Rituais", "Atividades repetidas que reforçam os valores-chave: reuniões, formações, celebrações.", "[Ex.: rotina de abertura da loja, formação inicial]"],
 ["3", "Símbolos materiais", "Espaço, decoração, fardas e objetos comunicam o que é importante.", "[Ex.: azulejos, farda, balcão com produção à vista]"],
 ["4", "Linguagem", "Termos e expressões próprias que identificam e unem os membros.", "[Ex.: expressões usadas pela equipa no dia a dia]"]].forEach(([num, t, g, p], i) => {
  const x = 128 + i * 422, y = 222, n = `A${1 + i}|rise|forma${i}`;
  card(x, y, 398, 524, n);
  R({ x: x + 28, y: y + 26, w: 64, h: 64, shape: pres.shapes.OVAL, line: C.or, lw: 1.5, name: n });
  T(num, { x: x + 28, y: y + 26, w: 64, h: 64, size: 30, bold: true, color: C.or, align: "center", valign: "middle", name: n });
  T(t, { x: x + 28, y: y + 108, w: 350, h: 44, size: 32, bold: true, name: n });
  T(g, { x: x + 28, y: y + 162, w: 342, h: 150, size: 24, name: n });
  phBox(x + 16, y + 330, 366, 176, p, n);
});
card(128, 770, 800, 150, "A5|rise|forte");
mono("CULTURA FORTE OU FRACA?", { x: 152, y: 788, w: 760, h: 30, name: "A5|rise|forte" });
T("Forte = valores-chave intensamente partilhados e aceites.", { x: 152, y: 824, w: 760, h: 36, size: 24, name: "A5|rise|forte" });
T("[Posição do grupo sobre a Nata Lisboa e porquê]", { x: 152, y: 864, w: 760, h: 40, size: 25, italic: true, color: C.ph, name: "A5|rise|forte" });
quote(960, 774, 832, 146, "“[Excerto sobre a integração de novos colaboradores.]”");
cur.addNotes("e) COMO SE APRENDE A CULTURA (≈45 s)\nEM GERAL: os colaboradores aprendem a cultura através de histórias, rituais, símbolos materiais e linguagem (Robbins & Coulter). A integração (socialização) dos novos colaboradores é o momento em que isto é mais visível.\nCultura forte: os valores centrais são intensamente partilhados; tem mais influência no comportamento.\nClique: citação.");

// ───────────────────────── 12. f) NÍVEIS DE GESTÃO
section("f) Os gestores");
slide("CONTEUDO");
header("f", "// GESTORES", ["NÍVEIS DE ", ["GESTÃO"]]);
cur.addImage({ path: "pyramid.png", x: I(128), y: I(240), w: I(640), h: I(540), altText: "Pirâmide com os três níveis de gestão: topo, intermédia e primeira linha", objectName: "A1|zoom|piramide" });
T("TOPO", { x: 378, y: 330, w: 140, h: 40, size: 28, bold: true, color: C.bg, align: "center", name: "A1|zoom|piramide" });
T("INTERMÉDIA", { x: 248, y: 470, w: 400, h: 40, size: 30, bold: true, align: "center", name: "A1|zoom|piramide" });
T("PRIMEIRA LINHA", { x: 198, y: 646, w: 500, h: 40, size: 30, bold: true, align: "center", name: "A1|zoom|piramide" });
T([{ text: "OPERACIONAIS (NÃO GESTORES): ", options: { color: C.muted } }, { text: "[n.º aprox.]", options: { color: C.ph, italic: true } }],
  { x: 128, y: 800, w: 640, h: 32, size: 22, font: F.mono, align: "center", name: "A1|zoom|piramide" });
[["GESTÃO DE TOPO", "Decisões estratégicas: objetivos e políticas para toda a organização.", [{ text: "[Quem são na Nata Lisboa e que decisões tomam]", options: { italic: true, color: C.ph } }]],
 ["GESTÃO INTERMÉDIA", "Traduzem a estratégia em planos e coordenam outros gestores.", [{ text: "Mônica Cardoso", options: { bold: true, color: C.text } }, { text: " — Gerente Operacional ", options: { color: C.text } }, { text: "[confirmar nível e decisões que toma]", options: { italic: true, color: C.ph } }]],
 ["PRIMEIRA LINHA", "Dirigem o trabalho diário dos colaboradores operacionais.", [{ text: "[Ex.: responsáveis de loja ou de turno]", options: { italic: true, color: C.ph } }]]].forEach(([l, g, p], i) => {
  const y = 240 + i * 186, n = `A${2 + i}|rise|nivel${i}`;
  card(840, y, 952, 168, n, i === 1 ? C.card2 : C.card);
  mono(l, { x: 868, y: y + 18, w: 900, h: 30, color: i === 0 ? C.or : C.muted, name: n });
  T(g, { x: 868, y: y + 54, w: 900, h: 40, size: 26, name: n });
  T(p, { x: 868, y: y + 104, w: 900, h: 44, size: 26, name: n });
});
T([{ text: "Estrutura: ", options: { bold: true } }, { text: "[Tradicional (piramidal) ou outra? Justificar]", options: { italic: true, color: C.ph } }],
  { x: 840, y: 812, w: 952, h: 70, size: 26, valign: "middle", margin: 7, line: C.dim, dash: "dash", name: "A5|fade|estrutura" });
cur.addNotes("f) NÍVEIS DE GESTÃO (≈45 s)\nEM GERAL: numa estrutura tradicional (piramidal) há gestão de topo (decisões estratégicas), gestão intermédia (planos táticos, coordena gestores) e gestão de primeira linha (supervisiona o trabalho operacional). Na base estão os operacionais, que não gerem ninguém.\nNA NATA LISBOA: situar a Mônica Cardoso — como gerente operacional, provavelmente gestão intermédia (confirmar na entrevista se gere outros gestores ou diretamente a equipa).");

// ───────────────────────── 13. f) FUNÇÕES, PAPÉIS, COMPETÊNCIAS
slide("CONTEUDO");
header("f", "// GESTORES · MÔNICA CARDOSO", ["FUNÇÕES, PAPÉIS, ", ["COMPETÊNCIAS"]]);
const item = (b, t, last) => [{ text: "+ ", options: { bold: true, color: C.or } }, { text: b, options: { bold: true } }, { text: " — " + t, options: { color: C.muted, breakLine: !last } }];
[["FUNÇÕES · FAYOL", "O que faz", [["Planear", "definir objetivos e o caminho"], ["Organizar", "distribuir tarefas e recursos"], ["Liderar", "motivar e orientar pessoas"], ["Controlar", "medir e corrigir o desempenho"]], "[Exemplo de cada função no dia a dia da Mônica]"],
 ["PAPÉIS · MINTZBERG", "Como atua", [["Interpessoais", "figura de proa, líder, ligação"], ["Informacionais", "monitor, disseminador, porta-voz"], ["Decisionais", "empreendedor, gestor de perturbações, distribuidor de recursos, negociador"]], "[Papéis mais visíveis + exemplo]"],
 ["COMPETÊNCIAS · KATZ", "O que mais usa", [["Técnicas", "saber fazer específico da área"], ["Humanas", "trabalhar com e através de pessoas"], ["Conceptuais", "ver a organização como um todo"]], "[Competências mais usadas + porquê]"]].forEach(([l, t, its, p], i) => {
  const x = 128 + i * 554, y = 222, n = `A${1 + i}|rise|col${i}`;
  card(x, y, 538, 560, n);
  mono(l, { x: x + 28, y: y + 22, w: 482, h: 30, color: C.or, name: n });
  T(t, { x: x + 28, y: y + 58, w: 482, h: 48, size: 36, bold: true, name: n });
  T(its.flatMap(([b, d], k) => item(b, d, k === its.length - 1)), { x: x + 28, y: y + 120, w: 482, h: 250, size: 24, psa: 8, name: n });
  phBox(x + 20, y + 388, 498, 152, p, n);
});
quote(128, 806, 1664, 112, "“[Excerto em que a Mônica descreve o seu dia a dia como gerente operacional.]”");
cur.addNotes("f) FUNÇÕES, PAPÉIS E COMPETÊNCIAS (≈1 min 15 s)\nEM GERAL:\n• Funções (Fayol): planear, organizar, liderar e controlar.\n• Papéis (Mintzberg): interpessoais, informacionais e decisionais — 10 papéis no total.\n• Competências (Katz): técnicas (mais importantes na primeira linha), humanas (importantes em todos os níveis) e conceptuais (mais importantes no topo).\nNA NATA LISBOA: ligar cada coluna a exemplos concretos do trabalho da Mônica Cardoso.\nClique: citação.");

// ───────────────────────── 14. g) DESAFIOS
section("g) Diversidade, globalização e tecnologia");
slide("CONTEUDO");
header("g", "// DIVERSIDADE · GLOBALIZAÇÃO · TECNOLOGIA", ["OS ", ["DESAFIOS"], " DA GESTÃO"]);
[["Gestão da diversidade", "Diferenças visíveis (idade, género, origem) e profundas (valores, personalidade). Boas práticas: recrutamento inclusivo, mentoria, formação e horários que conciliem trabalho e família.", "[Práticas da Nata Lisboa na gestão da equipa]"],
 ["Globalização", "Mercados, concorrentes e fornecedores sem fronteiras. Atitude dos gestores: etnocêntrica, policêntrica ou geocêntrica. Exige adaptação a culturas e mercados diferentes.", "[Desafio / oportunidade: turismo, mercados externos…]"],
 ["Evolução tecnológica", "Digitalização, automação e inteligência artificial mudam processos, competências e a relação com o cliente: encomendas online, entregas, pagamentos, redes sociais.", "[Desafio / resposta da Nata Lisboa]"]].forEach(([t, g, p], i) => {
  const x = 128 + i * 554, y = 222, n = `A${1 + i}|rise|desafio${i}`;
  card(x, y, 538, 560, n);
  // ícones desenhados com formas
  const ix = x + 28, iy = y + 24;
  if (i === 0) {
    R({ x: ix, y: iy + 6, w: 44, h: 44, shape: pres.shapes.OVAL, fill: C.or, name: n });
    R({ x: ix + 26, y: iy, w: 44, h: 44, shape: pres.shapes.OVAL, fill: "8FB0EE", name: n });
    R({ x: ix + 14, y: iy + 26, w: 44, h: 44, shape: pres.shapes.OVAL, fill: "06142F", line: "8FB0EE", name: n });
  } else if (i === 1) {
    R({ x: ix, y: iy, w: 68, h: 68, shape: pres.shapes.OVAL, fill: "8FB0EE", name: n });
    R({ x: ix + 20, y: iy, w: 28, h: 68, shape: pres.shapes.OVAL, line: C.bg, lw: 1.5, name: n });
    R({ x: ix, y: iy + 34, w: 68, h: 0, shape: pres.shapes.LINE, line: C.bg, lw: 1.5, name: n });
  } else {
    R({ x: ix + 6, y: iy + 6, w: 56, h: 56, shape: pres.shapes.ROUNDED_RECTANGLE, radius: 0.12, fill: "8FB0EE", name: n });
    R({ x: ix + 20, y: iy + 20, w: 28, h: 28, fill: C.bg, name: n });
    for (let k = 0; k < 3; k++) {
      R({ x: ix + 16 + k * 14, y: iy, w: 0, h: 6, shape: pres.shapes.LINE, line: "8FB0EE", lw: 2, name: n });
      R({ x: ix + 16 + k * 14, y: iy + 62, w: 0, h: 6, shape: pres.shapes.LINE, line: "8FB0EE", lw: 2, name: n });
    }
  }
  T(t, { x: x + 28, y: y + 110, w: 482, h: 44, size: 32, bold: true, name: n });
  T(g, { x: x + 28, y: y + 164, w: 482, h: 210, size: 24, name: n });
  phBox(x + 20, y + 388, 498, 152, p, n);
});
quote(128, 806, 1664, 112, "“[Excerto da entrevista sobre diversidade, expansão ou tecnologia.]”");
cur.addNotes("g) DIVERSIDADE, GLOBALIZAÇÃO E TECNOLOGIA (≈1 min)\nEM GERAL:\n• Diversidade: diferenças superficiais e profundas entre pessoas; gerir bem traz criatividade e melhor resposta a clientes diferentes.\n• Globalização: atitudes etnocêntrica (o nosso modo é o melhor), policêntrica (os locais sabem melhor) e geocêntrica (o melhor de cada lado).\n• Tecnologia: novas ferramentas mudam o trabalho e exigem novas competências.\nNA NATA LISBOA: práticas concretas e desafios referidos pela Mônica.\nClique: citação.");

// ───────────────────────── 15. CONCLUSÕES
section("Fecho");
slide("CONTEUDO");
header("*", "// FECHO", ["CONCLUSÕES DO ", ["GRUPO"]]);
[["1", "[Principal conclusão]"], ["2", "[Segunda conclusão]"], ["3", "[O que mais nos surpreendeu]"]].forEach(([num, p], i) => {
  const x = 128 + i * 554, n = `A${1 + i}|rise|conc${num}`;
  card(x, 236, 538, 270, n);
  T(num, { x: x + 28, y: 254, w: 120, h: 96, size: 88, bold: true, color: C.or, name: n });
  T(p, { x: x + 28, y: 370, w: 482, h: 110, size: 28, italic: true, color: C.ph, name: n });
});
card(128, 540, 1100, 300, "A4|rise|teoria");
mono("TEORIA × PRÁTICA", { x: 156, y: 564, w: 1040, h: 30, color: C.or, name: "A4|rise|teoria" });
T("Onde a Nata Lisboa confirma a teoria e onde se afasta dela.", { x: 156, y: 606, w: 1040, h: 40, size: 26, name: "A4|rise|teoria" });
T("[O que a entrevista à Mônica Cardoso nos mostrou sobre a teoria da UC.]", { x: 156, y: 660, w: 1040, h: 150, size: 28, italic: true, color: C.ph, name: "A4|rise|teoria" });
quote(1260, 540, 532, 300, "“[Frase final da entrevista para fechar a apresentação.]”", "K1|rise|citacao", "CITAÇÃO · MÔNICA CARDOSO");
cur.addNotes("CONCLUSÕES (≈45 s)\nTrês ideias-chave, curtas. Terminar com a ligação teoria × prática e com uma frase da entrevista (clique).");

// ───────────────────────── 16. REFERÊNCIAS
slide("CONTEUDO");
header("R", "// APA 7.ª EDIÇÃO", ["REFERÊNCIAS E ", ["USO DE IA"]]);
const refs = [
  [["Duncan, R. B. (1972). Characteristics of organizational environments and perceived environmental uncertainty. "], ["Administrative Science Quarterly, 17", true], ["(3), 313–327."]],
  [["Hofstede, G., Neuijen, B., Ohayv, D. D., & Sanders, G. (1990). Measuring organizational cultures. "], ["Administrative Science Quarterly, 35", true], ["(2), 286–316."]],
  [["Katz, D., & Kahn, R. L. (1978). "], ["The social psychology of organizations", true], [" (2.ª ed.). Wiley."]],
  [["Katz, R. L. (1974). Skills of an effective administrator. "], ["Harvard Business Review, 52", true], ["(5), 90–102."]],
  [["Mintzberg, H. (1973). "], ["The nature of managerial work", true], [". Harper & Row."]],
  [["Robbins, S. P., & Coulter, M. "], ["[(ano)]", false, true], [". "], ["Management", true], [" "], ["[(n.º ed.) — confirmar a edição usada na UC]", false, true], [". Pearson."]],
  [["PDFs das aulas de Gestão das Organizações (2026/2027). ISCA-UA."]],
  [["Anthropic. (2026). "], ["Claude", true], [" [Modelo de linguagem de grande escala]. https://claude.ai"]],
  [["Nata Lisboa. "], ["[(data de acesso). Título da página. URL]", false, true]],
  [["Cardoso, M. (2026). "], ["Entrevista presencial realizada pelo Grupo 8, 3 de outubro [comunicação pessoal]."]],
];
T(refs.flatMap((parts, k) => [{ text: "+  ", options: { color: C.or, bold: true } }, ...parts.map(([t, it, ph], j) => ({
  text: t, options: { italic: !!(it || ph), color: ph ? C.ph : C.text, breakLine: j === parts.length - 1 && k < refs.length - 1 } }))]),
  { x: 128, y: 222, w: 1060, h: 700, size: 22, psa: 9, name: "A1|fade|refs" });
card(1240, 222, 552, 300, "A2|rise|ia");
mono("DECLARAÇÃO DE USO DE IA", { x: 1268, y: 246, w: 500, h: 30, color: C.or, name: "A2|rise|ia" });
T([
  { text: "Ferramenta: ", options: { bold: true } }, { text: "Claude (Anthropic)", options: { breakLine: true } },
  { text: "Tarefa: ", options: { bold: true } }, { text: "design dos slides, correção ortográfica e revisão do contexto do guião", options: { breakLine: true } },
  { text: "Grupo: ", options: { bold: true } }, { text: "conteúdo e análise revistos por todos" },
], { x: 1268, y: 292, w: 500, h: 210, size: 24, psa: 10, name: "A2|rise|ia" });
cur.addNotes("REFERÊNCIAS\nConfirmar a edição do Robbins & Coulter usada na UC e completar o site da Nata Lisboa e a data da entrevista. Declarar o uso de IA conforme as regras da UC.");

// ───────────────────────── 17. OBRIGADO
slide("CAPA");
R({ x: 1150, y: 170, w: 740, h: 740, shape: pres.shapes.OVAL, line: "3E5C99", lw: 1.5, name: "A1|zoom|aro" });
R({ x: 1250, y: 270, w: 540, h: 540, shape: pres.shapes.OVAL, line: "3E5C99", lw: 1.25, dash: "dash", name: "A1|zoom|aro2" });
R({ x: 1506, y: 256, w: 28, h: 28, shape: pres.shapes.OVAL, fill: C.or, name: "A2|zoom|ponto" });
mono("ESCALA 1:1 · PLANTA GERAL", { x: 128, y: 176, w: 900, h: 30, color: C.dim });
R({ x: 128, y: 222, w: 960, h: 0, shape: pres.shapes.LINE, line: "4E6CA8", lw: 1.5 });
mono("// GESTÃO DAS ORGANIZAÇÕES · 89135", { x: 128, y: 300, w: 1000, h: 36, size: 26, cs: 4, name: "A2|fade|kicker" });
T("OBRIGADO!", { x: 128, y: 350, w: 1200, h: 220, size: 168, bold: true, color: "EEF3FB", name: "A3|rise|obrigado" });
cur.addImage({ path: "logo.png", x: I(1372), y: I(388), w: I(296), h: I(302), altText: "Logótipo da Nata Lisboa", objectName: "A3|zoom|logo" });
T("Perguntas?  ·  Nata Lisboa", { x: 128, y: 590, w: 1000, h: 50, size: 34, color: C.muted, name: "A4|fade|perguntas" });
T("Um agradecimento especial a Mônica Cardoso pela disponibilidade.", { x: 128, y: 660, w: 1000, h: 44, size: 26, italic: true, color: C.ph, name: "A5|fade|agradecimento" });
cur.addNotes("Agradecer e abrir para perguntas.");

pres.writeFile({ fileName: "Nata_Lisboa_GO_89135.pptx" }).then((f) => console.log("escrito:", f));
