"""Adiciona transições e animações de entrada nativas a cada diapositivo.

Lê os nomes dos objetos ("A<n>|<efeito>|..." = automático, "K<n>|<efeito>|..." = ao clique)
e escreve <p:transition> + <p:timing> no XML de cada slide.
"""
import re
import sys
import zipfile
from html import unescape

SRC, DST = sys.argv[1], sys.argv[2]
STAGGER = 260   # ms entre passos automáticos
DUR = 550       # duração de cada efeito

ids = iter(range(3, 100000))


def tgt(spid):
    return f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl>'


def set_visible(spid):
    return (f'<p:set><p:cBhvr><p:cTn id="{next(ids)}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>'
            f'{tgt(spid)}<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>'
            f'<p:to><p:strVal val="visible"/></p:to></p:set>')


def val(v):
    return f'<p:fltVal val="{v}"/>' if not v.startswith("#") else f'<p:strVal val="{v}"/>'


def anim_prop(spid, attr, frm, to):
    return (f'<p:anim calcmode="lin" valueType="num"><p:cBhvr additive="base"><p:cTn id="{next(ids)}" dur="{DUR}" fill="hold"/>'
            f'{tgt(spid)}<p:attrNameLst><p:attrName>{attr}</p:attrName></p:attrNameLst></p:cBhvr>'
            f'<p:tavLst><p:tav tm="0"><p:val>{val(frm)}</p:val></p:tav>'
            f'<p:tav tm="100000"><p:val><p:strVal val="{to}"/></p:val></p:tav></p:tavLst></p:anim>')


def anim_effect(spid, flt):
    return (f'<p:animEffect transition="in" filter="{flt}"><p:cBhvr><p:cTn id="{next(ids)}" dur="{DUR}"/>{tgt(spid)}</p:cBhvr></p:animEffect>')


EFFECTS = {
    # nome: (presetID, presetSubtype, função que gera o corpo)
    "fade": (10, 0, lambda s: anim_effect(s, "fade")),
    "wipeL": (22, 8, lambda s: anim_effect(s, "wipe(left)")),
    "rise": (42, 0, lambda s: anim_effect(s, "fade") + anim_prop(s, "ppt_x", "#ppt_x", "#ppt_x")
             + anim_prop(s, "ppt_y", "#ppt_y+.06", "#ppt_y")),
    "zoom": (53, 16, lambda s: anim_prop(s, "ppt_w", "0", "#ppt_w") + anim_prop(s, "ppt_h", "0", "#ppt_h")
             + anim_effect(s, "fade")),
}


def effect(spid, kind, delay, node_type, has_text):
    preset, sub, body = EFFECTS[kind]
    grp = ' grpId="0"'
    return (f'<p:par><p:cTn id="{next(ids)}" presetID="{preset}" presetClass="entr" presetSubtype="{sub}" fill="hold"{grp} nodeType="{node_type}">'
            f'<p:stCondLst><p:cond delay="{delay}"/></p:stCondLst><p:childTnLst>{set_visible(spid)}{body(spid)}</p:childTnLst></p:cTn></p:par>')


def group(items, auto):
    """items: lista de (spid, efeito, passo, tem_texto). Um grupo = um clique (ou o arranque automático)."""
    steps = sorted({it[2] for it in items})
    out = []
    first = True
    for it in sorted(items, key=lambda t: (t[2], t[0])):
        spid, kind, step, has_text = it
        delay = steps.index(step) * STAGGER
        if first:
            nt = "afterEffect" if auto else "clickEffect"
            first = False
        else:
            nt = "withEffect"
        out.append(effect(spid, kind, delay, nt, has_text))
    cond = ('<p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond>' if auto
            else '<p:cond delay="indefinite"/>')
    return (f'<p:par><p:cTn id="{next(ids)}" fill="hold"><p:stCondLst>{cond}</p:stCondLst><p:childTnLst>'
            f'<p:par><p:cTn id="{next(ids)}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>'
            + "".join(out) + '</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>')


def process(xml):
    global ids
    ids = iter(range(3, 100000))
    found = []
    for m in re.finditer(r'<p:(nvSpPr|nvPicPr|nvCxnSpPr)><p:cNvPr id="(\d+)" name="([^"]*)"', xml):
        kind_el, spid, name = m.group(1), m.group(2), unescape(m.group(3))
        mm = re.match(r'([AK])(\d+)\|(\w+)\|', name)
        if mm:
            found.append((mm.group(1), int(spid), mm.group(3), int(mm.group(2)), kind_el == "nvSpPr"))
    transition = '<p:transition spd="med"><p:fade/></p:transition>'
    timing = ""
    if found:
        auto = [(s, k, n, t) for (g, s, k, n, t) in found if g == "A"]
        clicks = [(s, k, n, t) for (g, s, k, n, t) in found if g == "K"]
        groups = []
        if auto:
            groups.append(group(auto, True))
        for step in sorted({c[2] for c in clicks}):
            groups.append(group([c for c in clicks if c[2] == step], False))
        bld = "".join(f'<p:bldP spid="{s}" grpId="0" animBg="1"/>' for (g, s, k, n, t) in found if t)
        timing = ('<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
                  '<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>'
                  + "".join(groups) +
                  '</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
                  '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>'
                  '</p:childTnLst></p:cTn></p:par></p:tnLst>'
                  + (f'<p:bldLst>{bld}</p:bldLst>' if bld else '') + '</p:timing>')
    assert "<p:transition" not in xml and "<p:timing" not in xml
    ins = transition + timing
    if "<p:extLst>" in xml.split("</p:clrMapOvr>")[-1]:
        head, tail = xml.rsplit("</p:clrMapOvr>", 1)
        return head + "</p:clrMapOvr>" + ins + tail
    return xml.replace("</p:sld>", ins + "</p:sld>")


with zipfile.ZipFile(SRC) as zin, zipfile.ZipFile(DST, "w", zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = zin.read(item.filename)
        if re.match(r"ppt/slides/slide\d+\.xml$", item.filename):
            data = process(data.decode("utf-8")).encode("utf-8")
        zout.writestr(item, data)
print("ok", DST)
