/* OCEANUM · DOMINUS · PERSONAGEM
   Sem monstros, sem combate. O jogo é só a tua ficha: atributos, nível, classe e título.
   Tudo sobe apenas com o que fazes na vida real (registado no Oceanum) e com os marcos que provas. */
(() => {
'use strict';
const U = OS.U, UI = OS.UI, esc = U.esc, A = OS.act, V = OS.views, D = OS.Dom;
const S = () => OS.one('dominus'), save = () => OS.touch('dominus'), today = () => U.today();
const PK = D.PK, P = D.P, RANKS = D.RANKS, LEG = D.LEG;
const ic = (n, c = '') => UI.ic(n, c);
const safe = (f, d = 0) => { try { return f(); } catch (e) { return d; } };
const COL = { int: '#6F8FC4', for: '#C9A25E', cor: '#C0584A', inf: '#9A78C4' };

/* ================= ATRIBUTOS (vêm do histórico real, nunca se compram) ================= */
const sc = (raw, cap) => Math.round(99 * Math.sqrt(Math.min(Math.max(raw, 0), cap) / cap));
const stats = () => {
  const all = k => safe(() => OS.all(k), []);
  const studyH = U.sum(all('sessions'), s => s.minutes) / 60;
  const reviews = all('reviews').reduce((a, r) => a + [r.r1At, r.r2At, r.r3At].filter(Boolean).length, 0);
  const notes = all('notes').length;
  const wk = all('workouts').length, km = U.sum(all('runs'), r => U.num(r.km));
  const streak = safe(() => OS.Hab.perfectStreak()), s = S(); s.bestStreak = Math.max(s.bestStreak || 0, streak);
  const txs = all('transactions');
  const saved = U.sum(txs.filter(t => t.type === 'Transferência' && OS.Fin.isInvestAcc(t.toAccount) && !OS.Fin.isInvestAcc(t.account)), t => t.amount) + U.sum(all('invtx').filter(t => t.type === 'Compra'), t => U.num(t.qty) * U.num(t.price));
  const byDay = {}; txs.forEach(t => { const x = byDay[t.date] || (byDay[t.date] = { n: 0, sup: 0 }); x.n++; if (t.type === 'Despesa' && t.ess === 'Supérfluo') x.sup = 1; });
  const prud = U.lastN(60).filter(d => byDay[d] && !byDay[d].sup).length;
  const vis = Array.from({ length: 12 }, (_, i) => U.addMonths(U.ym(today()), -i - 1)).filter(m => safe(() => { const f = OS.Fin.month(m); return f.n && f.net > 0; }, false)).length;
  const contacts = all('contacts').length, apps = all('applications').filter(a => a.status !== 'Por enviar').length;
  const lead = all('mvclients').length + all('tasks').filter(t => t.doneAt && (['Profissional', 'Empresarial'].includes((OS.get('projects', t.project) || {}).type) || ['Carreira', 'Trabalho', 'Mova'].includes(t.area))).length;
  return {
    int: [['Foco', sc(studyH, 1000), `${U.nf(studyH, 0)} h de estudo`], ['Memória', sc(reviews, 1500), `${reviews} revisões`], ['Conhecimento', sc(notes, 500), `${notes} notas`]],
    cor: [['Força', sc(wk, 500), `${wk} treinos`], ['Resistência', sc(km, 2000), `${U.nf(km, 0)} km corridos`], ['Disciplina', sc(s.bestStreak, 365), `melhor sequência: ${s.bestStreak} dias`]],
    for: [['Riqueza', sc(saved, 50000), `${U.eur(saved, { dec: 0 })} poupados/investidos`], ['Prudência', sc(prud, 60), `${prud}/60 dias limpos`], ['Visão', sc(vis, 12), `${vis}/12 meses com superávit`]],
    inf: [['Carisma', sc(contacts, 300), `${contacts} pessoas na rede`], ['Alcance', sc(apps, 100), `${apps} candidaturas`], ['Liderança', sc(lead, 300), `${lead} entregas profissionais`]],
    raw: { studyH, reviews, notes, wk, km, streak: s.bestStreak, saved, prud, vis, contacts, apps, lead } };
};

/* ================= CLASSE (nasce do teu equilíbrio real) ================= */
const PURE = { int: ['Aprendiz', 'Estudioso', 'Sábio', 'Arquimago'], cor: ['Lutador', 'Guerreiro', 'Gladiador', 'Titã'], for: ['Poupador', 'Mercador', 'Banqueiro', 'Rei Midas'], inf: ['Mensageiro', 'Diplomata', 'Líder', 'Imperador'] };
const HYB = { 'cor|int': ['Noviço', 'Monge', 'Asceta', 'Iluminado'], 'for|int': ['Calculista', 'Estratega', 'Visionário', 'Oráculo'], 'inf|int': ['Orador', 'Filósofo', 'Conselheiro', 'Profeta'], 'cor|for': ['Caçador', 'Mercenário', 'Conquistador', 'Senhor da Guerra'], 'cor|inf': ['Escudeiro', 'Cavaleiro', 'Comandante', 'Herói'], 'for|inf': ['Negociante', 'Embaixador', 'Mecenas', 'Príncipe Mercador'] };
const BAL = ['Andarilho', 'Polímata', 'Renascentista', 'Arconte'];
const FAM_TX = { int: 'A mente manda. Estudas mais do que tudo o resto.', cor: 'O corpo manda. Treino e resistência acima de tudo.', for: 'O dinheiro manda. Registas, poupas e investes.', inf: 'As pessoas mandam. Rede, candidaturas, liderança.', bal: 'Nenhum pilar domina: estás a crescer em tudo por igual.' };
const TIER_AT = [4, 14, 34, 64], ROM = ['I', 'II', 'III', 'IV'];
const klass = () => {
  const L = D.sumLv(), lv = PK.map(p => [p, D.lv(p)]).sort((a, b) => b[1] - a[1]);
  if (L < TIER_AT[0]) return { id: 'aspirante', n: 'Aspirante', fam: null, names: null, tier: -1, tx: 'Ainda sem classe. Os primeiros níveis revelam quem és.', col: '#C9A25E' };
  const tier = TIER_AT.filter(t => L >= t).length - 1;
  let fam, names, col, tx;
  if (lv[0][1] - lv[3][1] <= 2 && L >= 8) { fam = 'bal'; names = BAL; col = '#E8D3A8'; tx = FAM_TX.bal; }
  else if (lv[0][1] - lv[1][1] <= 1 && lv[1][1] - lv[2][1] >= 2) { fam = [lv[0][0], lv[1][0]].sort().join('|'); names = HYB[fam]; col = `color-mix(in srgb,${COL[lv[0][0]]} 50%,${COL[lv[1][0]]})`; tx = `Dois pilares à frente, lado a lado: ${P[lv[0][0]].n} e ${P[lv[1][0]].n}.`; }
  else { fam = lv[0][0]; names = PURE[fam]; col = COL[fam]; tx = FAM_TX[fam]; }
  return { id: fam + ':' + tier, n: names[tier], fam, names, tier, tx, col };
};

/* ================= TÍTULOS (só vida real) ================= */
const legN = () => D.legacyCount(), achN = () => Object.keys(S().cach || {}).length, minLv = () => Math.min(...PK.map(D.lv));
D.reqs = r => { const L = D.sumLv(), s = S(), best = s.bestStreak || 0;
  return ({ 1: [['Nível total 4', L >= 4]],
    2: [['Nível total 10', L >= 10], ['1 marco do Codex provado', legN() >= 1]],
    3: [['Nível total 18', L >= 18], ['Todos os pilares no nível 2', minLv() >= 2], ['3 conquistas', achN() >= 3], ['5 favos na colmeia', favN() >= 5]],
    4: [['Nível total 28', L >= 28], ['3 marcos do Codex', legN() >= 3], ['7 dias perfeitos seguidos (alguma vez)', best >= 7]],
    5: [['Nível total 40', L >= 40], ['Todos os pilares no nível 6', minLv() >= 6], ['6 marcos do Codex', legN() >= 6], ['15 favos na colmeia', favN() >= 15]],
    6: [['Nível total 55', L >= 55], ['10 marcos do Codex', legN() >= 10], ['10 conquistas', achN() >= 10]],
    7: [['Nível total 75', L >= 75], ['35 favos na colmeia', favN() >= 35], ['Todos os pilares no nível 12', minLv() >= 12], ['16 marcos do Codex', legN() >= 16], ['30 dias perfeitos seguidos', best >= 30]],
    8: [['Nível total 100', L >= 100], ['25 marcos, pelo menos 5 em cada pilar', legN() >= 25 && PK.every(p => (s.legacy[p] || []).length >= 5)], ['60 dias perfeitos seguidos', best >= 60], ['20 conquistas', achN() >= 20], ['Um favo-mestre', Object.keys(hive().own).some(k => HX[k] && HX[k].t === 'key')]] })[r] || [];
};
D.canAscend = () => S().rank < 8 && D.reqs(S().rank + 1).every(x => x[1]);
const RANK_TX = ['Quem começa do zero.', 'Deu o primeiro passo e não parou.', 'Já opera em todos os pilares.', 'Planeia antes de agir.', 'Faz o que diz. Sem desculpas.', 'Constrói sistemas que funcionam sozinhos.', 'Os resultados acumulam-se.', 'Governa a própria vida.', 'Domínio total. O topo.'];

/* ================= CONQUISTAS DA VIDA ================= */
const TIER = ['', 'Bronze', 'Prata', 'Ouro', 'Platina', 'Lendária'], TXP = [0, 60, 180, 450, 1100, 2600];
const CA = [
  ['c_start', 'Primeiro passo', 'Ganha XP pela primeira vez.', 1, 'all', () => PK.some(p => (S().xp[p] || 0) > 0)],
  ['c_h10', 'Mente acesa', '10 horas de estudo.', 1, 'int', r => r.studyH >= 10], ['c_h50', 'Estudioso', '50 horas de estudo.', 2, 'int', r => r.studyH >= 50], ['c_h200', 'Erudito', '200 horas de estudo.', 3, 'int', r => r.studyH >= 200], ['c_h1000', 'Mil horas', '1000 horas de estudo.', 5, 'int', r => r.studyH >= 1000],
  ['c_rev100', 'Memória de ferro', '100 revisões feitas.', 2, 'int', r => r.reviews >= 100], ['c_notes50', 'Arquivista', '50 notas guardadas.', 2, 'int', r => r.notes >= 50],
  ['c_wk10', 'Suor', '10 treinos.', 1, 'cor', r => r.wk >= 10], ['c_wk50', 'Forjado', '50 treinos.', 2, 'cor', r => r.wk >= 50], ['c_wk150', 'Ferro', '150 treinos.', 3, 'cor', r => r.wk >= 150], ['c_wk365', 'Um ano de ferro', '365 treinos.', 4, 'cor', r => r.wk >= 365],
  ['c_km50', 'Estrada', '50 km corridos.', 1, 'cor', r => r.km >= 50], ['c_km250', 'Fundista', '250 km corridos.', 2, 'cor', r => r.km >= 250], ['c_km1000', 'Mil quilómetros', '1000 km corridos.', 4, 'cor', r => r.km >= 1000],
  ['c_st7', 'Semana perfeita', '7 dias perfeitos seguidos.', 2, 'all', r => r.streak >= 7], ['c_st30', 'Mês perfeito', '30 dias perfeitos seguidos.', 3, 'all', r => r.streak >= 30], ['c_st100', 'Centenário', '100 dias perfeitos seguidos.', 5, 'all', r => r.streak >= 100],
  ['c_sv500', 'Primeira reserva', '500 € poupados ou investidos.', 1, 'for', r => r.saved >= 500], ['c_sv5k', 'Cofre', '5 000 € poupados ou investidos.', 3, 'for', r => r.saved >= 5000], ['c_sv25k', 'Patrimônio', '25 000 € poupados ou investidos.', 4, 'for', r => r.saved >= 25000],
  ['c_prud30', 'Sem impulsos', '30 dos últimos 60 dias registados sem supérfluo.', 2, 'for', r => r.prud >= 30], ['c_vis6', 'No verde', '6 meses com superávit no último ano.', 3, 'for', r => r.vis >= 6],
  ['c_ct10', 'Rede', '10 pessoas na rede.', 1, 'inf', r => r.contacts >= 10], ['c_ct50', 'Ponte', '50 pessoas na rede.', 3, 'inf', r => r.contacts >= 50], ['c_ap5', 'Bater à porta', '5 candidaturas enviadas.', 1, 'inf', r => r.apps >= 5], ['c_ap25', 'Persistente', '25 candidaturas enviadas.', 3, 'inf', r => r.apps >= 25], ['c_ld50', 'Entrega', '50 entregas profissionais.', 3, 'inf', r => r.lead >= 50],
  ['c_leg1', 'Primeiro marco', 'Prova um marco do Codex.', 1, 'all', () => legN() >= 1], ['c_leg10', 'Legado', '10 marcos do Codex.', 3, 'all', () => legN() >= 10], ['c_leg50', 'Lenda viva', '50 marcos do Codex.', 5, 'all', () => legN() >= 50],
  ['c_all5', 'Equilíbrio', 'Todos os pilares no nível 5.', 2, 'all', () => minLv() >= 5], ['c_all15', 'Harmonia', 'Todos os pilares no nível 15.', 4, 'all', () => minLv() >= 15],
  ['c_full', 'Dia completo', 'Num só dia: 60 min de estudo, treino ou corrida, registo financeiro e contacto com alguém.', 3, 'all', () => U.lastN(60).some(d => { const x = D.input(d); return x.mins >= 60 && (x.wk || x.km) && x.tx && (x.contacts || x.apps); })],
  ['c_ch1', 'Desafiado', 'Cumpre o primeiro desafio.', 1, 'all', () => (S().chN || 0) >= 1], ['c_ch50', 'Imparável', '50 desafios cumpridos.', 3, 'all', () => (S().chN || 0) >= 50], ['c_ch200', 'Lenda dos desafios', '200 desafios cumpridos.', 4, 'all', () => (S().chN || 0) >= 200],
  ['c_hv10', 'Apicultor', '10 favos na colmeia.', 2, 'all', () => favN() >= 10], ['c_hvkey', 'Favo-mestre', 'Conquista um favo-mestre.', 4, 'all', () => Object.keys(hive().own).some(k => HX[k] && HX[k].t === 'key')],
  ['c_diet7', 'Prato limpo', 'Regista a dieta 7 dias seguidos.', 2, 'cor', () => safe(() => OS.Diet.streak(), 0) >= 7],
  ['c_dominus', 'Dominus', 'Alcança o título Dominus.', 5, 'all', () => S().rank >= 8]];
const giveXP = (pil, n) => { const s = S(); if (pil === 'all') PK.forEach(p => s.xp[p] = (s.xp[p] || 0) + Math.round(n / 4)); else s.xp[pil] = (s.xp[pil] || 0) + n; };
const clog = (t, k = '') => { const s = S(); s.cchron = [{ d: today(), t, k }].concat(s.cchron || []).slice(0, 200); };
const rngOf = seed => U.rng(String(seed));

/* ================= COLMEIA: favos de atributos ================= */
const HR = 4, SQ3 = Math.sqrt(3);
const HEXES = []; for (let q = -HR; q <= HR; q++) for (let r = Math.max(-HR, -q - HR); r <= Math.min(HR, -q + HR); r++) HEXES.push({ q, r, k: q + ',' + r, ring: (Math.abs(q) + Math.abs(r) + Math.abs(q + r)) / 2, x: SQ3 * (q + r / 2), y: 1.5 * r });
const SEC_C = { int: 90, for: 0, cor: -90, inf: 180 };
const angOf = h => { let a = Math.atan2(-h.y, h.x) * 180 / Math.PI + .01; return a; };
const secOf = h => { const a = angOf(h); return a >= 45 && a < 135 ? 'int' : a >= -45 && a < 45 ? 'for' : a >= -135 && a < -45 ? 'cor' : 'inf'; };
const adist = (a, b) => { let d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
const NOTA = { int: ['Leitor Voraz', 'Memória Fotográfica', 'Mente Afiada'], cor: ['Pulmões de Aço', 'Força Bruta', 'Recuperação Rápida'], for: ['Olho para Negócios', 'Cofre Blindado', 'Juros Compostos'], inf: ['Presença', 'Rede de Contactos', 'Palavra Firme'] };
const KEY = { int: ['Arquimente', 'Desafios de Intelecto dão +1 Mel e +15% XP em Intelecto.'], cor: ['Corpo de Titã', 'Desafios de Corpo dão +1 Mel e +15% XP em Corpo.'], for: ['Toque de Midas', 'Desafios de Fortuna dão +1 Mel e +15% XP em Fortuna.'], inf: ['Voz do Soberano', 'Desafios de Influência dão +1 Mel e +15% XP em Influência.'] };
const SUBN = { int: ['Foco', 'Memória', 'Conhecimento'], cor: ['Força', 'Resistência', 'Disciplina'], for: ['Riqueza', 'Prudência', 'Visão'], inf: ['Carisma', 'Alcance', 'Liderança'] };
(() => { PK.forEach(p => { const mine = HEXES.filter(h => h.ring && secOf(h) === p); mine.forEach(h => h.p = p);
  [1, 2, 3, 4].forEach(ring => { const hs = mine.filter(h => h.ring === ring).sort((a, b) => adist(angOf(a), SEC_C[p]) - adist(angOf(b), SEC_C[p]));
    hs.forEach((h, i) => { if (ring === 4 && i === 0) h.t = 'key'; else if ((ring === 4 && i <= 2) || (ring === 3 && i === 0)) h.t = 'not'; else if ((ring === 2 && i === 0) || (ring === 3 && i % 2 === 1) || (ring === 4 && i % 2 === 1)) h.t = 'med'; else h.t = 'sml'; }); });
  let si = 0, ni = 0; mine.sort((a, b) => a.ring - b.ring || adist(angOf(a), SEC_C[p]) - adist(angOf(b), SEC_C[p])).forEach(h => { if (h.t === 'sml') { h.sub = si % 3; si++; } if (h.t === 'not') { h.nm = NOTA[p][ni % 3]; ni++; } }); }); })();
const HX = Object.fromEntries(HEXES.map(h => [h.k, h]));
const COST = { sml: 1, med: 2, not: 3, key: 5 };
const hexName = h => !h.ring ? 'Tu' : h.t === 'key' ? KEY[h.p][0] : h.t === 'not' ? h.nm : h.t === 'med' ? `Afinco · ${P[h.p].n}` : SUBN[h.p][h.sub];
const hexFx = h => !h.ring ? 'O centro da colmeia. Tudo começa aqui.' : h.t === 'key' ? KEY[h.p][1] : h.t === 'not' ? `+8% XP em ${P[h.p].n} e +4 em todos os atributos do pilar.` : h.t === 'med' ? `+4% XP em ${P[h.p].n}.` : `+3 ${SUBN[h.p][h.sub]}.`;
const hive = () => { const s = S(); s.hive = s.hive || { own: { '0,0': today() }, mel: 0, melTot: 0 }; return s.hive; };
const NB = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
const canTake = h => { const o = hive().own; return h.ring && !o[h.k] && NB.some(([a, b]) => o[(h.q + a) + ',' + (h.r + b)]); };
const favN = () => Object.keys(hive().own).length - 1;
const hiveFx = () => { const o = hive().own, fx = { st: Object.fromEntries(PK.map(p => [p, [0, 0, 0]])), xp: Object.fromEntries(PK.map(p => [p, 0])), mel: Object.fromEntries(PK.map(p => [p, 0])) };
  Object.keys(o).forEach(k => { const h = HX[k]; if (!h || !h.ring) return; if (h.t === 'sml') fx.st[h.p][h.sub] += 3; if (h.t === 'med') fx.xp[h.p] += 4; if (h.t === 'not') { fx.xp[h.p] += 8; fx.st[h.p] = fx.st[h.p].map(v => v + 4); } if (h.t === 'key') { fx.xp[h.p] += 15; fx.mel[h.p] += 1; } }); return fx; };
const takeHex = (k, free) => { const h = HX[k], hv = hive(); if (!h || !canTake(h)) return false; if (!free) { if (hv.mel < COST[h.t]) return false; hv.mel -= COST[h.t]; } hv.own[k] = today(); clog(`Favo ${free ? 'conquistado automaticamente' : 'conquistado'}: ${hexName(h)} (${P[h.p].n}).`, h.p); return true; };
const autoHex = p => { const c = HEXES.filter(h => h.p === p && canTake(h)).sort((a, b) => COST[a.t] - COST[b.t] || a.ring - b.ring)[0]; if (c) { takeHex(c.k, true); return hexName(c); } const hv = hive(); hv.mel++; hv.melTot++; return null; };

/* ================= DESAFIOS DA VIDA REAL (verificados sozinhos) ================= */
const dw = d => safe(() => OS.Diet.day(d).water, 0), dwg = () => U.num(safe(() => OS.one('diet').water, 0)) || 2000;
const DCH = [
  ['i45', 'int', 'Estuda 45 minutos', x => [x.mins, 45]], ['i90', 'int', 'Estuda 90 minutos', x => [x.mins, 90]], ['irev', 'int', 'Faz 2 revisões', x => [x.revs, 2]], ['inote', 'int', 'Guarda uma nota do que aprendeste', x => [x.notes, 1]],
  ['cwk', 'cor', 'Treina hoje', x => [x.wk, 1]], ['ckm', 'cor', 'Corre 3 km', x => [U.r1(x.km), 3]], ['cmeal', 'cor', 'Regista 3 refeições', x => [x.meals, 3]], ['cprot', 'cor', 'Bate a meta de proteína', x => [x.prot ? 1 : 0, 1]], ['cwat', 'cor', 'Bebe a meta de água', (x, d) => [Math.round(dw(d) / 100) / 10, Math.round(dwg() / 100) / 10]], ['chab', 'cor', 'Cumpre todos os inegociáveis', x => [x.habit === 1 ? 1 : 0, 1]],
  ['ftx', 'for', 'Regista os movimentos do dia', x => [x.tx ? 1 : 0, 1]], ['fsup', 'for', 'Dia registado sem supérfluos', x => [x.tx && !x.sup ? 1 : 0, 1]], ['fsave', 'for', 'Poupa ou investe alguma coisa', x => [x.save > 0 ? 1 : 0, 1]],
  ['nct', 'inf', 'Fala com uma pessoa da tua rede', x => [x.contacts, 1]], ['napp', 'inf', 'Envia uma candidatura', x => [x.apps, 1]], ['npro', 'inf', 'Conclui 2 tarefas profissionais', x => [x.pro, 2]], ['ntask', 'inf', 'Conclui 5 tarefas', x => [x.tasks, 5]]];
const WCH = [
  ['wi6', 'int', 'Estuda 6 horas esta semana', X => [U.r1(U.sum(X, x => x.mins) / 60), 6]], ['wrev', 'int', '10 revisões esta semana', X => [U.sum(X, x => x.revs), 10]],
  ['wwk', 'cor', 'Treina 3 vezes esta semana', X => [U.sum(X, x => x.wk), 3]], ['wkm', 'cor', 'Corre 12 km esta semana', X => [U.r1(U.sum(X, x => x.km)), 12]], ['wmeal', 'cor', 'Regista a dieta em 5 dias', X => [X.filter(x => x.meals).length, 5]], ['whab', 'cor', '4 dias perfeitos', X => [X.filter(x => x.habit === 1).length, 4]],
  ['wtx', 'for', 'Registo financeiro em 6 dias', X => [X.filter(x => x.tx).length, 6]], ['wsup', 'for', '5 dias sem supérfluos', X => [X.filter(x => x.tx && !x.sup).length, 5]],
  ['wct', 'inf', 'Fala com 4 pessoas', X => [U.sum(X, x => x.contacts), 4]], ['wapp', 'inf', 'Envia 3 candidaturas', X => [U.sum(X, x => x.apps), 3]], ['wpro', 'inf', '8 tarefas profissionais', X => [U.sum(X, x => x.pro), 8]]];
const pick3 = (pool, seed) => { const r = rngOf(seed), order = PK.slice().sort(() => r() - .5).slice(0, 3); return order.map(p => { const c = pool.filter(x => x[1] === p); return c[Math.floor(r() * c.length)]; }).filter(Boolean); };
const daily = (d = today()) => pick3(DCH, 'dch' + d).map(c => { const x = D.input(d), [v, t] = c[3](x, d); return { id: c[0], p: c[1], t: c[2], v: v || 0, g: t, ok: (v || 0) >= t, key: 'd:' + d + ':' + c[0] }; });
const weekly = () => { const wk = U.monday(today()), days = U.range(wk, today()), X = days.map(D.input); return pick3(WCH, 'wch' + wk).map(c => { const [v, t] = c[3](X); return { id: c[0], p: c[1], t: c[2], v: v || 0, g: t, ok: (v || 0) >= t, key: 'w:' + wk + ':' + c[0], wk: 1 }; }); };

/* ================= RECOMPENSAS: 2 opções à escolha, aprendidas dos teus gostos ================= */
const TIERN = ['', 'Pequena', 'Média', 'Grande'];
const POOL0 = [[1, 'Café especial ou doce favorito', 'comida'], [1, 'Um açaí', 'comida'], [1, 'Um episódio da série, sem culpa', 'lazer'], [1, 'Uma hora de jogo', 'lazer'], [1, 'Dormir até mais tarde', 'descanso'], [1, 'O teu snack favorito', 'comida'], [1, 'Banho longo com música', 'cuidado'], [1, 'Passeio sem telemóvel', 'descanso'],
  [2, 'Comprar um livro', 'compras'], [2, 'Jantar fora', 'comida'], [2, 'Cinema', 'lazer'], [2, 'Roupa de treino nova', 'compras'], [2, 'Pizza ou hambúrguer à escolha', 'comida'], [2, 'Tarde livre sem culpa', 'descanso'], [2, 'Massagem', 'cuidado'], [2, 'Um jogo novo', 'lazer'],
  [3, 'Sapatilhas novas', 'compras'], [3, 'Viagem de fim de semana', 'experiência'], [3, 'Concerto ou jogo ao vivo', 'experiência'], [3, 'Aquele gadget que queres', 'compras'], [3, 'Um dia inteiro livre', 'descanso'], [3, 'Um curso que queres fazer', 'experiência']];
const rw = () => { const s = S(); if (!s.rwv2) { s.rwv2 = { pool: POOL0.map(([tier, t, cat], i) => ({ id: 'p' + i, t, tier, cat, w: 1 })), pend: [], got: [] };
    const seen = new Set(s.rwv2.pool.map(x => x.t.toLowerCase())); OS.all('rewards').forEach(r => { const t = (r.title || '').trim(); if (t && !seen.has(t.toLowerCase())) { seen.add(t.toLowerCase()); s.rwv2.pool.push({ id: 'u' + U.uid(), t, tier: 2, cat: 'teu', w: 1.5 }); } else if (t) { const x = s.rwv2.pool.find(y => y.t.toLowerCase() === t.toLowerCase()); if (x) x.w = 1.5; } }); }
  return s.rwv2; };
const wpick = (arr, r) => { const tot = U.sum(arr, x => x.w); let v = r() * tot; for (const x of arr) { v -= x.w; if (v <= 0) return x; } return arr[arr.length - 1]; };
const offer = (tier, why) => { const R = rw(), r = Math.random, recent = new Set(R.got.slice(0, 4).map(g => g.pid));
  let c = R.pool.filter(x => x.w > 0 && x.tier === tier && !recent.has(x.id)); if (c.length < 2) c = R.pool.filter(x => x.w > 0 && x.tier === tier); if (c.length < 2) c = R.pool.filter(x => x.w > 0); if (c.length < 2) return null;
  const a = wpick(c, r), rest = c.filter(x => x.id !== a.id && x.cat !== a.cat), b = wpick(rest.length ? rest : c.filter(x => x.id !== a.id), r);
  const o = { id: U.uid(), tier, why, d: today(), opts: [a.id, b.id] }; R.pend.unshift(o); return o; };
const choose = (oid, pid) => { const R = rw(), o = R.pend.find(x => x.id === oid); if (!o) return; const it = R.pool.find(x => x.id === pid); if (!it) return;
  o.opts.forEach(id => { const x = R.pool.find(y => y.id === id); if (!x) return; x.w = id === pid ? Math.min(5, x.w + .5) : Math.max(.2, x.w - .15); });
  R.pend = R.pend.filter(x => x.id !== oid); R.got.unshift({ id: U.uid(), pid, t: it.t, tier: o.tier, why: o.why, d: today(), used: '' }); R.got = R.got.slice(0, 120); clog(`Recompensa escolhida: ${it.t} (${o.why}).`, 'gold'); save(); };
const reroll = (oid, pid) => { const R = rw(), o = R.pend.find(x => x.id === oid), x = R.pool.find(y => y.id === pid); if (!o || !x) return; x.w = 0;
  const c = R.pool.filter(y => y.w > 0 && y.tier === o.tier && !o.opts.includes(y.id)); const n = c.length ? wpick(c, Math.random) : R.pool.find(y => y.w > 0 && !o.opts.includes(y.id)); if (n) o.opts = o.opts.map(id => id === pid ? n.id : id); save(); };
const optCard = (o, pid) => { const x = rw().pool.find(y => y.id === pid); return x ? `<div class="ch-opt"><button class="ch-optb" data-act="rwChoose" data-o="${o.id}" data-p="${pid}"><small class="cz">${esc(x.cat)}</small><b>${esc(x.t)}</b></button><button class="ch-no" data-act="rwNo" data-o="${o.id}" data-p="${pid}" title="Não é para mim: nunca mais sugerir">não é para mim</button></div>` : ''; };

/* ================= MOTOR ================= */
let queue = [];
const LVMSG = ['O esforço de hoje ficou gravado.', 'Mais forte do que ontem.', 'Isto foi conquistado, não oferecido.', 'Continua assim.', 'Um passo mais perto de Dominus.', 'A disciplina está a pagar.'];
const sync = st => { const s = S(); if (!s.started) return; const before = JSON.stringify([s.xp, s.cach, s.cLv, s.cls, s.bestStreak, s.hive, s.chDone, s.rwv2]);
  s.cach = s.cach || {}; s.chDone = s.chDone || {}; const fx = hiveFx(), hv = hive();
  D.window().forEach(d => { const G = D.gains(d), c = s.credited[d] || { g: {}, xp: {}, en: 0 }, xp = Object.assign({}, c.xp || {});
    PK.forEach(p => { const dv = (G.xp[p] || 0) - (xp[p] || 0); if (dv > 0) { s.xp[p] = (s.xp[p] || 0) + dv + Math.round(dv * fx.xp[p] / 100); xp[p] = G.xp[p]; } });
    s.credited[d] = Object.assign({}, c, { xp }); });
  Object.keys(s.credited).forEach(d => { if (d < U.addDays(today(), -12)) delete s.credited[d]; });
  // desafios
  const Dc = daily(), Wc = weekly();
  Dc.concat(Wc).forEach(c => { if (!c.ok || s.chDone[c.key]) return; s.chDone[c.key] = today(); s.chN = (s.chN || 0) + 1;
    const xpv = Math.round((c.wk ? 150 : 40) * (1 + fx.xp[c.p] / 100)), mel = (c.wk ? 3 : 1) + fx.mel[c.p]; s.xp[c.p] = (s.xp[c.p] || 0) + xpv; hv.mel += mel; hv.melTot += mel;
    clog(`Desafio cumprido: ${c.t}. +${xpv} XP · +${mel} Mel.`, c.p); queue.push({ k: c.wk ? 'Desafio semanal' : 'Desafio do dia', t: c.t, s: 'Cumprido na vida real.', col: COL[c.p], rw: [`+${xpv} XP ${P[c.p].n}`, `+${mel} Mel`] }); });
  const dk = 'd:' + today() + ':all'; if (Dc.length && Dc.every(c => c.ok) && !s.chDone[dk]) { s.chDone[dk] = today(); hv.mel += 1; hv.melTot += 1; clog('Os 3 desafios do dia cumpridos. +1 Mel.', 'gold'); const o = offer(1, 'Dia completo'); queue.push({ k: 'Dia completo', t: 'Os 3 desafios', s: 'Escolhe a tua recompensa.', rw: ['+1 Mel bónus'], choice: o && o.id }); }
  const wkk = 'w:' + U.monday(today()) + ':all'; if (Wc.length && Wc.every(c => c.ok) && !s.chDone[wkk]) { s.chDone[wkk] = today(); const o = offer(2, 'Semana completa'); clog('Os 3 desafios da semana cumpridos.', 'gold'); queue.push({ k: 'Semana completa', t: 'Os 3 desafios da semana', s: 'Escolhe a tua recompensa.', rw: [], choice: o && o.id }); }
  Object.keys(s.chDone).forEach(k => { if (s.chDone[k] < U.addDays(today(), -40)) delete s.chDone[k]; });
  // conquistas
  CA.forEach(([id, n, , tier, pil, test]) => { if (s.cach[id]) return; if (safe(() => test(st.raw), false)) { s.cach[id] = today(); giveXP(pil, TXP[tier]); const mel = Math.ceil(tier / 2); hv.mel += mel; hv.melTot += mel; clog(`Conquista ${TIER[tier]}: ${n}. +${TXP[tier]} XP · +${mel} Mel.`, 'gold'); queue.push({ k: 'Conquista ' + TIER[tier], t: n, s: 'Desbloqueaste uma conquista.', rw: [`+${TXP[tier]} XP ${pil === 'all' ? 'em todos os pilares' : P[pil].n}`, `+${mel} Mel`] }); } });
  // níveis: favo automático + recompensa à escolha
  if (!s.cLv) s.cLv = Object.fromEntries(PK.map(p => [p, D.lv(p)]));
  PK.forEach(p => { const l = D.lv(p); while (l > s.cLv[p]) { s.cLv[p]++; const L2 = D.sumLv(), fav = autoHex(p), o = offer(L2 % 5 === 0 ? 2 : 1, `${P[p].n} nível ${s.cLv[p]}`);
    clog(`${P[p].n} subiu para o nível ${s.cLv[p]}.${fav ? ' Favo: ' + fav + '.' : ' +1 Mel.'}`, p);
    queue.push({ k: 'Subiste de nível', t: `${P[p].n} ${s.cLv[p]}`, s: LVMSG[(s.cLv[p] + p.length) % LVMSG.length], col: COL[p], rw: [fav ? `Favo conquistado: ${fav}` : '+1 Mel', `Nível total ${L2}`], choice: o && o.id }); } });
  const k = klass(); if (s.cls !== k.id) { if (s.cls) { const o = offer(2, 'Nova classe'); clog(`Classe: ${k.n}${k.tier >= 0 ? ' ' + ROM[k.tier] : ''}.`, 'gold'); queue.push({ k: 'Nova classe', t: k.n + ' ' + ROM[Math.max(0, k.tier)], s: k.tx, col: k.col, rw: [], choice: o && o.id }); } s.cls = k.id; }
  if (JSON.stringify([s.xp, s.cach, s.cLv, s.cls, s.bestStreak, s.hive, s.chDone, s.rwv2]) !== before) save();
  flush();
};

/* ================= CELEBRAÇÃO ================= */
let showing = false;
let scheduled = false;
const flush = () => { if (showing && !scheduled && !document.querySelector('.ch-cel')) showing = false; if (showing || !queue.length) return; showing = true; scheduled = true;
  setTimeout(() => { scheduled = false; const c = queue.shift(); if (!c) { showing = false; return; } celebrate(c); }, 120); };
const confetti = (cv, col) => { const x = cv.getContext('2d'), W = cv.width = innerWidth, H = cv.height = innerHeight, cs = ['#E8D3A8', '#C9A25E', col || '#fff', '#fff', '#6F8FC4', '#C0584A', '#9A78C4'];
  const ps = Array.from({ length: 160 }, () => ({ x: W / 2, y: H * .42, vx: (Math.random() - .5) * 16, vy: -Math.random() * 15 - 4, r: Math.random() * 6 + 3, a: Math.random() * 6, va: (Math.random() - .5) * .3, c: cs[Math.floor(Math.random() * cs.length)] }));
  let t = 0; const step = () => { if (!cv.isConnected || t++ > 260) return; x.clearRect(0, 0, W, H); ps.forEach(p => { p.vy += .32; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.globalAlpha = Math.max(0, 1 - t / 260); x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); x.restore(); }); requestAnimationFrame(step); }; step(); };
const celebrate = c => { const el = document.createElement('div'); el.className = 'ceremony ch-cel'; el.style.setProperty('--kc', c.col || '#E8D3A8');
  const o = c.choice && rw().pend.find(x => x.id === c.choice);
  const body = () => `<canvas></canvas><div class="in"><div class="cz ch-cel-k">${esc(c.k || '')}</div><div class="ring">${D.sigil(c.t, '#E8D3A8', 90)}</div><div class="ch-cel-p cz">Parabéns</div><h1>${esc(c.t)}</h1><p style="font-style:italic">${esc(c.s || '')}</p>${(c.rw || []).length ? `<div class="ch-cel-rw">${c.rw.map(r => `<span>${esc(r)}</span>`).join('')}</div>` : ''}
    ${o ? `<div class="ch-cel-ch"><div class="cz">Recompensa ${TIERN[o.tier].toLowerCase()} · escolhe uma</div><div class="ch-opts">${o.opts.map(pid => optCard(o, pid)).join('')}</div><button class="ch-later" data-later>Escolher depois</button></div>` : `<button class="dbtn gold" data-close>${queue.length ? 'Continuar' : 'Obrigado'}</button>`}</div>`;
  el.innerHTML = body(); document.body.appendChild(el); try { if (!matchMedia('(prefers-reduced-motion: reduce)').matches && !document.documentElement.classList.contains('lite')) confetti(el.querySelector('canvas'), c.col); } catch (e) { } try { navigator.vibrate && navigator.vibrate([40, 60, 80]); } catch (e) { }
  const close = () => { el.remove(); showing = false; OS.request(); flush(); };
  el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) { if (e.target === el && !o) close(); return; } e.stopPropagation(); e.preventDefault();
    if (b.dataset.act === 'rwChoose') { choose(b.dataset.o, b.dataset.p); const it = rw().pool.find(x => x.id === b.dataset.p); UI.toast(`Boa escolha: ${it ? it.t : ''}. Está em Recompensas.`, 'pos'); close(); }
    else if (b.dataset.act === 'rwNo') { reroll(b.dataset.o, b.dataset.p); const oo = rw().pend.find(x => x.id === c.choice); el.querySelector('.ch-opts').innerHTML = oo ? oo.opts.map(pid => optCard(oo, pid)).join('') : ''; }
    else if ('later' in b.dataset || 'close' in b.dataset) close(); }, true);
  setTimeout(() => { const f = el.querySelector('.ch-optb,[data-close]'); f && f.focus(); }, 50); };
D.ceremony = c => { queue.push({ k: c.s, t: c.t, s: c.x, rw: c.rw || [], col: c.col }); flush(); };
D.celebrate = c => { queue.push(c); flush(); };

/* ================= VISTA ================= */
const bar = (pct, cls = '') => `<div class="dbar ${cls}"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>`;
const TABS = [['', 'Personagem'], ['desafios', 'Desafios'], ['colmeia', 'Colmeia'], ['recompensas', 'Recompensas'], ['titulos', 'Títulos'], ['conquistas', 'Conquistas'], ['cronica', 'Crónica']];
const T = {};
const chRow = c => `<div class="ch-ch ${c.ok ? 'ok' : ''}" style="--pc:${COL[c.p]}"><i>${c.ok ? '✓' : ''}</i><div><b>${esc(c.t)}</b><div class="ch-chb">${bar(Math.min(1, c.v / c.g) * 100, c.p)}<small class="mono">${U.nf(Math.min(c.v, c.g), c.v % 1 ? 1 : 0)}/${U.nf(c.g, c.g % 1 ? 1 : 0)}</small></div></div><small class="dm">${P[c.p].n}</small></div>`;

T.personagem = st => { const s = S(), k = klass(), L = D.sumLv(), name = (OS.one('profile').short || 'Ryan'), r = s.rank, nx = r < 8 ? D.reqs(r + 1) : [], done = nx.filter(x => x[1]).length, fx = hiveFx();
  const power = PK.reduce((a, p) => a + st[p].reduce((b, x, i) => b + x[1] + fx.st[p][i], 0), 0), Dc = daily(), pend = rw().pend.length;
  return `<section class="ch-hero" style="--kc:${k.col}"><div class="ch-sig">${D.sigil(k.id + name, '#E8D3A8', 96)}</div>
    <div class="ch-id"><div class="cz ch-k">${k.tier >= 0 ? `${esc(k.n)} · Grau ${ROM[k.tier]}` : 'Sem classe'}</div><h1>${esc(name)}</h1><div class="ch-title">${esc(RANKS[r])}</div>
      <div class="ch-meta"><span><b class="mono">${L}</b> nível</span><span><b class="mono">${power}</b> poder</span><a href="#dominus.colmeia"><b class="mono">${favN()}</b> favos</a><a href="#dominus.colmeia"><b class="mono gold">${hive().mel}</b> mel</a>${pend ? `<a href="#dominus.recompensas"><b class="mono gold">${pend}</b> recompensa${pend > 1 ? 's' : ''} por escolher</a>` : ''}</div></div>
    <div class="ch-next">${r < 8 ? `<small class="cz">Próximo título · ${RANKS[r + 1]}</small>${bar(nx.length ? done / nx.length * 100 : 0)}<small class="dm">${done}/${nx.length} requisitos</small>${D.canAscend() ? '<button class="dbtn gold glow" data-act="dAscend">Ascender</button>' : '<a class="dm" href="#dominus.titulos">Ver o caminho →</a>'}` : '<small class="cz gold">Título máximo alcançado</small>'}</div></section>
  <section><div class="ch-h"><span class="cz">Desafios de hoje</span><a class="dm" href="#dominus.desafios">semana →</a></div><div class="ch-chs">${Dc.map(chRow).join('')}</div></section>
  <section class="ch-attr">${PK.map(p => { const lv = D.level(s.xp[p] || 0); return `<div class="ch-p" style="--pc:${COL[p]}"><div class="ch-ph"><span class="cz">${P[p].n}</span><b class="mono">${lv.l}</b></div>${bar(lv.into / lv.next * 100, p)}<small class="dm mono">${U.nf(lv.into)} / ${U.nf(lv.next)} XP${fx.xp[p] ? ` · +${fx.xp[p]}%` : ''}</small>
    <div class="ch-sub">${st[p].map(([n, v, raw], i) => `<div><span>${n}</span><b class="mono">${v + fx.st[p][i]}${fx.st[p][i] ? `<sup>+${fx.st[p][i]}</sup>` : ''}</b><small>${esc(raw)}</small></div>`).join('')}</div></div>`; }).join('')}</section>
  <section class="ch-cls"><div><div class="cz">Classe</div><p>${esc(k.tx)}</p><small class="dm">A classe muda sozinha conforme o pilar (ou pilares) que mais sobes. Evolui de grau com o nível total: ${TIER_AT.join(' · ')}.</small></div>
    ${k.names ? `<div class="ch-path">${k.names.map((n, i) => `<span class="${i < k.tier ? 'done' : i === k.tier ? 'cur' : ''}"><small>${ROM[i]}</small>${esc(n)}</span>`).join('')}</div>` : ''}</section>`; };

T.desafios = () => { const Dc = daily(), Wc = weekly(), s = S(), wk = U.monday(today()), left = 7 - U.diff(wk, today()) - 1;
  const hist = U.lastN(7).slice().reverse().slice(1).map(d => { const n = Object.keys(s.chDone || {}).filter(k => k.startsWith('d:' + d + ':') && !k.endsWith(':all')).length; return `<div class="ch-hd"><span class="mono dm">${U.fmtDS(d)}</span><span>${'●'.repeat(n)}${'○'.repeat(Math.max(0, 3 - n))}</span></div>`; }).join('');
  return `<section><div class="ch-h"><span class="cz">Hoje · 3 desafios</span><span class="dm">+40 XP e +1 Mel cada · os 3 = recompensa</span></div><div class="ch-chs">${Dc.map(chRow).join('')}</div></section>
  <section><div class="ch-h"><span class="cz">Esta semana</span><span class="dm">+150 XP e +3 Mel cada · ${left > 0 ? left + ' dias restantes' : 'último dia'}</span></div><div class="ch-chs">${Wc.map(chRow).join('')}</div></section>
  <section><div class="ch-h"><span class="cz">Últimos dias</span><span class="dm mono">${s.chN || 0} desafios no total</span></div><div class="ch-hist">${hist}</div><p class="dm ch-note">Os desafios mudam todos os dias e todas as semanas, sempre de pilares diferentes. São verificados sozinhos pelo que registas: estudo, treinos, corridas, dieta, finanças e rede.</p></section>`; };

T.colmeia = () => { const hv = hive(), o = hv.own, sel = HX[OS.ui.hexSel] || null, R = 26, W = SQ3 * R * (2 * HR + 1) + 16, H = R * (3 * HR + 2) + 16;
  const pts = (x, y, r) => Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 180 * (60 * i - 30); return (x + r * Math.cos(a)).toFixed(1) + ',' + (y + r * Math.sin(a)).toFixed(1); }).join(' ');
  const glyph = (h, x, y, c) => h.t === 'key' ? `<path d="M${x - 7} ${y + 4}l2-8 5 5 0-7 0 7 5-5 2 8z" fill="${c}"/>` : h.t === 'not' ? `<path d="M${x} ${y - 6}l6 6-6 6-6-6z" fill="${c}"/>` : h.t === 'med' ? `<circle cx="${x}" cy="${y}" r="4.5" fill="none" stroke="${c}" stroke-width="1.6"/>` : `<circle cx="${x}" cy="${y}" r="2.4" fill="${c}"/>`;
  const svg = HEXES.map(h => { const x = h.x * R + W / 2, y = h.y * R + H / 2, own = !!o[h.k], can = canTake(h), c = h.ring ? COL[h.p] : '#E8D3A8', aff = h.ring && hv.mel >= COST[h.t];
    return `<g class="hx2 ${own ? 'own' : can ? 'can' + (aff ? ' aff' : '') : 'lock'} ${sel && sel.k === h.k ? 'sel' : ''}" data-act="hexSel" data-k="${h.k}" style="--pc:${c}" role="button" tabindex="0" aria-label="${esc(hexName(h))}"><polygon points="${pts(x, y, R * .94)}"/>${h.ring ? glyph(h, x, y, own ? '#0A0907' : c) : `<text x="${x}" y="${y + 4}" text-anchor="middle">TU</text>`}</g>`; }).join('');
  const fx = hiveFx();
  return `<section class="ch-hv-top"><div><div class="cz">Mel</div><b class="mono">${hv.mel}</b><small class="dm">${hv.melTot} ganho no total · ${favN()}/${HEXES.length - 1} favos</small></div><p class="dm">Ganhas Mel nos Desafios e nas Conquistas e gastas onde quiseres. Cada subida de nível também conquista sozinha um favo no pilar que subiu. Só podes conquistar favos ligados aos que já tens.</p></section>
  <section class="ch-hv"><svg viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" class="hive" role="group" aria-label="Colmeia de atributos">${svg}<text x="${W / 2}" y="14" text-anchor="middle" class="hvl" style="fill:${COL.int}">INTELECTO</text><text x="${W / 2}" y="${H - 4}" text-anchor="middle" class="hvl" style="fill:${COL.cor}">CORPO</text><text x="${W - 4}" y="${H / 2 - R * 1.9}" text-anchor="end" class="hvl" style="fill:${COL.for}">FORTUNA</text><text x="4" y="${H / 2 - R * 1.9}" class="hvl" style="fill:${COL.inf}">INFLUÊNCIA</text></svg>
    <div class="ch-hvp">${sel ? `<div class="cz" style="color:${sel.ring ? COL[sel.p] : 'var(--g)'}">${sel.ring ? P[sel.p].n + ' · ' + { sml: 'favo', med: 'favo raro', not: 'favo notável', key: 'favo-mestre' }[sel.t] : 'centro'}</div><h2>${esc(hexName(sel))}</h2><p>${esc(hexFx(sel))}</p>
      ${o[sel.k] ? `<small class="gold">Conquistado ${sel.ring ? U.fmtD(o[sel.k]) : ''}</small>` : canTake(sel) ? `<button class="dbtn ${hv.mel >= COST[sel.t] ? 'gold' : ''}" data-act="hexTake" data-k="${sel.k}" ${hv.mel >= COST[sel.t] ? '' : 'disabled'}>Conquistar · ${COST[sel.t]} Mel</button>${hv.mel < COST[sel.t] ? `<small class="dm">Faltam ${COST[sel.t] - hv.mel} Mel.</small>` : ''}` : '<small class="dm">Ainda não está ligado a nenhum favo teu.</small>'}` : '<div class="cz">Toca num favo</div><p class="dm">Pontinho: +3 num atributo. Anel: +4% XP. Losango: favo notável. Coroa: favo-mestre, no fundo de cada pilar.</p>'}
      <div class="ch-hvfx">${PK.map(p => `<div style="--pc:${COL[p]}"><span>${P[p].n}</span><b class="mono">+${fx.xp[p]}% XP</b><small class="dm">${SUBN[p].map((n, i) => fx.st[p][i] ? `${n} +${fx.st[p][i]}` : '').filter(Boolean).join(' · ') || '—'}</small></div>`).join('')}</div></div></section>`; };

T.recompensas = () => { const R = rw(), pool = R.pool;
  const byT = t => pool.filter(x => x.tier === t);
  return `<section><div class="ch-h"><span class="cz">Por escolher</span><span class="dm">${R.pend.length}</span></div>${R.pend.length ? R.pend.map(o => `<div class="ch-pend"><div class="dm"><b class="gold">${TIERN[o.tier]}</b> · ${esc(o.why)} · ${U.fmtDS(o.d)}</div><div class="ch-opts">${o.opts.map(pid => optCard(o, pid)).join('')}</div></div>`).join('') : '<p class="dm">Nada por escolher. Cada nível que sobes traz duas opções à escolha.</p>'}</section>
  <section><div class="ch-h"><span class="cz">Por gozar</span></div>${R.got.filter(g => !g.used).map(g => `<div class="ch-rw ok"><div class="t"><b>${esc(g.t)}</b><small>${TIERN[g.tier]} · ${esc(g.why)} · ${U.fmtDS(g.d)}</small></div><button class="dbtn sm gold" data-act="rwUsed" data-id="${g.id}">Gozei ✓</button></div>`).join('') || '<p class="dm">Ainda nada. Escolhe uma recompensa quando subires de nível.</p>'}</section>
  <section><div class="ch-h"><span class="cz">Os teus gostos</span><span class="dm">o sorteio aprende com o que escolhes</span></div>
    ${[1, 2, 3].map(t => `<div class="ch-tg"><small class="cz">${TIERN[t]}${t === 1 ? ' · cada nível' : t === 2 ? ' · classe, semana completa, cada 5 níveis' : ' · títulos'}</small><div class="ch-pre">${byT(t).map(x => `<button class="${x.w > 0 ? '' : 'off'}" data-act="rwToggle" data-p="${x.id}" title="${x.w > 0 ? 'Tirar dos sorteios' : 'Voltar a sortear'}">${esc(x.t)}${x.w > 0 ? `<small>${'★'.repeat(Math.min(5, Math.round(x.w)))}</small>` : ' <small>desligado</small>'}</button>`).join('')}</div></div>`).join('')}
    <form class="ch-addtaste" data-form="rwAdd"><input class="field" name="t" placeholder="Outra coisa de que gostas (ex.: açaí grande)" aria-label="Nova recompensa" required><select class="field" name="tier" aria-label="Tamanho"><option value="1">Pequena</option><option value="2" selected>Média</option><option value="3">Grande</option></select><button class="dbtn sm gold">Adicionar</button></form></section>
  ${R.got.some(g => g.used) ? `<section><div class="ch-h"><span class="cz">Já gozadas</span></div>${R.got.filter(g => g.used).slice(0, 20).map(g => `<div class="ch-rw red"><div class="t"><b>${esc(g.t)}</b><small>${esc(g.why)} · gozada ${U.fmtDS(g.used)}</small></div></div>`).join('')}</section>` : ''}`; };

T.titulos = () => { const s = S(), r = s.rank;
  return `<section class="ch-ladder">${RANKS.map((n, i) => { const cur = i === r, nxt = i === r + 1, rq = nxt ? D.reqs(i) : [];
    return `<div class="ch-rk ${i < r ? 'done' : cur ? 'cur' : nxt ? 'nxt' : ''}"><span class="mono">${i}</span><div><b class="cz">${n}</b><small>${RANK_TX[i]}</small>
      ${nxt ? `<div class="ch-rq">${rq.map(([l, ok]) => `<div class="${ok ? 'ok' : ''}">${ok ? '✓' : '○'} ${esc(l)}</div>`).join('')}${D.canAscend() ? '<button class="dbtn gold glow" data-act="dAscend">Ascender a ' + n + '</button>' : ''}</div>` : ''}</div></div>`; }).join('')}</section>
  <p class="dm ch-note">Nível total = soma dos níveis dos 4 pilares. O XP vem sozinho do que registas no Oceanum. Cada título novo traz uma recompensa grande à escolha.</p>`; };

T.conquistas = () => { const s = S(), c = s.cach || {}, lp = OS.ui.domLeg || 'int', done = s.legacy[lp] || [], nextIdx = LEG[lp].map((_, i) => i + 1).filter(n => !done.includes(n)).slice(0, 2);
  return `<section><div class="ch-h"><span class="cz">Conquistas</span><span class="dm mono">${Object.keys(c).length}/${CA.length}</span></div><div class="ch-ach">${CA.map(([id, n, d, tier, pil]) => `<div class="${c[id] ? 'on' : ''}" style="--pc:${pil === 'all' ? '#E8D3A8' : COL[pil]}"><small class="cz">${TIER[tier]} · +${TXP[tier]} XP</small><b>${esc(n)}</b><span>${esc(d)}</span>${c[id] ? `<em class="mono">${U.fmtD(c[id])}</em>` : ''}</div>`).join('')}</div></section>
  <section><div class="ch-h"><span class="cz">Codex · marcos da tua vida</span><span class="dm mono">${D.legacyCount()} provados</span></div><p class="dm ch-note">Os teus 100 marcos por pilar. Cada um provado vale +300 XP e +2 Mel. Pontos sem prova não existem.</p>
    <div class="dtabs" style="margin-bottom:10px">${PK.map(p => `<a href="javascript:void 0" data-act="dLeg" data-p="${p}" class="${lp === p ? 'on' : ''}">${P[p].n} · ${(s.legacy[p] || []).length}</a>`).join('')}</div>
    ${nextIdx.map(n => `<form class="dli" data-form="dLegacy" data-p="${lp}" data-n="${n}" style="align-items:flex-start"><span class="mono gold" style="width:34px;padding-top:3px">${n}</span><div class="t"><b>${esc(LEG[lp][n - 1])}</b><textarea class="field" name="proof" rows="2" style="margin-top:6px;width:100%;background:#0E0C09;border-color:var(--ln2);color:var(--dt)" placeholder="Prova: o que aconteceu, quando, onde está o registo." aria-label="Prova do marco ${n}"></textarea></div><button class="dbtn sm gold">Provar</button></form>`).join('')}
    <details style="margin-top:10px"><summary class="dm" style="cursor:pointer">Ver os 100 marcos de ${P[lp].n}</summary><div style="columns:2 260px;gap:24px;margin-top:10px">${LEG[lp].map((m, i) => `<div style="break-inside:avoid;padding:3px 0;font-size:15px;${done.includes(i + 1) ? 'color:var(--g2)' : 'color:var(--dm)'}"><span class="mono" style="font-size:11px">${i + 1}</span> ${done.includes(i + 1) ? '✓ ' : ''}${esc(m)}${s.proofs[lp + ':' + (i + 1)] ? `<div style="font-size:13px;font-style:italic">${esc(s.proofs[lp + ':' + (i + 1)])}</div>` : ''}</div>`).join('')}</div></details></section>`; };

T.cronica = () => { const s = S(), days = U.lastN(14).slice().reverse();
  return `<section><div class="ch-h"><span class="cz">Últimos 14 dias</span></div>${days.map(d => { const G = D.gains(d), t = PK.reduce((a, p) => a + (G.xp[p] || 0), 0); return `<div class="dli"><span class="mono dm" style="width:48px;font-size:12px">${U.fmtDS(d)}</span><div class="t"><div class="ch-stack">${PK.map(p => `<i style="flex:${G.xp[p] || 0};background:${COL[p]}"></i>`).join('')}${t ? '' : '<i style="flex:1"></i>'}</div><small>${esc(G.why.slice(0, 3).join(' · ') || 'nada registado')}</small></div><span class="mono" style="font-size:12px">${t}</span></div>`; }).join('')}</section>
  <section><div class="ch-h"><span class="cz">Crónica</span></div><div class="chron">${(s.cchron || []).map(c => `<div><span>${U.fmtDS(c.d)}</span><span class="${c.k === 'gold' ? 'gold' : ''}">${esc(c.t)}</span></div>`).join('') || '<div class="dm">Ainda nada escrito.</div>'}</div></section>`; };

V.dominus = sub => { const s = S();
  if (!s.started) return `<div class="dom ch"><section class="ch-start"><div class="cz" style="color:var(--g);letter-spacing:.3em;font-size:12px">OCEANUM · O JOGO</div><h1>DOMINUS</h1>
    <p>Um personagem: tu. Sem monstros, sem batalhas. Só sobe o que conquistas na vida real.</p>
    <div class="ch-rules"><div><b class="cz">Desafios</b><span>3 por dia e 3 por semana, verificados pelo que registas.</span></div><div><b class="cz">Colmeia</b><span>Gasta o Mel dos desafios nos atributos que queres.</span></div><div><b class="cz">Recompensas</b><span>Cada nível traz duas opções reais à escolha.</span></div></div>
    <button class="dbtn gold" data-act="dStart">${ic('crown')}Começar</button></section></div>`;
  const st = stats(); sync(st);
  const key = sub === 'codex' ? 'conquistas' : (T[sub] ? sub : 'personagem'), pend = rw().pend.length, dleft = daily().filter(c => !c.ok).length;
  return `<div class="dom ch"><nav class="dtabs">${TABS.map(([k, l]) => `<a href="#dominus${k ? '.' + k : ''}" class="${(key === 'personagem' ? '' : key) === k ? 'on' : ''}">${l}${k === 'titulos' && D.canAscend() ? '<span class="n">1</span>' : ''}${k === 'recompensas' && pend ? `<span class="n">${pend}</span>` : ''}${k === 'colmeia' && HEXES.some(h => canTake(h) && hive().mel >= COST[h.t]) ? '<span class="n">!</span>' : ''}</a>`).join('')}</nav>${T[key](st)}</div>`; };

/* ================= AÇÕES ================= */
A.dStart = () => { const s = S(); s.started = today(); s.cchron = []; hive(); rw(); clog('O personagem nasceu. Náufrago, sem classe.', 'gold'); save(); OS.request(); D.celebrate({ k: 'O começo', t: 'Náufrago', s: 'Faz os desafios de hoje: o XP e o Mel entram sozinhos.', rw: [] }); };
A.dAscend = () => { const s = S(); if (!D.canAscend()) return; s.rank++; const o = offer(3, 'Título ' + RANKS[s.rank]); hive().mel += 3; hive().melTot += 3; clog(`Novo título: ${RANKS[s.rank]}. +3 Mel.`, 'gold'); save(); D.celebrate({ k: 'Novo título', t: RANKS[s.rank], s: RANK_TX[s.rank], rw: ['+3 Mel'], choice: o && o.id }); OS.request(); };
A.dLeg = b => OS.setUI('domLeg', b.dataset.p);
A.hexSel = b => OS.setUI('hexSel', b.dataset.k);
A.hexTake = b => { const k = b.dataset.k, h = HX[k]; if (!takeHex(k, false)) { UI.toast('Mel insuficiente ou favo não ligado', 'warn'); return; } save(); OS.request(); D.celebrate({ k: 'Favo conquistado', t: hexName(h), s: hexFx(h), col: COL[h.p], rw: [`−${COST[h.t]} Mel`] }); };
A.rwChoose = b => { choose(b.dataset.o, b.dataset.p); const it = rw().pool.find(x => x.id === b.dataset.p); UI.toast(`Boa escolha: ${it ? it.t : ''}`, 'pos'); OS.request(); };
A.rwNo = b => { reroll(b.dataset.o, b.dataset.p); OS.request(); };
A.rwUsed = b => { const g = rw().got.find(x => x.id === b.dataset.id); if (!g) return; g.used = today(); clog(`Recompensa gozada: ${g.t}.`, 'gold'); save(); UI.toast('Aproveitaste. Mereceste.', 'pos'); OS.request(); };
A.rwToggle = b => { const x = rw().pool.find(y => y.id === b.dataset.p); if (!x) return; x.w = x.w > 0 ? 0 : 1; save(); OS.request(); };
OS.forms.rwAdd = (f, v) => { const t = v('t'); if (!t) return; const R = rw(); if (R.pool.some(x => x.t.toLowerCase() === t.toLowerCase())) { UI.toast('Já está nos teus gostos'); return; } R.pool.push({ id: 'u' + U.uid(), t, tier: +f.elements.tier.value || 2, cat: 'teu', w: 2 }); save(); UI.toast('Adicionado aos teus gostos', 'pos'); };
OS.forms.dLegacy = (f, v) => { const s = S(), p = f.dataset.p, n = +f.dataset.n, proof = v('proof'); if (proof.length < 12) { UI.toast('Escreve a prova (pelo menos uma frase). Pontos sem prova não existem.', 'warn'); return; }
  if ((s.legacy[p] || []).includes(n)) return; s.legacy[p] = (s.legacy[p] || []).concat(n); s.proofs[p + ':' + n] = proof; s.xp[p] = (s.xp[p] || 0) + 300; hive().mel += 2; hive().melTot += 2; clog(`Marco provado (${P[p].n} ${n}): ${LEG[p][n - 1]}. +300 XP · +2 Mel.`, 'gold'); save();
  D.celebrate({ k: 'Marco provado', t: `${P[p].n} · ${n}`, s: LEG[p][n - 1], col: COL[p], rw: [`+300 XP ${P[p].n}`, '+2 Mel'] }); OS.request(); };
D.klass = klass; D.stats = stats; D.favN = favN;
})();
