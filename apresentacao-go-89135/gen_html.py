"""Reestrutura nata-lisboa.html com o modelo de 3 camadas, a partir de content.json."""
import json, re, html

ROOT = '/tmp/claude-0/-home-user-Oceanum/6dc23658-084b-521e-a979-d9257be44f77/scratchpad/ppt/'
H = '/home/user/Oceanum/apresentacao-go-89135/nata-lisboa.html'
C = json.load(open(ROOT + 'content.json'))
t = open(H, encoding='utf-8').read()
e = lambda s: html.escape(s, quote=False)

# ── blocos existentes
marks = list(re.finditer(r'<!-- (\d+) [^>]*-->\n', t))
head = t[:marks[0].start()]
end_last = t.index('<p id="folio">')
blocks = {}
for i, m in enumerate(marks):
    blocks[int(m.group(1))] = t[m.start(): marks[i + 1].start() if i + 1 < len(marks) else end_last]
tail = t[end_last:]


def title_html(runs):
    out = ''
    for r in runs:
        out += e(r) if isinstance(r, str) else f'<em>{e(r[0])}</em>'
    return out


def t3(id_):
    c = C['t3'][id_]
    cols = c['cols']; lay = c['layout']
    items = []
    for i, it in enumerate(c['items']):
        inner = ''
        if c.get('numbered'):
            inner += f'<span class="big" style="font-size:46px">{i + 1}</span>'
        if it.get('k'):
            inner += f'<span class="lbl{" or" if lay == "timeline" else ""}" style="font-size:11.5px">{e(it["k"])}</span>'
        inner += f'<h3>{e(it["t"])}</h3>'
        if it.get('l'):
            inner += ''.join(f'<p class="d"><b>{e(b)}</b> <span class="muted">— {e(d)}</span></p>' for b, d in it['l'])
        else:
            inner += f'<p class="d muted">{e(it["d"])}</p>'
        bg = ';background:var(--ink-3)' if lay == 'flow' and i == 1 else ''
        items.append(f'<div class="card hov in it" style="--d:{i + 2}{bg}">{inner}</div>')
    nata = ''
    for k, it in enumerate(c['nata']):
        if 'f' in it:
            nata += f'<p class="nf"><span class="sq">■</span> {e(it["f"])}</p>'
        else:
            nata += f'<p class="nf"><span class="sq">+</span> <span class="ph" data-k="{id_}-n{k}">{e(it["p"])}</span></p>'
    src = f'<p class="src">■ {e(C["fonte"])}</p>' if any('f' in it for it in c['nata']) else ''
    n = len(c['items'])
    notes = e(c['notes']).replace('"', '&quot;')
    return f'''<!-- T3 {id_} -->
<section class="slide" data-notes="{notes}">
  <header class="hd"><div class="badge">{c["num"]}</div><div><p class="eyebrow">{e(c["eyebrow"])}</p><h2 class="title">{title_html(c["title"])}</h2></div></header>
  <div class="t3">
    <div class="geral">
      <p class="lbl or in fade" style="--d:0">① Em geral</p>
      <p class="lead in fade" style="--d:1">{e(c["lead"])}</p>
      <div class="items {lay} c{cols}">{"".join(items)}</div>
    </div>
    <div class="spec nata in" style="--d:{n + 2}"><span class="lbl cu">② Na Nata Lisboa</span>{nata}{src}</div>
    <div class="quote" data-click><p class="q">“<span class="ph" data-k="q-{id_}">{e(c["quote"])}</span>”</p><p class="lbl">③ Na prática · citação da Mônica Cardoso</p></div>
    <div class="ex in fade" style="--d:{n + 3}"><span class="lbl">③ Na prática · exemplo do dia a dia</span><span class="ph" data-k="x-{id_}">{e(c["example"])}</span></div>
  </div>
</section>

'''


roteiro_items = [
    ("1", "A entrevista", "Quem é Mônica Cardoso, como decorreu a conversa e como tratámos as respostas", 4),
    ("2", "Caracterização", "Identidade, atividade, dimensão e modelo de negócio da Nata Lisboa", 5),
    ("3", "Gestores e organizações", "O que é gerir, eficiência e eficácia, e as 3 características comuns", 6),
    ("4", "História da gestão", "Das abordagens clássica e comportamental às contemporâneas", 8),
    ("5", "Abordagem sistémica", "A Nata Lisboa como sistema aberto: inputs, processo, outputs e feedback", 9),
    ("6", "Ambiente externo", "Forças gerais e de tarefa e o grau de complexidade do ambiente", 10),
    ("7", "Cultura organizacional", "As 6 dimensões da cultura e como os colaboradores a aprendem", 13),
    ("8", "Os gestores", "Níveis de gestão, funções, papéis e competências da gerente", 15),
    ("9", "Desafios da gestão", "Diversidade, globalização e evolução tecnológica na Nata Lisboa", 17),
]
roteiro = '''<!-- 3 ROTEIRO -->
<section class="slide" data-notes="ROTEIRO (≈20 s)
Nove temas, que cobrem as alíneas a) a g) do enunciado e os conteúdos dos Tópicos 1 e 2. Em cada tema seguimos a mesma ordem: ① em geral (a teoria), ② na Nata Lisboa (a organização) e ③ na prática (citações e exemplos da Mônica, ao clique).
Dica: clicar num cartão salta para esse tema.">
  <header class="hd"><div class="badge" style="font-size:32px">0.5</div><div><p class="eyebrow">// Roteiro · em cada tema: ① em geral · ② na Nata Lisboa · ③ na prática</p><h2 class="title">O que vamos <em>apresentar</em></h2></div></header>
  <div class="row g3" style="flex:1;grid-template-rows:repeat(3,1fr)">
''' + ''.join(f'''    <div class="card hov tile in" data-go="{g}" style="--d:{i + 1};flex-direction:row;gap:18px;align-items:flex-start"><span class="l">{n}</span><div style="display:flex;flex-direction:column;gap:6px;min-width:0"><h3>{e(tt)}</h3><p class="txt muted" style="font-size:16px">{e(d)} →</p></div></div>
''' for i, (n, tt, d, g) in enumerate(roteiro_items)) + '''  </div>
</section>

'''

# ── forças
f = blocks[8]
f = f.replace('<div class="badge">4</div>', '<div class="badge">6</div>').replace('// Ambiente externo · na Nata Lisboa', '// Ambiente externo · força a força')
f = f.replace('<p class="lbl or in fade" style="--d:0">Forças de tarefa · impacto direto</p>', '<p class="lbl or in fade" style="--d:0">② Na Nata Lisboa · forças de tarefa (impacto direto)</p>')
f = f.replace('<p class="lbl in fade" style="--d:5">Forças gerais · impacto indireto</p>', '<p class="lbl in fade" style="--d:5">② Na Nata Lisboa · forças gerais (impacto indireto)</p>')
for lab, g in [('Clientes', 'Quem compra.'), ('Fornecedores', 'Quem fornece recursos.'), ('Concorrentes', 'Quem disputa os clientes.'), ('Grupos de pressão', 'Quem influencia de fora.')]:
    f = f.replace(f'<span class="lbl">{lab}</span>', f'<span class="lbl" style="color:var(--paper)">{lab}</span><span class="muted" style="font-size:14.5px">{g}</span>')
f = f.replace('<span class="lbl">Político-legais</span><span class="ph" data-k="c-pol">[Ex.: segurança alimentar, leis laborais, IVA]</span>',
              '<span class="lbl">Político-legais</span><span class="fact">■ Regras de higiene e segurança alimentar; Livro de Reclamações Eletrónico.</span><span class="ph" data-k="c-pol">[Outras: leis laborais, IVA]</span>')
f = f.replace('<span class="lbl">Tecnológicas</span><span class="ph" data-k="c-tec">[Ex.: entregas por app, pagamentos, redes sociais]</span>',
              '<span class="lbl">Tecnológicas</span><span class="fact">■ Delivery pela Uber Eats e take away NATA&amp;GO.</span><span class="ph" data-k="c-tec">[Outras: pagamentos, redes sociais]</span>')
f = f.replace('<span class="lbl">Globais</span><span class="ph" data-k="c-glo">[Ex.: presença internacional, turismo global]</span>',
              '<span class="lbl">Globais</span><span class="fact">■ Lojas em 5 países: Portugal, Espanha, Áustria, Alemanha e Angola.</span><span class="ph" data-k="c-glo">[Impacto do turismo na loja]</span>')
f = f.replace('<div class="quote" data-click style="margin-top:auto">', f'<p class="src in fade" style="--d:12">■ {e(C["fonte"])}</p>\n  <div class="quote" data-click style="margin-top:auto">')
f = f.replace('<p class="lbl">Citação · Mônica Cardoso, gerente operacional</p>', '<p class="lbl">③ Na prática · citação da Mônica Cardoso</p>')
assert f.count('class="fact"') == 3

# ── complexidade
d = blocks[9]
d = d.replace('<div class="badge">5</div>', '<div class="badge">6</div>')
d = d.replace('<p class="lbl or">Em geral</p>', '<p class="lbl or">① Em geral</p>')
d = re.sub(r'(A complexidade mede quantos componentes do ambiente afetam a organização; a mudança, a rapidez com que esses fatores se alteram\. Juntos determinam o grau de incerteza que os gestores enfrentam\.)',
           'A complexidade mede quantos componentes do ambiente afetam a organização; a mudança, a rapidez com que esses fatores se alteram. Juntos determinam a incerteza que os gestores enfrentam. Quanto maior a incerteza, mais os gestores precisam de informação, flexibilidade e decisões rápidas.', d)
d = d.replace('<span class="lbl cu">Na Nata Lisboa</span>', '<span class="lbl cu">② Na Nata Lisboa</span>')
d = d.replace('<p class="lbl">Citação · Mônica Cardoso</p>', '<p class="lbl">③ Na prática · citação da Mônica</p>')
assert 'flexibilidade' in d

# ── cultura dims
c6 = blocks[10]
c6 = c6.replace('<div class="badge">6</div>', '<div class="badge">7</div>').replace('// Cultura organizacional · arraste cada ●', '// Tópico 2 · Cultura organizacional · arraste cada ●')
c6 = c6.replace('<p class="intro in fade" style="--d:0">Valores, crenças e práticas partilhadas que orientam o comportamento dos membros. Cada dimensão é um contínuo entre dois polos.</p>',
                '<div class="in fade" style="--d:0"><p class="lbl or">① Em geral</p><p class="intro" style="color:var(--paper);margin-top:4px">A cultura organizacional são os valores, crenças, tradições e formas de fazer partilhados que influenciam o modo como os membros pensam e agem — «a forma como as coisas se fazem aqui». Pode descrever-se em 6 dimensões, cada uma um contínuo entre dois polos (Hofstede et al., 1990).</p></div>')
c6 = c6.replace('<span style="text-align:center">Posição na Nata Lisboa</span>', '<span style="text-align:center;color:#F5A262">② Posição na Nata Lisboa</span>')
c6 = re.sub(r'<span>Evidência \(observado / dito\)</span>', '<span style="color:#F5A262">③ Evidência · o que a Mônica disse</span>', c6)
assert '③ Evidência' in c6 and '① Em geral' in c6

# ── níveis
nv = blocks[12]
nv = nv.replace('<div class="badge">7</div>', '<div class="badge">8</div>').replace('// Gestores · clique num nível', '// Tópico 1 · Os gestores · clique num nível')
nv = nv.replace('<div style="display:flex;gap:48px;flex:1;min-height:0;align-items:center">',
                '<div class="in fade" style="--d:0"><p class="lbl or">① Em geral</p><p class="intro" style="color:var(--paper);margin-top:4px">Numa estrutura tradicional (piramidal), os gestores distribuem-se por três níveis. Quanto mais alto o nível, mais as decisões são estratégicas e de longo prazo; quanto mais baixo, mais operacionais e do dia a dia.</p></div>\n  <div style="display:flex;gap:40px;flex:1;min-height:0;align-items:center">')
nv = nv.replace('<div class="pyr in zoom" style="--d:1">', '<div class="pyr in zoom" style="--d:1;width:430px">')
nv = nv.replace('Decisões estratégicas: objetivos e políticas para toda a organização.</p><span class="ph" data-k="f-topo">[Quem são na Nata Lisboa e que decisões tomam]</span>',
                'Decisões estratégicas: missão, objetivos e políticas para toda a organização.</p><p class="txt"><b style="color:var(--nata)">②</b> <span class="ph" data-k="f-topo">[Quem são na Nata Lisboa: sede / franchisado]</span></p>')
nv = nv.replace('<p class="txt"><b>Mônica Cardoso</b> · Gerente Operacional', '<p class="txt"><b style="color:var(--nata)">②</b> <b>Mônica Cardoso</b> · Gerente Operacional')
nv = nv.replace('Dirigem o trabalho diário dos colaboradores operacionais.</p><span class="ph" data-k="f-pl">[Ex.: responsáveis de loja ou de turno]</span>',
                'Dirigem o trabalho diário dos colaboradores operacionais.</p><p class="txt"><b style="color:var(--nata)">②</b> <span class="ph" data-k="f-pl">[Ex.: responsáveis de turno]</span></p>')
nv = nv.replace('<div class="fb in" style="--d:5"><b>Estrutura:</b>', '<div class="fb in" style="--d:5"><b>② Estrutura:</b>')
nv = nv.replace('    </div>\n  </div>\n</section>', '    </div>\n  </div>\n  <div class="quote" data-click><p class="q">“<span class="ph" data-k="q-niveis">[Como a Mônica descreve o seu lugar na hierarquia.]</span>”</p><p class="lbl">③ Na prática · citação da Mônica Cardoso</p></div>\n</section>')
assert 'q-niveis' in nv and nv.count('<b style="color:var(--nata)">②</b>') == 3

# ── grupo, entrevista, conclusões
g = blocks[2].replace('N.º mec. <span class="ph" data-k="m2n">[______]</span>', 'N.º mec. <span style="color:var(--paper)">140385</span>')
assert '140385' in g
en = blocks[4].replace('<div class="badge">0</div>', '<div class="badge">1</div>').replace('<p class="lbl">Excerto da entrevista</p>', '<p class="lbl">Frase marcante da entrevista</p>')
cz = blocks[15].replace('<p class="lbl">Citação · Mônica Cardoso</p>', '<p class="lbl">③ Citação · Mônica Cardoso</p>')
refs = blocks[16]

new = (head + blocks[1] + g + roteiro + en +
       t3('caracterizacao') + t3('gestao') + t3('caracteristicas') + t3('historia') + t3('sistema') + t3('ambiente') +
       f + d + c6 + t3('aprendizagem') + nv + t3('funcoes') + t3('desafios') + cz + refs + blocks[17] + tail)

css = '''
/* modelo de 3 camadas */
.t3{display:grid;grid-template-columns:1.72fr 1fr;grid-template-rows:1fr auto;gap:14px 20px;flex:1;min-height:0}
.geral{display:flex;flex-direction:column;gap:8px;min-height:0;min-width:0}
.lead{font-size:18px;line-height:1.45;color:var(--paper)}
.items{display:grid;gap:12px;flex:1;min-height:0;margin-top:4px}
.items.c1{grid-template-columns:1fr}.items.c2{grid-template-columns:1fr 1fr}.items.c3{grid-template-columns:repeat(3,1fr)}.items.c4{grid-template-columns:repeat(4,1fr)}
.items.flow{gap:12px 30px}
.items .it{padding:14px 16px;gap:5px;position:relative}
.items .it h3{font-size:22px}
.items .d{font-size:15.5px;line-height:1.42}
.items.c4 .d{font-size:14.5px}
.items.flow .it:not(:last-child)::after{content:"→";position:absolute;right:-25px;top:50%;transform:translateY(-50%);color:var(--nata);font:700 22px var(--f-body)}
.items.timeline .it{border-top:3px solid var(--nata)}
.nata{margin-top:0;padding:14px 18px;gap:9px;min-width:0}
.nf{font-size:15.5px;line-height:1.4}
.nf .sq{color:var(--nata);font-weight:700}
.nf .ph{font-size:15.5px}
.src{font:400 11px/1.3 var(--f-mono);color:var(--dim);margin-top:auto}
.fact{font-size:15px;line-height:1.4}
.ex{border:1.5px dashed var(--dim);padding:12px 16px;display:flex;flex-direction:column;gap:6px;justify-content:center}
.ex .ph{font-size:16px}
.t3 .quote{align-self:stretch;justify-content:center}
.t3 .quote .q{font-size:22px}
'''
new = new.replace('\n@media (max-width:640px)', css + '\n@media (max-width:640px)', 1)
# exportação: identificar slides interativos pelo conteúdo, não pelo índice
new = new.replace("if(i===8) items.push", "if(s.querySelector('.cell')) items.push").replace("if(i===9) s.querySelectorAll", "if(s.querySelector('.dim input')) s.querySelectorAll")
assert "s.querySelector('.cell')" in new
open(H, 'w', encoding='utf-8').write(new)
print('slides:', new.count('<section class="slide'))
