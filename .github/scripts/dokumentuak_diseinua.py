#!/usr/bin/env python3
"""Erronka 2 dokumentuei diseinu bateratua eta aurkibidea ematen dien script-a.

Erabilera:  python3 dokumentuak_diseinua.py docs/dokumentuak

Karpeta bakoitzeko (ESJ, OF, HE, AAI, ZAA, ZG-SGSI) .docx fitxategi guztiak hartzen ditu eta:
  * azaleko banda iluna jartzen die (ZUBIZARRETA GAILETAK · ERRONKA 2 · <MODULUA>),
  * "Datua / Balioa" taula gehitzen die (ez badute),
  * "Aurkibidea" eremua sortzen die (1. eta 2. mailako izenburuak, orri-zenbakiekin),
  * izenburuen, koloreen eta oin-oharraren estiloa berdintzen ditu.
Idenpotentea da: berriro exekutatuta, aurreko emaitza ordezkatzen du.
Orri-zenbakiak LibreOffice-rekin kalkulatzen dira (soffice + pdftotext behar dira).
"""
import copy, os, re, shutil, subprocess, sys, tempfile, zipfile
from lxml import etree

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
NS = {"w": W}
def w(t): return "{%s}%s" % (W, t)

MODULUAK = {
    "SSG": ("SSG", "Sareak eta sistemak gotortzea"),
    "ESJ": ("ESJ", "Ekoizpen seguruan jartzea"),
    "OF": ("OF", "Programazioa (Python)"),
    "HE": ("HE", "Hacking etikoa"),
    "AAI": ("AAI", "Auzitegi-analisi informatikoa"),
    "ZAA": ("ZAA", "Zibersegurtasunaren arloko araudia"),
    "ZG-SGSI": ("ZG/SGSI", "Zibersegurtasun-gorabeherak eta SGSI"),
}
ENPRESA = "Zubizarreta Gailetak"
PROIEKTUA = "Erronka 2 — Egiturak indartzen (1. atala)"
TALDEA = "Jehangir, Uday, Amaia, Ayub"

# Diseinu zaharreko (beixa) koloreak -> diseinu bateratuko koloreak
KOLOREAK = {
    "7A4A24": "392820", "FFF9EE": "F5EFE6", "FFF3DC": "F5EFE6", "F0D6A5": "E8D9C3",
    "E2C79A": "E8D9C3", "C98A3B": "C8803E", "A9691F": "C8803E", "4A2C1A": "2A1C15",
    "3A2A1E": "2A1C15",
}
# Diseinu urdina (Sareak dokumentua): betegarriak eta testu-koloreak bereiz
URDIN_FILL = {"10273C": "392820", "123151": "2A1C15", "EDF3F5": "F5EFE6", "F2F6FA": "FAF6F0"}
URDIN_COLOR = {"253345": "2A1C15", "13334A": "2A1C15", "10273C": "2A1C15", "00717B": "C8803E",
               "546776": "8C7767", "123151": "2A1C15"}
HEADER_XML = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
              '<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p/></w:hdr>')

ESTILOAK = {
    "Heading1": '<w:style xmlns:w="%s" w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="9"/><w:qFormat/><w:pPr><w:keepNext/><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="2" w:color="C8803E"/></w:pBdr><w:spacing w:before="320" w:after="120" w:line="240" w:lineRule="auto"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:b/><w:bCs/><w:color w:val="2A1C15"/><w:sz w:val="30"/><w:szCs w:val="30"/></w:rPr></w:style>',
    "Heading2": '<w:style xmlns:w="%s" w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="9"/><w:unhideWhenUsed/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="220" w:after="80" w:line="240" w:lineRule="auto"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:b/><w:bCs/><w:color w:val="5A3A28"/><w:sz w:val="25"/><w:szCs w:val="25"/></w:rPr></w:style>',
    "Heading3": '<w:style xmlns:w="%s" w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="9"/><w:unhideWhenUsed/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="160" w:after="60" w:line="240" w:lineRule="auto"/><w:outlineLvl w:val="2"/></w:pPr><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:b/><w:bCs/><w:color w:val="8C7767"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr></w:style>',
    "TOC1": '<w:style xmlns:w="%s" w:type="paragraph" w:styleId="TOC1"><w:name w:val="toc 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="39"/><w:unhideWhenUsed/><w:pPr><w:spacing w:before="60" w:after="60"/></w:pPr><w:rPr><w:b/><w:bCs/><w:color w:val="2A1C15"/></w:rPr></w:style>',
    "TOC2": '<w:style xmlns:w="%s" w:type="paragraph" w:styleId="TOC2"><w:name w:val="toc 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="39"/><w:unhideWhenUsed/><w:pPr><w:spacing w:after="40"/><w:ind w:left="300"/></w:pPr><w:rPr><w:color w:val="5A3A28"/></w:rPr></w:style>',
}

FOOTER = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
    '<w:ftr xmlns:w="%s" xmlns:r="%s"><w:p><w:pPr><w:pBdr><w:top w:val="single" w:sz="4" w:space="4" w:color="E8D9C3"/></w:pBdr><w:jc w:val="center"/></w:pPr>'
    '%s%s%s%s</w:p></w:ftr>')
def _frun(t): return '<w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:color w:val="8C7767"/><w:sz w:val="16"/><w:szCs w:val="16"/></w:rPr><w:t xml:space="preserve">%s</w:t></w:r>' % t
def _ffld(code): return ('<w:r><w:rPr><w:color w:val="8C7767"/><w:sz w:val="16"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r>'
    '<w:r><w:rPr><w:color w:val="8C7767"/><w:sz w:val="16"/></w:rPr><w:instrText xml:space="preserve"> %s </w:instrText></w:r>'
    '<w:r><w:rPr><w:color w:val="8C7767"/><w:sz w:val="16"/></w:rPr><w:fldChar w:fldCharType="separate"/></w:r>'
    '<w:r><w:rPr><w:color w:val="8C7767"/><w:sz w:val="16"/></w:rPr><w:t>1</w:t></w:r>'
    '<w:r><w:rPr><w:color w:val="8C7767"/><w:sz w:val="16"/></w:rPr><w:fldChar w:fldCharType="end"/></w:r>') % code
FOOTER_XML = FOOTER % (W, R, _frun(ENPRESA + " · Erronka 2 · Orria "), _ffld("PAGE"), _frun(" / "), _ffld("NUMPAGES"))


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def X(s):
    return etree.fromstring(s)

def text_of(el):
    return "".join(t.text or "" for t in el.iter(w("t")))

def is_empty_p(el):
    return el.tag == w("p") and not text_of(el).strip() and not el.findall(".//" + w("drawing")) \
        and not el.findall(".//" + w("sectPr")) and not el.findall(".//" + w("pict"))


def banner_xml(eyebrow, title, subtitle, width):
    def para(txt, color, sz, bold, after):
        b = "<w:b/><w:bCs/>" if bold else ""
        return ('<w:p><w:pPr><w:spacing w:after="%d" w:line="240" w:lineRule="auto"/></w:pPr><w:r><w:rPr>'
                '<w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="Calibri" w:cs="Calibri"/>%s<w:color w:val="%s"/>'
                '<w:sz w:val="%d"/><w:szCs w:val="%d"/></w:rPr><w:t xml:space="preserve">%s</w:t></w:r></w:p>') % (after, b, color, sz, sz, esc(txt))
    ps = para(eyebrow, "C8803E", 17, True, 80) + para(title, "F5EFE6", 44, True, 80 if subtitle else 0)
    if subtitle:
        ps += para(subtitle, "E8D9C3", 22, False, 0)
    nil = '<w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/>'
    return ('<w:tbl xmlns:w="%s"><w:tblPr><w:tblW w:w="%d" w:type="dxa"/><w:tblBorders>%s<w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders>'
            '<w:tblLayout w:type="fixed"/><w:tblLook w:val="0000"/></w:tblPr><w:tblGrid><w:gridCol w:w="%d"/></w:tblGrid><w:tr><w:tc><w:tcPr>'
            '<w:tcW w:w="%d" w:type="dxa"/><w:tcBorders>%s</w:tcBorders><w:shd w:val="clear" w:color="auto" w:fill="2A1C15"/>'
            '<w:tcMar><w:top w:w="260" w:type="dxa"/><w:left w:w="300" w:type="dxa"/><w:bottom w:w="260" w:type="dxa"/><w:right w:w="300" w:type="dxa"/></w:tcMar>'
            '</w:tcPr>%s</w:tc></w:tr></w:tbl>') % (W, width, nil, width, width, nil, ps)


def meta_xml(rows, width):
    c1 = 2600; c2 = width - c1
    mar = '<w:tcMar><w:top w:w="60" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tcMar>'
    def cell(wd, txt, head=False, bold=False):
        shd = '<w:shd w:val="clear" w:color="auto" w:fill="392820"/>' if head else ""
        rpr = ("<w:b/><w:bCs/>" if (head or bold) else "") + ('<w:color w:val="F5EFE6"/>' if head else "") + '<w:sz w:val="17"/><w:szCs w:val="17"/>'
        return ('<w:tc><w:tcPr><w:tcW w:w="%d" w:type="dxa"/>%s%s</w:tcPr><w:p><w:pPr><w:spacing w:after="40" w:line="252" w:lineRule="auto"/></w:pPr>'
                '<w:r><w:rPr>%s</w:rPr><w:t xml:space="preserve">%s</w:t></w:r></w:p></w:tc>') % (wd, shd, mar, rpr, esc(txt))
    trs = '<w:tr><w:trPr><w:cantSplit/><w:tblHeader/></w:trPr>%s%s</w:tr>' % (cell(c1, "Datua", True), cell(c2, "Balioa", True))
    for k, v in rows:
        trs += '<w:tr><w:trPr><w:cantSplit/></w:trPr>%s%s</w:tr>' % (cell(c1, k, bold=True), cell(c2, v))
    b = '<w:%s w:val="single" w:sz="4" w:space="0" w:color="E8D9C3"/>'
    borders = "".join(b % s for s in ("top", "left", "bottom", "right", "insideH", "insideV"))
    return ('<w:tbl xmlns:w="%s"><w:tblPr><w:tblW w:w="%d" w:type="dxa"/><w:tblBorders>%s</w:tblBorders><w:tblLayout w:type="fixed"/>'
            '<w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr>'
            '<w:tblGrid><w:gridCol w:w="%d"/><w:gridCol w:w="%d"/></w:tblGrid>%s</w:tbl>') % (W, width, borders, c1, c2, trs)


def toc_xml(entries, tabpos, lv=2):
    """entries: [(level, text, bookmark, page)]"""
    out = []
    n = len(entries)
    for i, (lvl, txt, bm, page) in enumerate(entries):
        r = ""
        if i == 0:
            r += ('<w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> TOC \\o "1-%d" \\h \\z \\u </w:instrText></w:r>'
                  '<w:r><w:fldChar w:fldCharType="separate"/></w:r>') % lv
        r += ('<w:hyperlink w:anchor="%s" w:history="1"><w:r><w:rPr><w:noProof/></w:rPr><w:t xml:space="preserve">%s</w:t></w:r>'
              '<w:r><w:rPr><w:noProof/></w:rPr><w:tab/></w:r>'
              '<w:r><w:rPr><w:noProof/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r>'
              '<w:r><w:rPr><w:noProof/></w:rPr><w:instrText xml:space="preserve"> PAGEREF %s \\h </w:instrText></w:r>'
              '<w:r><w:rPr><w:noProof/></w:rPr><w:fldChar w:fldCharType="separate"/></w:r>'
              '<w:r><w:rPr><w:noProof/></w:rPr><w:t>%s</w:t></w:r>'
              '<w:r><w:rPr><w:noProof/></w:rPr><w:fldChar w:fldCharType="end"/></w:r></w:hyperlink>') % (bm, esc(txt), bm, page)
        if i == n - 1:
            r += '<w:r><w:fldChar w:fldCharType="end"/></w:r>'
        sp = '<w:spacing w:before="0" w:after="10"/>' if n > 25 else ""
        out.append('<w:p><w:pPr><w:pStyle w:val="TOC%d"/><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="%d"/></w:tabs>%s</w:pPr>%s</w:p>' % (lvl, tabpos, sp, r))
    if not out:
        out.append('<w:p><w:r><w:t>—</w:t></w:r></w:p>')
    return ('<w:sdt xmlns:w="%s"><w:sdtPr><w:alias w:val="Aurkibidea"/><w:tag w:val="zg-aurkibidea"/><w:docPartObj><w:docPartGallery w:val="Table of Contents"/>'
            '<w:docPartUnique/></w:docPartObj></w:sdtPr><w:sdtContent>%s</w:sdtContent></w:sdt>') % (W, "".join(out))

TOC_TITLE = ('<w:p xmlns:w="%s"><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="200"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>'
             '<w:b/><w:bCs/><w:color w:val="2A1C15"/><w:sz w:val="30"/><w:szCs w:val="30"/></w:rPr><w:t>Aurkibidea</w:t></w:r></w:p>') % W
SPACER = '<w:p xmlns:w="%s"><w:pPr><w:spacing w:after="120"/></w:pPr></w:p>' % W


def family_of(docxml):
    u = docxml.upper()
    if "F0D6A5" in u[:20000]:
        return "beixa"
    if 'W:FILL="10273C"' in u and 'W:FILL="EDF3F5"' in u:
        return "urdina"
    return "iluna"


def recolor_urdin(xml):
    for a, b in URDIN_FILL.items():
        xml = re.sub(r'(w:fill=")%s(")' % a, r"\g<1>%s\2" % b, xml, flags=re.I)
    for a, b in URDIN_COLOR.items():
        xml = re.sub(r'(<w:color w:val=")%s(")' % a, r"\g<1>%s\2" % b, xml, flags=re.I)
        xml = re.sub(r'(w:color=")%s(")' % a, r"\g<1>%s\2" % b, xml, flags=re.I)
    return re.sub(r'(w:(?:ascii|hAnsi|cs|eastAsia)=")(?:Aptos|Carlito)(")', r"\1Calibri\2", xml)


def sentence_case(t):
    m = re.match(r"^([^A-Za-z\u00C0-\u017F]*)(.*)$", t)
    pre, rest = m.group(1), m.group(2)
    return pre + rest[:1].upper() + rest[1:].lower()


def recolor(xml):
    for a, b in KOLOREAK.items():
        xml = re.sub(r'(w:(?:fill|color|val)=")%s(")' % a, r"\g<1>%s\2" % b, xml, flags=re.I)
    return re.sub(r'(w:(?:ascii|hAnsi|cs|eastAsia)=")Cambria(")', r"\1Calibri\2", xml)


def text_width(body):
    sp = body.find(".//" + w("sectPr"))
    try:
        pw = int(sp.find(w("pgSz")).get(w("w"))); m = sp.find(w("pgMar"))
        return pw - int(m.get(w("left"))) - int(m.get(w("right")))
    except Exception:
        return 9638


def transform(docxml, stylesxml, folder):
    code, modname = MODULUAK[folder]
    family = family_of(docxml)
    if family == "beixa":
        docxml = recolor(docxml); stylesxml = recolor(stylesxml)
    elif family == "urdina":
        docxml = recolor_urdin(docxml); stylesxml = recolor_urdin(stylesxml)
    root = etree.fromstring(docxml.encode("utf-8"))
    body = root.find(w("body"))
    width = text_width(body)
    while len(body) and is_empty_p(body[0]):
        body.remove(body[0])
    kids = list(body)

    # 1) Azaleko banda
    first = kids[0]
    if first.tag == w("tbl"):
        texts = [text_of(p).strip() for p in first.iter(w("p"))]
    else:
        # Azal-orria paragrafoz egina (diseinu urdina): lehen taula arteko paragrafoak
        cover = []
        for el in kids:
            if el.tag == w("tbl"):
                break
            cover.append(el)
        texts = [text_of(p).strip() for p in cover]
        texts = [t for t in texts if t and norm(t) != norm(ENPRESA)]
        for el in cover:
            body.remove(el)
        first = etree.Element(w("p")); body.insert(0, first)
    texts = [t for t in texts if t and t.replace("●", "").strip()]
    eyebrow_old = texts[0] if texts and texts[0] == texts[0].upper() else None
    rest = texts[1:] if eyebrow_old else texts
    title = rest[0] if rest else "Dokumentua"
    subtitle = rest[1] if len(rest) > 1 else None
    if title == title.upper():
        title = sentence_case(title)
        if eyebrow_old and "ZUBIZARRETA" not in eyebrow_old.upper():
            title = sentence_case(eyebrow_old) + " — " + title.lower()
    if not subtitle and eyebrow_old and "ZUBIZARRETA" not in eyebrow_old.upper():
        subtitle = eyebrow_old.capitalize()
    eyebrow = "ZUBIZARRETA GAILETAK · ERRONKA 2 · " + modname.upper()
    body.replace(first, X(banner_xml(eyebrow, title, subtitle, width)))

    # 2) Bandaren ondorengoak: hutsuneak, Datua taula, aurreko aurkibidea
    idx = 1
    def nxt():
        k = list(body); return k[idx] if idx < len(k) else None
    def drop_empty():
        while nxt() is not None and is_empty_p(nxt()):
            body.remove(nxt())
    drop_empty()
    has_meta = nxt() is not None and nxt().tag == w("tbl") and text_of(nxt()).strip().upper().startswith(("DATUA", "IDENTIFIKAZIOA"))
    if has_meta:
        idx += 1; drop_empty()
    while True:
        el = nxt()
        if el is None: break
        if el.tag == w("p") and text_of(el).strip() == "Aurkibidea":
            body.remove(el); continue
        if el.tag == w("sdt") and (el.find(".//" + w("docPartGallery")) is not None or "Aurkibidea" in etree.tostring(el, encoding="unicode")[:600]):
            body.remove(el); continue
        if is_empty_p(el):
            body.remove(el); continue
        st_ = el.find("./w:pPr/w:pStyle", NS) if el.tag == w("p") else None
        if st_ is not None and st_.get(w("val")) == "InfoSmall":
            idx += 1; continue
        break
    # Aurreko aurkibide estatikoa (izenburua + zerrenda) kendu; letra-tamainak gorde
    casemap = {}
    for p in list(body.findall(w("p"))):
        ps_ = p.find("./w:pPr/w:pStyle", NS)
        if ps_ is not None and ps_.get(w("val")) == "Heading1" and text_of(p).strip().upper() == "AURKIBIDEA":
            el = p.getnext()
            body.remove(p)
            while el is not None and el.tag == w("p"):
                s2 = el.find("./w:pPr/w:pStyle", NS)
                if s2 is not None and s2.get(w("val")).startswith("Heading"):
                    break
                nx = el.getnext()
                t = re.sub(r"\s+", " ", text_of(el)).strip()
                if t:
                    casemap[norm(t)] = t
                body.remove(el); el = nx
            break
    ins = []
    if not has_meta:
        ins.append(X(meta_xml([("Proiektua", PROIEKTUA), ("Enpresa", ENPRESA), ("Modulua", "%s — %s" % (code, modname)),
                               ("Dokumentua", title), ("Taldea", TALDEA)], width)))
    ins += [X(SPACER), X(TOC_TITLE), "TOC"]
    pos = idx
    for e in ins:
        if e == "TOC":
            toc_pos = pos; continue
        body.insert(pos, e); pos += 1

    # 3) Izenburuak garbitu eta markatu
    entries = []; n = 0; first_h1 = True
    for p in list(body.iter(w("p"))):
        ps = p.find("./w:pPr/w:pStyle", NS)
        if ps is None or ps.get(w("val")) not in ("Heading1", "Heading2", "Heading3"):
            continue
        lvl = int(ps.get(w("val"))[-1])
        ppr = p.find(w("pPr"))
        for c in list(ppr):
            if c.tag not in (w("pStyle"), w("numPr"), w("sectPr"), w("pageBreakBefore")):
                ppr.remove(c)
        for r in p.findall(".//" + w("r")):
            if r.find(w("t")) is not None and not text_of(r).replace("●", "").strip() and "●" in text_of(r):
                r.getparent().remove(r); continue
            rpr = r.find(w("rPr"))
            if rpr is not None:
                for c in list(rpr):
                    if c.tag in (w("rFonts"), w("color"), w("sz"), w("szCs"), w("b"), w("bCs")):
                        rpr.remove(c)
        ts = p.findall(".//" + w("t"))
        if ts:
            ts[0].text = re.sub(r"^[\s●]+", "", ts[0].text or "")
        txt = re.sub(r"\s+", " ", text_of(p)).strip()
        if not txt:
            continue
        if family == "urdina" and txt == txt.upper() and re.search(r"[A-Z]", txt):
            txt = casemap.get(norm(txt)) or sentence_case(txt)
            ts = p.findall(".//" + w("t"))
            ts[0].text = txt
            for t in ts[1:]:
                t.text = ""
        if lvl == 1 and first_h1:
            pb = ppr.find(w("pageBreakBefore"))
            if pb is None:
                pb = etree.Element(w("pageBreakBefore")); ppr.insert(1, pb)
            pb.attrib.pop(w("val"), None)
            first_h1 = False
        for b in p.findall(w("bookmarkStart")):
            if (b.get(w("name")) or "").startswith("_Toc"):
                bid = b.get(w("id")); p.remove(b)
                for e in p.findall(w("bookmarkEnd")):
                    if e.get(w("id")) == bid: p.remove(e)
        if lvl <= 2:
            n += 1
            bm = "_Toc9%07d" % n
            bs = etree.Element(w("bookmarkStart")); bs.set(w("id"), str(90000 + n)); bs.set(w("name"), bm)
            be = etree.Element(w("bookmarkEnd")); be.set(w("id"), str(90000 + n))
            p.insert(list(p).index(ppr) + 1, bs); p.append(be)
            entries.append([lvl, txt, bm, "0"])

    # Sarrera gehiegi badaude, 1. maila bakarrik
    toc_lv = 2
    if len(entries) > 60:
        entries = [e for e in entries if e[0] == 1]
        toc_lv = 1

    # 4) Estiloak
    sroot = etree.fromstring(stylesxml.encode("utf-8"))
    for sid, sx in ESTILOAK.items():
        new = X(sx % W)
        old = sroot.find("./w:style[@w:styleId='%s']" % sid, NS)
        if old is not None:
            sroot.replace(old, new)
        else:
            sroot.append(new)
    return root, toc_pos, entries, width, toc_lv, etree.tostring(sroot, xml_declaration=True, encoding="UTF-8", standalone=True)


def build(root, toc_pos, entries, width, lv=2):
    r = copy.deepcopy(root)
    body = r.find(w("body"))
    body.insert(toc_pos, X(toc_xml(entries, width - 10, lv)))
    return etree.tostring(r, xml_declaration=True, encoding="UTF-8", standalone=True)


def write_docx(src, dst, repl):
    tmp = dst + ".tmp"
    with zipfile.ZipFile(src) as zi, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zo:
        for it in zi.infolist():
            if it.filename.endswith("/"):
                continue
            data = repl.get(it.filename)
            if data is None:
                data = zi.read(it.filename)
            zo.writestr(it.filename, data)
    os.replace(tmp, dst)


def norm(s):
    return re.sub(r"[^0-9a-z]+", "", s.casefold())


def find_pages(docx, entries):
    tmpd = tempfile.mkdtemp()
    try:
        subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir", tmpd, docx],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=240)
        pdf = os.path.join(tmpd, os.path.splitext(os.path.basename(docx))[0] + ".pdf")
        txt = subprocess.run(["pdftotext", "-layout", pdf, "-"], capture_output=True, text=True, check=True).stdout
    finally:
        shutil.rmtree(tmpd, ignore_errors=True)
    pages = txt.split("\f")
    plines = [[norm(l) for l in pg.splitlines() if l.strip() and "....." not in l] for pg in pages]
    start = 1  # 1. orria aurkibidea da
    for pi, pg in enumerate(pages):
        if "Aurkibidea" in pg:
            start = pi + 1; break
    cur = start
    missing = 0
    for e in entries:
        key = norm(e[1]); key2 = key[:28]
        found = None
        for pi in range(cur, len(plines)):
            ls = plines[pi]
            if any(l == key for l in ls) or any(len(key2) >= 8 and l.startswith(key2) for l in ls) or any(len(l) >= 8 and key.startswith(l) for l in ls if len(l) >= 12):
                found = pi; break
        if found is None:
            missing += 1; e[3] = str(cur + 1)
        else:
            cur = found; e[3] = str(found + 1)
    return missing, len(pages) - 1 if pages and not pages[-1].strip() else len(pages)


def process(path, folder):
    with zipfile.ZipFile(path) as z:
        names = z.namelist()
        docxml = z.read("word/document.xml").decode("utf-8")
        stylesxml = z.read("word/styles.xml").decode("utf-8")
        extra = {}
        if family_of(docxml) == "urdina":
            for nm in names:
                if re.match(r"word/header\d*\.xml$", nm):
                    extra[nm] = HEADER_XML.encode("utf-8")
                elif nm == "word/numbering.xml":
                    extra[nm] = recolor_urdin(z.read(nm).decode("utf-8")).encode("utf-8")
        if "F0D6A5" in docxml.upper()[:20000]:
            for nm in names:
                if nm in ("word/numbering.xml",) or re.match(r"word/(header|footnotes|endnotes)\d*\.xml$", nm):
                    extra[nm] = recolor(z.read(nm).decode("utf-8")).encode("utf-8")
    root, toc_pos, entries, width, lv, styles = transform(docxml, stylesxml, folder)
    repl = dict(extra)
    repl["word/styles.xml"] = styles
    for nm in names:
        if re.match(r"word/footer[^/]*\.xml$", nm):
            repl[nm] = FOOTER_XML.encode("utf-8")
    repl["word/document.xml"] = build(root, toc_pos, entries, width, lv)
    write_docx(path, path, repl)
    missing, npages = find_pages(path, entries)
    repl["word/document.xml"] = build(root, toc_pos, entries, width, lv)
    write_docx(path, path, repl)
    print("%-62s %2d sarrera, %2d orri%s" % (os.path.relpath(path), len(entries), npages,
          ("  (aurkitu gabe: %d)" % missing) if missing else ""))


def main():
    base = sys.argv[1] if len(sys.argv) > 1 else "docs/dokumentuak"
    n = 0
    for folder in sorted(os.listdir(base)):
        d = os.path.join(base, folder)
        if folder not in MODULUAK or not os.path.isdir(d):
            continue
        for f in sorted(os.listdir(d)):
            if f.lower().endswith(".docx") and not f.startswith("~$"):
                process(os.path.join(d, f), folder); n += 1
    print("Prozesatutako dokumentuak:", n)

if __name__ == "__main__":
    main()
