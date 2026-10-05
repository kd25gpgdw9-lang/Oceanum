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
  T(letter, { x: 128, y: 72, w: 112, h: 112, font: F.serif, italic: true, size: letter.length > 1 ? 44 : 64, color: C.or, align: "center", valign: "middle" });
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
header("0", "// QUEM SOMOS", ["O GRUPO"]);
const membros = [["Ryan Magalhães", "137142", "ryan.png"], ["Guilherme Barreiro", "140385", "guilherme.png"]];
membros.forEach(([nm, mec, foto], i) => {
  const x = 128 + i * 844, y = 236, n = `A${i + 1}|rise|membro${i + 1}`;
  card(x, y, 820, 260, n);
  if (foto) {
    cur.addImage({ path: foto, x: I(x + 40), y: I(y + 40), w: I(180), h: I(180), altText: "Foto de " + nm, objectName: n });
    R({ x: x + 40, y: y + 40, w: 180, h: 180, shape: pres.shapes.OVAL, line: C.or, lw: 2, name: n });
  } else {
    R({ x: x + 40, y: y + 40, w: 180, h: 180, shape: pres.shapes.OVAL, fill: "2A4C93", line: C.or, lw: 1.5, name: n });
    mono("FOTO", { x: x + 40, y: y + 40, w: 180, h: 180, align: "center", valign: "middle", color: "8FB0EE", name: n });
  }
  T(nm, { x: x + 260, y: y + 78, w: 520, h: 56, size: 44, bold: true, color: C.text, name: n });
  T([{ text: "N.º MEC. ", options: { color: C.muted } }, { text: mec || "[______]", options: { color: mec ? C.text : C.ph, italic: !mec } }],
    { x: x + 260, y: y + 150, w: 520, h: 36, size: 26, font: F.mono, cs: 2, name: n });
});
card(128, 530, 1664, 190, "A3|rise|escolha");
mono("PORQUE ESCOLHEMOS A NATA LISBOA", { x: 156, y: 556, w: 1600, h: 30, color: C.or, name: "A3|rise|escolha" });
T("Um dos membros do grupo trabalha na Nata Lisboa, o que nos deu contacto direto com a gerente operacional, Mônica Cardoso.",
  { x: 156, y: 604, w: 1600, h: 90, size: 32, color: C.text, name: "A3|rise|escolha" });
cur.addNotes("O GRUPO (≈20 s)\nCada membro apresenta-se rapidamente. Explicar porque escolhemos a Nata Lisboa e como chegámos à entrevistada. Para as fotos: clicar no círculo e usar Inserir > Imagem, ou apagar o texto FOTO.");

// ───────────────────────── Modelo de 3 camadas: ① Em geral · ② Na Nata Lisboa · ③ Na prática
const CONTENT = require("./content.json");
const L1 = "① EM GERAL", L2 = "② NA NATA LISBOA", L3 = "③ NA PRÁTICA · CITAÇÃO DA MÔNICA CARDOSO", L3b = "③ NA PRÁTICA · EXEMPLO DO DIA A DIA";
const estLines = (txt, w, px) => Math.max(1, Math.ceil((txt.length * px * 0.5) / w));

function t3(id) {
  const c = CONTENT.t3[id];
  slide("CONTEUDO");
  header(c.num, c.eyebrow, c.title);
  // ① EM GERAL
  mono(L1, { x: 128, y: 210, w: 1040, h: 30, color: C.or, name: "A1|fade|geral" });
  const leadH = estLines(c.lead, 1040, 25) * 33 + 6;
  T(c.lead, { x: 128, y: 246, w: 1040, h: leadH, size: 25, color: C.text, name: "A1|fade|geral" });
  const top = 246 + leadH + 18, bottom = 748, cols = c.cols, n = c.items.length;
  const rows = Math.ceil(n / cols), gap = c.layout === "flow" ? 44 : 16;
  const w = (1040 - (cols - 1) * gap) / cols, h = (bottom - top - (rows - 1) * 16) / rows;
  c.items.forEach((it, i) => {
    const x = 128 + (i % cols) * (w + gap), y = top + Math.floor(i / cols) * (h + 16), nm = `A${2 + i}|rise|item${i}`;
    card(x, y, w, h, nm, c.layout === "flow" && i === 1 ? C.card2 : C.card);
    let yy = y + 16;
    if (c.numbered) { T(String(i + 1), { x: x + 20, y: yy - 4, w: 80, h: 64, size: 56, bold: true, color: C.or, name: nm }); yy += 64; }
    if (it.k) { mono(it.k, { x: x + 20, y: yy, w: w - 40, h: 26, size: 18, cs: 1, color: c.layout === "timeline" ? C.or : C.muted, name: nm }); yy += 26; }
    const tSize = cols >= 4 ? 26 : 28;
    const tH = estLines(it.t, w - 40, tSize * 1.1) * (tSize * 1.25);
    T(it.t, { x: x + 20, y: yy, w: w - 40, h: tH, size: tSize, bold: true, name: nm }); yy += tH + 6;
    if (it.l) {
      T(it.l.flatMap(([b, d], k) => [{ text: b, options: { bold: true, color: C.text } }, { text: " — " + d, options: { color: C.muted, breakLine: k < it.l.length - 1 } }]),
        { x: x + 20, y: yy, w: w - 40, h: y + h - yy - 12, size: 22, psa: 6, name: nm });
    } else {
      const avail = y + h - yy - 12;
      let ds = cols >= 4 ? 21 : 23;
      while (ds > 19 && estLines(it.d, w - 40, ds * 1.05) * ds * 1.22 > avail) ds -= 1;
      T(it.d, { x: x + 20, y: yy, w: w - 40, h: avail, size: ds, color: C.muted, name: nm });
    }
    if (c.layout === "flow" && i < n - 1) R({ x: x + w + 8, y: y + h / 2 - 14, w: 28, h: 28, shape: pres.shapes.RIGHT_ARROW, fill: C.or, name: nm });
  });
  // ② NA NATA LISBOA
  const nb = `A${2 + n}|rise|nata`;
  R({ x: 1192, y: 210, w: 600, h: 538, fill: C.or, ft: 93, line: C.or, lw: 1.25, dash: "dash", name: nb });
  mono(L2, { x: 1214, y: 226, w: 560, h: 30, color: C.phLabel, name: nb });
  T(c.nata.flatMap((it, k) => [
    { text: it.f ? "■  " : "+  ", options: { color: C.or, bold: true } },
    { text: it.f || it.p, options: { color: it.f ? C.text : C.ph, italic: !it.f, breakLine: k < c.nata.length - 1 } },
  ]), { x: 1214, y: 266, w: 556, h: 420, size: 22, psa: 9, name: nb });
  if (c.nata.some((it) => it.f)) mono("■ " + CONTENT.fonte, { x: 1214, y: 700, w: 560, h: 40, size: 16, cs: 0, color: C.dim, name: nb });
  // ③ NA PRÁTICA
  quote(128, 772, 1040, 146, "“" + c.quote + "”", "K1|rise|citacao", L3);
  R({ x: 1192, y: 772, w: 600, h: 146, line: C.dim, lw: 1.25, dash: "dash", name: `A${3 + n}|fade|exemplo` });
  mono(L3b, { x: 1214, y: 786, w: 560, h: 28, size: 18, cs: 1, name: `A${3 + n}|fade|exemplo` });
  T(c.example, { x: 1214, y: 820, w: 556, h: 88, size: 22, italic: true, color: C.ph, name: `A${3 + n}|fade|exemplo` });
  cur.addNotes(c.notes);
}

// ───────────────────────── 3. ROTEIRO
slide("CONTEUDO");
header("0.5", "// ROTEIRO · EM CADA TEMA: ① EM GERAL  ② NA NATA LISBOA  ③ NA PRÁTICA", ["O QUE VAMOS ", ["APRESENTAR"]]);
const roteiro = [
  ["1", "A entrevista", "Quem é Mônica Cardoso, como decorreu a conversa e como tratámos as respostas", 4],
  ["2", "Caracterização", "Identidade, atividade, dimensão e modelo de negócio da Nata Lisboa", 5],
  ["3", "Gestores e organizações", "O que é gerir, eficiência e eficácia, e as 3 características comuns", 6],
  ["4", "História da gestão", "Das abordagens clássica e comportamental às contemporâneas", 8],
  ["5", "Abordagem sistémica", "A Nata Lisboa como sistema aberto: inputs, processo, outputs e feedback", 9],
  ["6", "Ambiente externo", "Forças gerais e de tarefa e o grau de complexidade do ambiente", 10],
  ["7", "Cultura organizacional", "As 6 dimensões da cultura e como os colaboradores a aprendem", 13],
  ["8", "Os gestores", "Níveis de gestão, funções, papéis e competências da gerente", 15],
  ["9", "Desafios da gestão", "Diversidade, globalização e evolução tecnológica na Nata Lisboa", 17],
];
roteiro.forEach(([l, t, d, link], i) => {
  const x = 128 + (i % 3) * 560, y = 222 + Math.floor(i / 3) * 236, n = `A${i + 1}|rise|item${i}`;
  card(x, y, 544, 220, n);
  T(l, { x: x + 24, y: y + 14, w: 90, h: 100, font: F.serif, italic: true, size: 84, color: C.or, name: n });
  T(t, { x: x + 120, y: y + 26, w: 400, h: 44, size: 30, bold: true, name: n });
  T(d + "  →", { x: x + 120, y: y + 80, w: 400, h: 120, size: 23, color: C.muted, name: n });
  R({ x, y, w: 544, h: 220, fill: "FFFFFF", ft: 100, name: n, link });
});
cur.addNotes("ROTEIRO (≈20 s)\nNove temas, que cobrem as alíneas a) a g) do enunciado e os conteúdos dos Tópicos 1 e 2. Em cada tema seguimos sempre a mesma ordem: ① em geral (a teoria), ② na Nata Lisboa (a organização) e ③ na prática (citações e exemplos da Mônica, ao clique).\nNo modo de apresentação, clicar num cartão salta para o tema.");

// ───────────────────────── 4. ENTREVISTA
slide("CONTEUDO");
header("1", "// METODOLOGIA", ["A ", ["ENTREVISTA"]]);
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
quote(1072, 236, 720, 200, "“[Frase marcante da Mônica Cardoso, tal como foi dita.]”", "K1|rise|citacao", "FRASE MARCANTE DA ENTREVISTA");
card(1072, 480, 720, 330, "A11|rise|tratamento");
mono("TRATAMENTO DA INFORMAÇÃO", { x: 1100, y: 504, w: 660, h: 30, name: "A11|rise|tratamento" });
T([
  { text: "+  ", options: { color: C.or, bold: true } }, { text: "Gravação com consentimento: " }, { text: "sim", options: { bold: true, breakLine: true } },
  { text: "+  ", options: { color: C.or, bold: true } }, { text: "Transcrição revista pelo grupo", options: { breakLine: true } },
  { text: "+  ", options: { color: C.or, bold: true } }, { text: "Excertos organizados por bloco do guião", options: { breakLine: true } },
  { text: "+  ", options: { color: C.or, bold: true } }, { text: "Citações destacadas nas caixas creme" },
], { x: 1100, y: 550, w: 670, h: 240, size: 26, psa: 8, name: "A11|rise|tratamento" });
cur.addNotes("A ENTREVISTA (≈45 s)\nQuem foi entrevistada: Mônica Cardoso, gerente operacional da Nata Lisboa. Indicar data, duração e modalidade. Explicar que o guião foi organizado em blocos que correspondem aos temas da apresentação.\nClique: aparece a frase marcante da entrevista.");

section("Caracterização e Tópico 1");
t3("caracterizacao");
t3("gestao");
t3("caracteristicas");
section("Tópico 2 · História e abordagem sistémica");
t3("historia");
t3("sistema");
section("Ambiente externo");
t3("ambiente");
// ───────────────────────── 8. FORÇAS NA NATA LISBOA
slide("CONTEUDO");
header("6", "// AMBIENTE EXTERNO · FORÇA A FORÇA", ["FORÇAS NA ", ["NATA LISBOA"]]);
mono("② NA NATA LISBOA · FORÇAS DE TAREFA (IMPACTO DIRETO)", { x: 128, y: 210, w: 1500, h: 30, color: C.or, name: "A1|fade|lblTarefa" });
[["CLIENTES", "Quem compra.", "[Turistas, residentes, estudantes, empresas?]"], ["FORNECEDORES", "Quem fornece recursos.", "[Matérias-primas, embalagens, café, equipamento]"],
 ["CONCORRENTES", "Quem disputa os clientes.", "[Pastelarias e cadeias de pastéis de nata perto da loja]"], ["GRUPOS DE PRESSÃO", "Quem influencia de fora.", "[ASAE, câmara municipal, media, avaliações online]"]].forEach(([l, g, p], i) => {
  const x = 128 + i * 420, n = `A${2 + i}|rise|tarefa${i}`;
  card(x, 248, 404, 196, n);
  mono(l, { x: x + 22, y: 264, w: 360, h: 30, color: C.text, name: n });
  T(g, { x: x + 22, y: 298, w: 360, h: 32, size: 22, color: C.muted, name: n });
  T(p, { x: x + 22, y: 336, w: 360, h: 96, size: 23, italic: true, color: C.ph, name: n });
});
mono("② NA NATA LISBOA · FORÇAS GERAIS (IMPACTO INDIRETO)", { x: 128, y: 462, w: 1500, h: 30, color: C.muted, name: "A6|fade|lblGeral" });
[["ECONÓMICAS", "", "[Ex.: inflação, preço dos ovos e da energia, turismo]"],
 ["POLÍTICO-LEGAIS", "Regras de higiene e segurança alimentar; Livro de Reclamações Eletrónico.", "[Outras: leis laborais, IVA]"],
 ["SOCIOCULTURAIS", "", "[Ex.: hábitos de consumo, tradição do pastel de nata]"],
 ["DEMOGRÁFICAS", "", "[Ex.: turistas vs. residentes, faixa etária dos clientes]"],
 ["TECNOLÓGICAS", "Delivery pela Uber Eats e take away NATA&GO.", "[Outras: pagamentos, redes sociais]"],
 ["GLOBAIS", "Lojas em 5 países: Portugal, Espanha, Áustria, Alemanha e Angola.", "[Impacto do turismo na loja]"]].forEach(([l, f, p], i) => {
  const x = 128 + (i % 3) * 560, y = 500 + Math.floor(i / 3) * 140, n = `A${7 + i}|rise|geral${i}`;
  card(x, y, 544, 128, n);
  mono(l, { x: x + 22, y: y + 14, w: 500, h: 30, color: C.text, name: n });
  T(f ? [{ text: "■ " + f + " ", options: { color: C.text } }, { text: p, options: { italic: true, color: C.ph } }] : p,
    { x: x + 22, y: y + 48, w: 500, h: 72, size: 21, italic: !f, color: C.ph, name: n });
});
mono("■ " + CONTENT.fonte, { x: 128, y: 774, w: 1664, h: 26, size: 16, cs: 0, color: C.dim, name: "A12|fade|fonte" });
quote(128, 806, 1664, 112, "“[Excerto em que a Mônica fala de clientes, concorrência ou mercado.]”", "K1|rise|citacao", L3);
cur.addNotes("FORÇAS NA NATA LISBOA (≈1 min)\nTeoria no slide anterior; aqui fica o detalhe de cada força na Nata Lisboa. Os factos marcados com ■ vêm do site oficial; os textos [Ex.: …] são sugestões a confirmar com a entrevista.\nDestacar as 2 ou 3 forças com mais impacto, segundo a Mônica.\nClique: citação.");

// ───────────────────────── 9. COMPLEXIDADE
slide("CONTEUDO");
header("6", "// AMBIENTE EXTERNO", ["GRAU DE ", ["COMPLEXIDADE"]]);
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
mono(L1, { x: 1000, y: 210, w: 792, h: 30, color: C.or, name: "A6|fade|geral" });
T("A complexidade mede quantos componentes do ambiente afetam a organização; a mudança, a rapidez com que esses fatores se alteram. Juntos determinam a incerteza que os gestores enfrentam. Quanto maior a incerteza, mais os gestores precisam de informação, flexibilidade e decisões rápidas.",
  { x: 1000, y: 246, w: 792, h: 214, size: 24, name: "A6|fade|geral" });
R({ x: 1000, y: 470, w: 792, h: 214, fill: C.or, ft: 93, line: C.or, lw: 1.25, dash: "dash", name: "A7|rise|especifico" });
mono(L2, { x: 1020, y: 484, w: 752, h: 30, color: C.phLabel, name: "A7|rise|especifico" });
T([
  { text: "N.º de componentes: ", options: { bold: true, color: C.text } }, { text: "[poucos / muitos — quais?]", options: { italic: true, color: C.ph, breakLine: true } },
  { text: "Ritmo de mudança: ", options: { bold: true, color: C.text } }, { text: "[lento / rápido — porquê?]", options: { italic: true, color: C.ph, breakLine: true } },
  { text: "Conclusão: ", options: { bold: true, color: C.text } }, { text: "[Célula _ · incerteza ______]", options: { italic: true, color: C.ph } },
], { x: 1020, y: 524, w: 752, h: 150, size: 25, psa: 10, name: "A7|rise|especifico" });
quote(1000, 706, 792, 200, "“[Excerto em que a Mônica fala de mudanças no mercado ou na concorrência.]”", "K1|rise|citacao", "③ NA PRÁTICA · CITAÇÃO DA MÔNICA");
cur.addNotes("GRAU DE COMPLEXIDADE (≈45 s)\nEM GERAL: dois eixos — grau de mudança (estável ↔ dinâmico) e grau de complexidade (poucos ↔ muitos componentes). Da combinação resultam 4 células, da incerteza mais baixa (1) à mais elevada (4).\nNA NATA LISBOA: indicar em que célula fica e justificar com as forças do slide anterior. Sugestão: pintar a célula escolhida de laranja.\nClique: citação.");

// ───────────────────────── 10. CULTURA — 6 DIMENSÕES
section("Cultura organizacional");
slide("CONTEUDO");
header("7", "// TÓPICO 2 · CULTURA ORGANIZACIONAL", ["CULTURA: AS ", ["6 DIMENSÕES"]]);
mono(L1, { x: 128, y: 206, w: 400, h: 30, color: C.or, name: "A1|fade|intro" });
T("A cultura organizacional são os valores, crenças, tradições e formas de fazer partilhados que influenciam o modo como os membros pensam e agem — «a forma como as coisas se fazem aqui». Pode descrever-se em 6 dimensões, cada uma um contínuo entre dois polos (Hofstede et al., 1990).",
  { x: 128, y: 240, w: 1664, h: 72, size: 24, color: C.text, name: "A1|fade|intro" });
mono("POLO A", { x: 230, y: 324, w: 280, h: 30, size: 19, align: "right", name: "A1|fade|intro" });
mono("② POSIÇÃO NA NATA LISBOA", { x: 540, y: 324, w: 380, h: 30, size: 19, align: "center", cs: 0, color: C.phLabel, name: "A1|fade|intro" });
mono("POLO B", { x: 950, y: 324, w: 280, h: 30, size: 19, name: "A1|fade|intro" });
mono("③ EVIDÊNCIA · O QUE A MÔNICA DISSE", { x: 1260, y: 324, w: 520, h: 30, size: 19, cs: 0, color: C.phLabel, name: "A1|fade|intro" });
[["Processos", "Resultados"], ["Colaborador", "Tarefa"], ["Paroquial", "Profissional"],
 ["Sistema aberto", "Sistema fechado"], ["Controlo flexível", "Controlo apertado"], ["Normativa", "Pragmática"]].forEach(([a, b], i) => {
  const y = 360 + i * 88, n = `A${2 + i}|wipeL|dim${i + 1}`;
  card(128, y, 1664, 76, n);
  mono(`D${i + 1}`, { x: 150, y: y + 22, w: 60, h: 32, size: 24, color: C.or, name: n });
  T(a, { x: 210, y: y + 18, w: 300, h: 40, size: 26, bold: true, align: "right", name: n });
  R({ x: 550, y: y + 38, w: 360, h: 0, shape: pres.shapes.LINE, line: "6F8DC7", lw: 2, name: n });
  R({ x: 544, y: y + 32, w: 12, h: 12, shape: pres.shapes.OVAL, fill: "6F8DC7", name: n });
  R({ x: 904, y: y + 32, w: 12, h: 12, shape: pres.shapes.OVAL, fill: "6F8DC7", name: n });
  R({ x: 716, y: y + 24, w: 28, h: 28, shape: pres.shapes.OVAL, fill: C.or, line: "FFFFFF", lw: 1.5, name: n });
  T(b, { x: 950, y: y + 18, w: 290, h: 40, size: 26, bold: true, name: n });
  T("[O que observámos / o que foi dito]", { x: 1260, y: y + 18, w: 520, h: 40, size: 23, italic: true, color: C.ph, name: n });
});
T("↳ Arrastar cada ● para a posição da Nata Lisboa. Confirmar os nomes das 6 dimensões com o PDF do Tópico 2.",
  { x: 128, y: 894, w: 1664, h: 34, size: 21, italic: true, color: C.dim, name: "A8|fade|nota" });
cur.addNotes("CULTURA — 6 DIMENSÕES (≈1 min 15 s)\nEM GERAL: cultura organizacional = valores, crenças e práticas partilhadas. Modelo de 6 dimensões (Hofstede et al., 1990):\nD1 Processos ↔ Resultados: foco em \"como\" se faz vs. no resultado.\nD2 Colaborador ↔ Tarefa: preocupação com as pessoas vs. apenas com o trabalho feito.\nD3 Paroquial ↔ Profissional: identidade ligada à empresa vs. à profissão.\nD4 Sistema aberto ↔ fechado: facilidade de integrar pessoas novas.\nD5 Controlo flexível ↔ apertado: rigor com custos, horários, regras.\nD6 Normativa ↔ Pragmática: seguir regras vs. orientar-se para o cliente.\nNA NATA LISBOA: posição (●) e evidência de cada dimensão, com base no que a Mônica disse.\nSe o PDF do Tópico 2 usar outras dimensões, trocar os nomes dos polos.");

t3("aprendizagem");
// ───────────────────────── 12. NÍVEIS DE GESTÃO
section("Os gestores");
slide("CONTEUDO");
header("8", "// TÓPICO 1 · OS GESTORES", ["NÍVEIS DE ", ["GESTÃO"]]);
mono(L1, { x: 128, y: 206, w: 400, h: 30, color: C.or, name: "A1|fade|intro" });
T("Numa estrutura tradicional (piramidal), os gestores distribuem-se por três níveis. Quanto mais alto o nível, mais as decisões são estratégicas e de longo prazo; quanto mais baixo, mais operacionais e do dia a dia.",
  { x: 128, y: 240, w: 1664, h: 72, size: 24, name: "A1|fade|intro" });
cur.addImage({ path: "pyramid.png", x: I(168), y: I(330), w: I(560), h: I(472), altText: "Pirâmide com os três níveis de gestão: topo, intermédia e primeira linha", objectName: "A2|zoom|piramide" });
T("TOPO", { x: 388, y: 410, w: 120, h: 36, size: 26, bold: true, color: C.bg, align: "center", name: "A2|zoom|piramide" });
T("INTERMÉDIA", { x: 268, y: 530, w: 360, h: 36, size: 28, bold: true, align: "center", name: "A2|zoom|piramide" });
T("PRIMEIRA LINHA", { x: 223, y: 684, w: 450, h: 36, size: 28, bold: true, align: "center", name: "A2|zoom|piramide" });
T([{ text: "OPERACIONAIS: ", options: { color: C.muted } }, { text: "[n.º aprox.]", options: { color: C.ph, italic: true } }],
  { x: 128, y: 806, w: 640, h: 32, size: 21, font: F.mono, align: "center", name: "A2|zoom|piramide" });
[["GESTÃO DE TOPO", "Decisões estratégicas: missão, objetivos e políticas para toda a organização.", [{ text: "② ", options: { color: C.or, bold: true } }, { text: "[Quem são na Nata Lisboa: sede / franchisado]", options: { italic: true, color: C.ph } }]],
 ["GESTÃO INTERMÉDIA", "Traduzem a estratégia em planos e coordenam outros gestores.", [{ text: "② ", options: { color: C.or, bold: true } }, { text: "Mônica Cardoso", options: { bold: true, color: C.text } }, { text: " — Gerente Operacional ", options: { color: C.text } }, { text: "[confirmar]", options: { italic: true, color: C.ph } }]],
 ["PRIMEIRA LINHA", "Dirigem o trabalho diário dos colaboradores operacionais.", [{ text: "② ", options: { color: C.or, bold: true } }, { text: "[Ex.: responsáveis de turno]", options: { italic: true, color: C.ph } }]]].forEach(([l, g, p], i) => {
  const y = 330 + i * 148, n = `A${3 + i}|rise|nivel${i}`;
  card(840, y, 952, 134, n, i === 1 ? C.card2 : C.card);
  mono(l, { x: 868, y: y + 14, w: 900, h: 30, color: i === 0 ? C.or : C.muted, name: n });
  T(g, { x: 868, y: y + 46, w: 900, h: 36, size: 23, name: n });
  T(p, { x: 868, y: y + 86, w: 900, h: 36, size: 23, name: n });
});
T([{ text: "② Estrutura: ", options: { bold: true } }, { text: "[Tradicional (piramidal) ou outra? Justificar]", options: { italic: true, color: C.ph } }],
  { x: 840, y: 778, w: 952, h: 60, size: 23, valign: "middle", margin: 7, line: C.dim, dash: "dash", name: "A6|fade|estrutura" });
quote(128, 850, 1664, 76, "“[Como a Mônica descreve o seu lugar na hierarquia.]”", "K1|rise|citacao", L3);
cur.addNotes("NÍVEIS DE GESTÃO (≈45 s)\nEM GERAL: gestão de topo (decisões estratégicas), gestão intermédia (planos táticos, coordena gestores) e gestão de primeira linha (supervisiona o trabalho operacional). Na base estão os operacionais, que não gerem ninguém.\nNA NATA LISBOA: situar a Mônica Cardoso — como gerente operacional, provavelmente gestão intermédia (confirmar se gere outros gestores ou diretamente a equipa).\nClique: citação.");

t3("funcoes");
section("Desafios");
t3("desafios");
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
quote(1260, 540, 532, 300, "“[Frase final da entrevista para fechar a apresentação.]”", "K1|rise|citacao", "③ CITAÇÃO · MÔNICA CARDOSO");
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
