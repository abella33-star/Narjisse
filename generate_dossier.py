#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Générateur du dossier de présentation NailSim Pro
pour Institut Naïram Narjisse
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.platypus.flowables import Flowable
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import datetime

# ─── Brand Colors ──────────────────────────────────────────────────────────────
TERRA       = colors.HexColor("#C27B4A")   # copper / terra
TERRA_DARK  = colors.HexColor("#A5633A")   # darker copper
CREAM       = colors.HexColor("#FAF5F0")   # cream background
DARK_BROWN  = colors.HexColor("#2C1F14")   # dark brown
MID_BROWN   = colors.HexColor("#5C3D2E")   # mid brown
LIGHT_TAN   = colors.HexColor("#E8D5C4")   # light tan
GOLD        = colors.HexColor("#D4A96A")   # gold accent
WHITE       = colors.white
BLACK       = colors.black
GREY_LIGHT  = colors.HexColor("#F5F0EB")
GREY_MID    = colors.HexColor("#C8B4A4")

PAGE_W, PAGE_H = A4

# ─── Page dimensions ───────────────────────────────────────────────────────────
MARGIN_L = 2.0 * cm
MARGIN_R = 2.0 * cm
MARGIN_T = 2.5 * cm
MARGIN_B = 2.0 * cm
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R


# ─── Header / Footer canvas callback ───────────────────────────────────────────
class HeaderFooterCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_page_states = []
        self._page_numbers = []  # track page number for each saved state

    def showPage(self):
        current_page = self._pageNumber
        self._saved_page_states.append(dict(self.__dict__))
        self._page_numbers.append(current_page)
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for idx, state in enumerate(self._saved_page_states):
            self.__dict__.update(state)
            self.draw_header_footer(self._page_numbers[idx], num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_header_footer(self, page_num, total_pages):
        # Draw full cover on page 1
        if page_num == 1:
            self.draw_cover()
            return

        self.saveState()

        # ── Header ──────────────────────────────────────────────────────────
        self.setFillColor(TERRA)
        self.rect(0, PAGE_H - 16*mm, PAGE_W, 16*mm, fill=1, stroke=0)

        self.setFillColor(WHITE)
        self.setFont("Helvetica-Bold", 8)
        self.drawString(MARGIN_L, PAGE_H - 10*mm, "NailSim Pro")
        self.setFont("Helvetica", 7)
        self.drawRightString(PAGE_W - MARGIN_R, PAGE_H - 10*mm,
                             "Institut Naïram Narjisse — Confidentiel")

        # thin gold line under header
        self.setStrokeColor(GOLD)
        self.setLineWidth(0.8)
        self.line(MARGIN_L, PAGE_H - 17*mm, PAGE_W - MARGIN_R, PAGE_H - 17*mm)

        # ── Footer ──────────────────────────────────────────────────────────
        self.setFillColor(DARK_BROWN)
        self.rect(0, 0, PAGE_W, 12*mm, fill=1, stroke=0)

        self.setFillColor(GOLD)
        self.setFont("Helvetica", 7)
        self.drawString(MARGIN_L, 4.5*mm, "narjisse.vercel.app  •  Mars 2026  •  Confidentiel")
        self.setFont("Helvetica-Bold", 7)
        self.setFillColor(WHITE)
        self.drawRightString(PAGE_W - MARGIN_R, 4.5*mm,
                             f"Page {page_num} / {total_pages}")

        self.restoreState()

    def draw_cover(self):
        """Draw the full cover page directly on the canvas."""
        c = self

        # ── background gradient (simulated with rects) ──────────────────
        bands = 40
        for i in range(bands):
            ratio = i / bands
            r = DARK_BROWN.red   + ratio * (MID_BROWN.red   - DARK_BROWN.red)
            g = DARK_BROWN.green + ratio * (MID_BROWN.green - DARK_BROWN.green)
            b_val = DARK_BROWN.blue  + ratio * (MID_BROWN.blue  - DARK_BROWN.blue)
            c.setFillColor(colors.Color(r, g, b_val))
            band_h = PAGE_H / bands
            c.rect(0, i * band_h, PAGE_W, band_h + 1, fill=1, stroke=0)

        # ── decorative circles ───────────────────────────────────────────
        c.setFillColor(colors.Color(0.76, 0.48, 0.29, alpha=0.12))
        c.circle(PAGE_W - 30*mm, PAGE_H - 30*mm, 60*mm, fill=1, stroke=0)
        c.circle(30*mm, 40*mm, 40*mm, fill=1, stroke=0)
        c.setFillColor(colors.Color(0.83, 0.66, 0.42, alpha=0.08))
        c.circle(PAGE_W / 2, PAGE_H / 2, 90*mm, fill=1, stroke=0)

        # ── top terra stripe ─────────────────────────────────────────────
        c.setFillColor(TERRA)
        c.rect(0, PAGE_H - 3*mm, PAGE_W, 3*mm, fill=1, stroke=0)

        # ── gold accent bar ──────────────────────────────────────────────
        c.setFillColor(GOLD)
        c.rect(MARGIN_L, PAGE_H * 0.68, CONTENT_W, 2.5, fill=1, stroke=0)

        # ── NM INSTITUT badge ────────────────────────────────────────────
        c.setFillColor(colors.Color(1, 1, 1, alpha=0.08))
        c.roundRect(MARGIN_L, PAGE_H * 0.82, CONTENT_W, 22*mm, 4, fill=1, stroke=0)
        c.setStrokeColor(TERRA)
        c.setLineWidth(0.8)
        c.roundRect(MARGIN_L, PAGE_H * 0.82, CONTENT_W, 22*mm, 4, fill=0, stroke=1)

        c.setFillColor(TERRA)
        c.setFont("Helvetica-Bold", 11)
        c.drawCentredString(PAGE_W / 2, PAGE_H * 0.82 + 14*mm, "INSTITUT NAÏRAM NARJISSE")
        c.setFillColor(GOLD)
        c.setFont("Helvetica", 8)
        c.drawCentredString(PAGE_W / 2, PAGE_H * 0.82 + 8*mm,
                            "Prothésiste Ongulaire  \u2022  Tresses, Bordeaux  \u2022  narjisse.vercel.app")

        # ── Main title ───────────────────────────────────────────────────
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 32)
        c.drawCentredString(PAGE_W / 2, PAGE_H * 0.67, "NailSim Pro")

        c.setFillColor(TERRA)
        c.setFont("Helvetica-Bold", 12)
        c.drawCentredString(PAGE_W / 2, PAGE_H * 0.62,
                            "Simulateur IA pour Proth\u00e9sistes Ongulaires")

        # ── subtitle band ────────────────────────────────────────────────
        c.setFillColor(colors.Color(0.76, 0.48, 0.29, alpha=0.25))
        c.roundRect(MARGIN_L + 20*mm, PAGE_H * 0.55, CONTENT_W - 40*mm, 12*mm,
                    3, fill=1, stroke=0)
        c.setFillColor(CREAM)
        c.setFont("Helvetica-Oblique", 11)
        c.drawCentredString(PAGE_W / 2, PAGE_H * 0.558,
                            "Dossier de Pr\u00e9sentation \u2014 Vision SaaS")

        # ── three pillars ────────────────────────────────────────────────
        pillars = [
            ("IA Google", "D\u00e9tection auto", "des ongles"),
            ("Flux AI", "Application r\u00e9aliste", "des styles"),
            ("SaaS", "Plateforme multi-salons", "scalable"),
        ]
        col_w = CONTENT_W / 3
        y_top = PAGE_H * 0.47
        for i, (title, desc1, desc2) in enumerate(pillars):
            x = MARGIN_L + i * col_w + col_w / 2

            c.setFillColor(TERRA)
            c.circle(x, y_top, 9*mm, fill=1, stroke=0)
            c.setFillColor(WHITE)
            c.setFont("Helvetica-Bold", 7.5)
            c.drawCentredString(x, y_top - 2.5*mm, title)

            c.setFillColor(CREAM)
            c.setFont("Helvetica", 7)
            c.drawCentredString(x, y_top - 14*mm, desc1)
            c.drawCentredString(x, y_top - 19*mm, desc2)

        # ── key stats strip ──────────────────────────────────────────────
        c.setFillColor(colors.Color(0.17, 0.12, 0.08, alpha=0.6))
        c.rect(0, PAGE_H * 0.28, PAGE_W, 20*mm, fill=1, stroke=0)

        stats = [
            ("15 000+", "salons en France"),
            ("80 000+", "pros en Europe"),
            ("18", "styles IA int\u00e9gr\u00e9s"),
            ("4 plans", "tarifaires SaaS"),
        ]
        stat_w = PAGE_W / 4
        for i, (val, lbl) in enumerate(stats):
            x = i * stat_w + stat_w / 2
            c.setFillColor(GOLD)
            c.setFont("Helvetica-Bold", 15)
            c.drawCentredString(x, PAGE_H * 0.28 + 10*mm, val)
            c.setFillColor(CREAM)
            c.setFont("Helvetica", 7.5)
            c.drawCentredString(x, PAGE_H * 0.28 + 4*mm, lbl)

        # ── date / confidential ──────────────────────────────────────────
        c.setFillColor(GREY_MID)
        c.setFont("Helvetica", 8)
        c.drawCentredString(PAGE_W / 2, 20*mm, "Mars 2026  \u2022  Document Confidentiel")

        # ── bottom terra bar ─────────────────────────────────────────────
        c.setFillColor(TERRA)
        c.rect(0, 0, PAGE_W, 3*mm, fill=1, stroke=0)


# ─── Custom Flowables ───────────────────────────────────────────────────────────
class SectionHeader(Flowable):
    """Full-width colored section header band."""
    def __init__(self, title, subtitle=None, icon=""):
        Flowable.__init__(self)
        self.title    = title
        self.subtitle = subtitle
        self.icon     = icon
        self.width    = CONTENT_W
        self.height   = 22*mm if subtitle else 16*mm

    def draw(self):
        c = self.canv
        # background
        c.setFillColor(DARK_BROWN)
        c.roundRect(0, 0, self.width, self.height, 3, fill=1, stroke=0)
        # left accent bar
        c.setFillColor(TERRA)
        c.rect(0, 0, 5, self.height, fill=1, stroke=0)

        # title
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 13)
        title_text = f"{self.icon}  {self.title}" if self.icon else self.title
        c.drawString(12, self.height - 12*mm + (3*mm if self.subtitle else 2*mm), title_text)

        if self.subtitle:
            c.setFillColor(GOLD)
            c.setFont("Helvetica-Oblique", 8)
            c.drawString(12, 4*mm, self.subtitle)

    def wrap(self, availW, availH):
        return self.width, self.height


class ColorBox(Flowable):
    """A rounded colored box with text — used for highlights/callouts."""
    def __init__(self, text, bg_color=CREAM, text_color=DARK_BROWN,
                 border_color=TERRA, width=None, height=None):
        Flowable.__init__(self)
        self.text        = text
        self.bg_color    = bg_color
        self.text_color  = text_color
        self.border_color= border_color
        self.box_width   = width or CONTENT_W
        self.box_height  = height or 14*mm

    def draw(self):
        c = self.canv
        c.setFillColor(self.bg_color)
        c.setStrokeColor(self.border_color)
        c.setLineWidth(1.2)
        c.roundRect(0, 0, self.box_width, self.box_height, 4, fill=1, stroke=1)
        c.setFillColor(self.text_color)
        c.setFont("Helvetica-BoldOblique", 10)
        c.drawString(10, self.box_height / 2 - 4, self.text)

    def wrap(self, availW, availH):
        return self.box_width, self.box_height


class DividerLine(Flowable):
    def __init__(self, color=TERRA, width=None, thickness=1):
        Flowable.__init__(self)
        self.color     = color
        self.div_width = width or CONTENT_W
        self.thickness = thickness

    def draw(self):
        c = self.canv
        c.setStrokeColor(self.color)
        c.setLineWidth(self.thickness)
        c.line(0, 0, self.div_width, 0)

    def wrap(self, availW, availH):
        return self.div_width, self.thickness + 1


class PriceCard(Flowable):
    """Pricing plan card."""
    def __init__(self, plan, price, period, features, highlight=False, width=None):
        Flowable.__init__(self)
        self.plan      = plan
        self.price     = price
        self.period    = period
        self.features  = features
        self.highlight = highlight
        self.card_w    = width or 42*mm
        self.card_h    = 80*mm

    def draw(self):
        c = self.canv
        bg = DARK_BROWN if self.highlight else CREAM
        border = TERRA if self.highlight else GREY_MID
        txt_color = WHITE if self.highlight else DARK_BROWN

        c.setFillColor(bg)
        c.setStrokeColor(border)
        c.setLineWidth(1.5 if self.highlight else 0.8)
        c.roundRect(0, 0, self.card_w, self.card_h, 5, fill=1, stroke=1)

        # plan name
        c.setFillColor(TERRA if self.highlight else TERRA_DARK)
        c.setFont("Helvetica-Bold", 9)
        c.drawCentredString(self.card_w / 2, self.card_h - 10*mm, self.plan.upper())

        # divider
        c.setStrokeColor(TERRA)
        c.setLineWidth(0.5)
        c.line(5, self.card_h - 13*mm, self.card_w - 5, self.card_h - 13*mm)

        # price
        c.setFillColor(WHITE if self.highlight else DARK_BROWN)
        c.setFont("Helvetica-Bold", 18)
        c.drawCentredString(self.card_w / 2, self.card_h - 22*mm, self.price)
        c.setFont("Helvetica", 7)
        c.setFillColor(GOLD if self.highlight else GREY_MID)
        c.drawCentredString(self.card_w / 2, self.card_h - 27*mm, self.period)

        # features
        c.setFont("Helvetica", 6.5)
        y = self.card_h - 34*mm
        for feat in self.features:
            c.setFillColor(TERRA)
            c.drawString(6, y, "✓")
            c.setFillColor(txt_color)
            c.drawString(14, y, feat)
            y -= 5.5*mm
            if y < 5:
                break

    def wrap(self, availW, availH):
        return self.card_w, self.card_h


# ─── Style helpers ──────────────────────────────────────────────────────────────
def make_styles():
    styles = getSampleStyleSheet()

    base = ParagraphStyle(
        "Base",
        fontName="Helvetica",
        fontSize=10,
        leading=15,
        textColor=DARK_BROWN,
        spaceAfter=4,
    )

    body = ParagraphStyle(
        "Body",
        parent=base,
        fontSize=10,
        leading=16,
        alignment=TA_JUSTIFY,
        spaceAfter=6,
    )

    body_bullet = ParagraphStyle(
        "BodyBullet",
        parent=base,
        fontSize=9.5,
        leading=15,
        leftIndent=15,
        spaceAfter=3,
    )

    h1 = ParagraphStyle(
        "H1",
        parent=base,
        fontSize=22,
        fontName="Helvetica-Bold",
        textColor=WHITE,
        alignment=TA_CENTER,
        spaceAfter=6,
    )

    h2 = ParagraphStyle(
        "H2",
        parent=base,
        fontSize=15,
        fontName="Helvetica-Bold",
        textColor=TERRA,
        spaceAfter=8,
        spaceBefore=4,
    )

    h3 = ParagraphStyle(
        "H3",
        parent=base,
        fontSize=11,
        fontName="Helvetica-Bold",
        textColor=DARK_BROWN,
        spaceAfter=5,
        spaceBefore=4,
    )

    caption = ParagraphStyle(
        "Caption",
        parent=base,
        fontSize=8,
        textColor=MID_BROWN,
        alignment=TA_CENTER,
        spaceAfter=4,
    )

    tag = ParagraphStyle(
        "Tag",
        parent=base,
        fontSize=8.5,
        fontName="Helvetica-Bold",
        textColor=WHITE,
        backColor=TERRA,
        alignment=TA_CENTER,
        spaceAfter=4,
    )

    callout = ParagraphStyle(
        "Callout",
        parent=base,
        fontSize=11,
        fontName="Helvetica-BoldOblique",
        textColor=TERRA_DARK,
        alignment=TA_CENTER,
        spaceBefore=8,
        spaceAfter=8,
    )

    cover_title = ParagraphStyle(
        "CoverTitle",
        parent=base,
        fontSize=28,
        fontName="Helvetica-Bold",
        textColor=WHITE,
        alignment=TA_CENTER,
        leading=34,
        spaceAfter=6,
    )

    cover_sub = ParagraphStyle(
        "CoverSub",
        parent=base,
        fontSize=14,
        fontName="Helvetica-Oblique",
        textColor=CREAM,
        alignment=TA_CENTER,
        spaceAfter=4,
    )

    cover_tag = ParagraphStyle(
        "CoverTag",
        parent=base,
        fontSize=10,
        fontName="Helvetica",
        textColor=GOLD,
        alignment=TA_CENTER,
        spaceAfter=4,
    )

    toc = ParagraphStyle(
        "TOC",
        parent=base,
        fontSize=10,
        leading=18,
        textColor=DARK_BROWN,
    )

    return {
        "base": base, "body": body, "body_bullet": body_bullet,
        "h1": h1, "h2": h2, "h3": h3,
        "caption": caption, "tag": tag, "callout": callout,
        "cover_title": cover_title, "cover_sub": cover_sub, "cover_tag": cover_tag,
        "toc": toc,
    }


# ─── Cover Page ────────────────────────────────────────────────────────────────
def build_cover(s):
    # The cover is drawn entirely by HeaderFooterCanvas.draw_cover() for page 1.
    # We just emit a PageBreak so the next section starts on page 2.
    return [PageBreak()]


# ─── Table of Contents ─────────────────────────────────────────────────────────
def build_toc(s):
    story = []
    story.append(Spacer(1, 8*mm))
    story.append(SectionHeader("SOMMAIRE", "Vue d'ensemble du dossier", icon=""))
    story.append(Spacer(1, 6*mm))

    toc_items = [
        ("01", "Résumé Exécutif",             "03"),
        ("02", "Le Problème",                  "04"),
        ("03", "La Solution — NailSim Pro",    "05"),
        ("04", "Fonctionnalités Actuelles",    "06"),
        ("05", "Parcours Utilisateur",         "07"),
        ("06", "Feuille de Route SaaS",        "08"),
        ("07", "Architecture Technique",       "09"),
        ("08", "Modèle Tarifaire",             "10"),
        ("09", "Opportunité de Marché",        "11"),
        ("10", "Avantages Concurrentiels",     "12"),
        ("11", "Prochaines Étapes",            "13"),
    ]

    for num, title, page in toc_items:
        row_data = [
            Paragraph(f'<font color="#C27B4A"><b>{num}</b></font>', s["body"]),
            Paragraph(title, s["toc"]),
            Paragraph(f'<font color="#C27B4A"><b>{page}</b></font>', s["toc"]),
        ]
        tbl = Table([row_data], colWidths=[12*mm, CONTENT_W - 24*mm, 12*mm])
        tbl.setStyle(TableStyle([
            ("VALIGN",       (0, 0), (-1, -1), "MIDDLE"),
            ("BOTTOMPADDING",(0, 0), (-1, -1), 6),
            ("TOPPADDING",   (0, 0), (-1, -1), 6),
            ("LINEBELOW",    (0, 0), (-1, -1), 0.3, LIGHT_TAN),
            ("ALIGN",        (2, 0), (2, 0),   "RIGHT"),
        ]))
        story.append(tbl)

    story.append(PageBreak())
    return story


# ─── Section 01 — Résumé Exécutif ─────────────────────────────────────────────
def build_executive_summary(s):
    story = []
    story.append(Spacer(1, 8*mm))
    story.append(SectionHeader("01 — RÉSUMÉ EXÉCUTIF",
                               "Ce que NailSim Pro apporte au marché"))
    story.append(Spacer(1, 5*mm))

    intro = (
        "<b>NailSim Pro</b> est une application web mobile permettant à une cliente de "
        "<b>visualiser en temps réel le rendu de ses ongles</b> avant de réserver une prestation. "
        "Grâce à l'intelligence artificielle (Google MediaPipe + Flux Fill AI de Black Forest Labs), "
        "la simulation est photoréaliste, ultra-rapide et ne nécessite aucune installation."
    )
    story.append(Paragraph(intro, s["body"]))
    story.append(Spacer(1, 4*mm))

    story.append(ColorBox(
        "\" Voir c'est croire — et croire, c'est réserver. \"",
        bg_color=CREAM, text_color=TERRA_DARK, border_color=TERRA,
        height=14*mm
    ))
    story.append(Spacer(1, 5*mm))

    # 3-column highlights
    cols_data = [[
        Paragraph('<b><font color="#C27B4A">POUR LA CLIENTE</font></b><br/><br/>'
                  'Elle essaie virtuellement 18+ styles depuis son smartphone, '
                  'choisit sa forme, longueur et style, et part sûre de son choix.', s["body"]),
        Paragraph('<b><font color="#C27B4A">POUR LE SALON</font></b><br/><br/>'
                  'Moins d\'hésitations = plus de réservations confirmées. '
                  'Capture de leads automatique et intégration directe au système de prise de RDV.', s["body"]),
        Paragraph('<b><font color="#C27B4A">POUR L\'INDUSTRIE</font></b><br/><br/>'
                  '15 000 salons en France sans outil de simulation. '
                  'NailSim Pro est la première solution SaaS pensée exclusivement pour les prothésistes.', s["body"]),
    ]]
    tbl = Table(cols_data, colWidths=[CONTENT_W / 3 - 3*mm] * 3,
                hAlign="LEFT")
    tbl.setStyle(TableStyle([
        ("BACKGROUND",   (0, 0), (0, 0), CREAM),
        ("BACKGROUND",   (1, 0), (1, 0), LIGHT_TAN),
        ("BACKGROUND",   (2, 0), (2, 0), CREAM),
        ("BOX",          (0, 0), (0, 0), 0.8, TERRA),
        ("BOX",          (1, 0), (1, 0), 0.8, TERRA),
        ("BOX",          (2, 0), (2, 0), 0.8, TERRA),
        ("VALIGN",       (0, 0), (-1, -1), "TOP"),
        ("PADDING",      (0, 0), (-1, -1), 8),
        ("LEFTPADDING",  (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING",   (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 10),
        ("COLUMNPADDING",(0, 0), (-1, -1), 5),
    ]))
    story.append(tbl)
    story.append(Spacer(1, 5*mm))

    story.append(Paragraph(
        "L'Institut Naïram Narjisse (Tresses, Bordeaux) a été <b>le premier salon à déployer "
        "NailSim Pro</b> et en est la vitrine opérationnelle. Le projet évolue aujourd'hui vers "
        "une <b>plateforme SaaS commercialisable</b> à l'ensemble des salons de prothèse ongulaire "
        "en France et en Europe.", s["body"]
    ))

    story.append(PageBreak())
    return story


# ─── Section 02 — Le Problème ──────────────────────────────────────────────────
def build_problem(s):
    story = []
    story.append(Spacer(1, 8*mm))
    story.append(SectionHeader("02 — LE PROBLÈME",
                               "Pourquoi les clientes hésitent et les salons perdent des réservations"))
    story.append(Spacer(1, 5*mm))

    story.append(Paragraph(
        "Le secteur de la prothèse ongulaire souffre d'un <b>problème d'engagement</b> "
        "persistant : les clientes veulent un résultat précis mais ne savent pas "
        "comment visualiser le rendu final. Cela engendre hésitation, annulation "
        "et frustration — des deux côtés.", s["body"]
    ))
    story.append(Spacer(1, 4*mm))

    problems = [
        ("POUR LA CLIENTE", [
            "Impossible de visualiser le rendu final avant la prestation",
            "Découverte déçue en salle : la couleur ou la forme ne correspond pas",
            "Scrolling infini sur Instagram sans savoir ce qui conviendra à SA main",
            "Hésitation en salon = séance rallongée, rendez-vous suivants décalés",
            "Regrets après la pose : \"j'aurais dû choisir autre chose\"",
        ]),
        ("POUR LE SALON", [
            "Rendez-vous annulés ou raccourcis faute de décision claire",
            "Temps perdu à montrer des catalogues papier ou Pinterest",
            "Pas d'outil de capture automatique des coordonnées clientes",
            "Impossibilité de convertir une visiteuse Instagram en réservation directe",
            "Aucun tableau de bord pour savoir quels styles sont populaires",
        ]),
    ]

    for section_title, items in problems:
        story.append(Paragraph(f'<b><font color="#C27B4A">{section_title}</font></b>',
                               s["h3"]))
        for item in items:
            story.append(Paragraph(f'<font color="#C27B4A">✗</font>  {item}',
                                   s["body_bullet"]))
        story.append(Spacer(1, 4*mm))

    # Impact chiffré
    story.append(DividerLine(color=TERRA, thickness=1))
    story.append(Spacer(1, 3*mm))
    stats_data = [
        ["Indicateur", "Estimation", "Impact"],
        ["Clientes indécises avant une pose", "~60 %", "Séances rallongées, annulations"],
        ["Taux d'annulation moyen (beauté)", "~20 %", "Perte directe de chiffre d'affaires"],
        ["Temps moyen \"choix du style\" en salon", "15-25 min", "Rentabilité réduite"],
        ["Clientes qui reviendraient si mieux guidées", "> 70 %", "Fidélisation immédiate"],
    ]
    tbl = Table(stats_data,
                colWidths=[CONTENT_W * 0.42, CONTENT_W * 0.22, CONTENT_W * 0.36])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",   (0, 0), (-1, 0), DARK_BROWN),
        ("TEXTCOLOR",    (0, 0), (-1, 0), WHITE),
        ("FONTNAME",     (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",     (0, 0), (-1, 0), 9),
        ("ALIGN",        (1, 0), (1, -1), "CENTER"),
        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [CREAM, LIGHT_TAN]),
        ("FONTSIZE",     (0, 1), (-1, -1), 8.5),
        ("PADDING",      (0, 0), (-1, -1), 6),
        ("LINEBELOW",    (0, 0), (-1, -1), 0.3, GREY_MID),
        ("TEXTCOLOR",    (1, 1), (1, -1), TERRA_DARK),
        ("FONTNAME",     (1, 1), (1, -1), "Helvetica-Bold"),
    ]))
    story.append(tbl)

    story.append(PageBreak())
    return story


# ─── Section 03 — La Solution ──────────────────────────────────────────────────
def build_solution(s):
    story = []
    story.append(Spacer(1, 8*mm))
    story.append(SectionHeader("03 — LA SOLUTION : NAILSIM PRO",
                               "Simulateur IA photoréaliste, mobile, instantané"))
    story.append(Spacer(1, 5*mm))

    story.append(Paragraph(
        "<b>NailSim Pro</b> est une application web progressive (PWA) accessible depuis "
        "n'importe quel smartphone, sans téléchargement. En moins de <b>60 secondes</b>, "
        "une cliente peut prendre une photo de sa main, choisir son style et voir "
        "le résultat photoréaliste directement sur ses propres ongles.", s["body"]
    ))
    story.append(Spacer(1, 5*mm))

    story.append(Paragraph("Le parcours en 5 étapes", s["h3"]))

    steps = [
        ("1", "PHOTO", "La cliente prend une photo de sa main (ou en importe une). L'application guide avec un cadre de prise de vue optimisé."),
        ("2", "DÉTECTION IA", "Google MediaPipe analyse l'image et détecte automatiquement tous les ongles. Aucune action manuelle requise."),
        ("3", "CHOIX DU STYLE", "La cliente sélectionne : type de service, longueur (S/M/L), forme (carrée, ronde, amande, stiletto, coffin), puis son style parmi 18 options."),
        ("4", "SIMULATION IA", "Flux Fill AI (Black Forest Labs) applique le style choisi uniquement sur les zones d'ongles détectées. La main reste 100% réelle."),
        ("5", "PARTAGE / RDV", "La cliente sauvegarde le résultat, l'envoie par email ou le partage. Un bouton \"Réserver ce look\" l'emmène directement sur Planity/Calendly."),
    ]

    for num, title, desc in steps:
        row = [[
            Paragraph(f'<b><font color="white">{num}</font></b>', s["body"]),
            Paragraph(f'<b><font color="#C27B4A">{title}</font></b><br/>{desc}', s["body"]),
        ]]
        tbl = Table(row, colWidths=[10*mm, CONTENT_W - 10*mm])
        tbl.setStyle(TableStyle([
            ("BACKGROUND",    (0, 0), (0, 0), TERRA),
            ("BACKGROUND",    (1, 0), (1, 0), CREAM if int(num) % 2 == 1 else LIGHT_TAN),
            ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
            ("ALIGN",         (0, 0), (0, 0),   "CENTER"),
            ("PADDING",       (0, 0), (-1, -1), 7),
            ("LINEBELOW",     (0, 0), (-1, -1), 0.4, GREY_MID),
            ("FONTNAME",      (0, 0), (0, 0),   "Helvetica-Bold"),
            ("FONTSIZE",      (0, 0), (0, 0),   14),
        ]))
        story.append(tbl)

    story.append(Spacer(1, 5*mm))

    story.append(Paragraph(
        "L'application est déployée sur <b>narjisse.vercel.app</b> et déjà utilisée "
        "quotidiennement par les clientes de l'Institut Naïram Narjisse. "
        "Elle est installable comme une application native sur iPhone (PWA).", s["body"]
    ))

    story.append(PageBreak())
    return story


# ─── Section 04 — Fonctionnalités actuelles ────────────────────────────────────
def build_features(s):
    story = []
    story.append(Spacer(1, 8*mm))
    story.append(SectionHeader("04 — FONCTIONNALITÉS ACTUELLES",
                               "Ce qui est déjà construit et opérationnel"))
    story.append(Spacer(1, 5*mm))

    features = [
        ("Application web mobile (iOS/Android)",
         "Accessible depuis Safari/Chrome sans installation. Installable en PWA sur l'écran d'accueil."),
        ("Capture photo de la main cliente",
         "Interface guidée pour capturer ou importer une photo de la main."),
        ("Détection IA des ongles (Google MediaPipe)",
         "Identification automatique et précise de chaque ongle sur la photo."),
        ("18 styles de nail art intégrés",
         "French, Blanc laiteux, Baby boomer, Nude rosé, Floral & or, Rouge passion, Bordeaux, "
         "Brown freestyle, Violet chrome, Rose poudré, Noir mat, Or chrome, Corail pêche, "
         "Lilas pastel, Vert émeraude, Arabesques or, Bleu nuit, Nude taupe."),
        ("Choix de forme (5 options)",
         "Carrée, Ronde, Amande, Stiletto, Coffin."),
        ("Choix de longueur (3 options)",
         "Court (S), Moyen (M), Long (L)."),
        ("Choix du type de service",
         "Pose gel, résine, semi-permanent, etc."),
        ("Simulation photoréaliste (Flux Fill AI)",
         "L'IA applique le style uniquement sur les ongles, en préservant l'aspect réel de la main."),
        ("Écran de résultat",
         "Affichage du visuel simulé avec options de sauvegarde, d'envoi par email et de partage."),
        ("Branding NM Institut",
         "Interface personnalisée aux couleurs de l'Institut Naïram Narjisse."),
        ("Déploiement Vercel (serverless)",
         "Infrastructure scalable, zéro maintenance serveur, déploiements continus."),
        ("Optimisation iOS",
         "Expérience native-like sur iPhone avec splash screen et icône dédiée."),
    ]

    for feat_title, feat_desc in features:
        row = [[
            Paragraph('<font color="#2C8C50" size="12"><b>✓</b></font>', s["body"]),
            Paragraph(f'<b>{feat_title}</b><br/>'
                      f'<font color="#5C3D2E" size="9">{feat_desc}</font>', s["body"]),
        ]]
        tbl = Table(row, colWidths=[8*mm, CONTENT_W - 8*mm])
        tbl.setStyle(TableStyle([
            ("VALIGN",    (0, 0), (-1, -1), "TOP"),
            ("PADDING",   (0, 0), (-1, -1), 5),
            ("LINEBELOW", (0, 0), (-1, -1), 0.3, LIGHT_TAN),
        ]))
        story.append(tbl)

    story.append(Spacer(1, 4*mm))
    story.append(ColorBox(
        "Application déjà live sur narjisse.vercel.app — testée et validée par de vraies clientes",
        bg_color=DARK_BROWN, text_color=GOLD, border_color=TERRA,
        height=13*mm
    ))

    story.append(PageBreak())
    return story


# ─── Section 05 — Parcours Utilisateur ────────────────────────────────────────
def build_user_journey(s):
    story = []
    story.append(Spacer(1, 8*mm))
    story.append(SectionHeader("05 — PARCOURS UTILISATEUR",
                               "De la réception à la réservation confirmée"))
    story.append(Spacer(1, 5*mm))

    story.append(Paragraph(
        "Voici comment une cliente vit son expérience NailSim Pro, que ce soit "
        "depuis chez elle sur Instagram ou directement à l'accueil du salon :", s["body"]
    ))
    story.append(Spacer(1, 4*mm))

    journey_steps = [
        ("Découverte", "#FAF5F0",
         "La cliente scanne le QR code à l'accueil du salon (ou clique sur le lien en bio Instagram). "
         "L'application NailSim Pro s'ouvre instantanément dans son navigateur."),
        ("Capture", "#E8D5C4",
         "Elle prend une photo de sa main via la caméra frontale ou importe une photo existante. "
         "Un guide visuel l'aide à bien cadrer."),
        ("Sélection", "#FAF5F0",
         "Elle choisit son service (gel, résine…), longueur (S/M/L), forme (5 options) "
         "puis son style parmi les 18 propositions, illustrées par des vignettes."),
        ("Simulation", "#E8D5C4",
         "En quelques secondes, l'IA génère le rendu sur SA propre main. "
         "Elle peut tester plusieurs styles à la suite, comparer avant/après."),
        ("Partage & RDV", "#FAF5F0",
         "Elle sauvegarde son simulation préféré, le partage sur ses réseaux, "
         "envoie par email à la prothésiste et réserve son rendez-vous en 1 clic. "
         "Le salon reçoit une notification avec le look choisi."),
    ]

    for i, (step, bg, desc) in enumerate(journey_steps):
        row = [[
            Paragraph(f'<b><font color="#C27B4A">{i+1}</font></b><br/>'
                      f'<b><font size="8">{step.upper()}</font></b>',
                      ParagraphStyle("StepNum", parent=s["body"],
                                     alignment=TA_CENTER, fontSize=18)),
            Paragraph(f'<b>{step}</b><br/>{desc}', s["body"]),
        ]]
        tbl = Table(row, colWidths=[22*mm, CONTENT_W - 22*mm])
        tbl.setStyle(TableStyle([
            ("BACKGROUND",  (0, 0), (0, 0), DARK_BROWN),
            ("BACKGROUND",  (1, 0), (1, 0), colors.HexColor(bg)),
            ("VALIGN",      (0, 0), (-1, -1), "MIDDLE"),
            ("ALIGN",       (0, 0), (0, 0), "CENTER"),
            ("PADDING",     (0, 0), (-1, -1), 9),
            ("LINEBELOW",   (0, 0), (-1, -1), 0.4, GREY_MID),
        ]))
        story.append(tbl)

    story.append(Spacer(1, 5*mm))
    story.append(Paragraph(
        "<b>Résultat :</b> une cliente informée, confiante et engagée arrive à son rendez-vous "
        "avec une idée précise. <b>Moins d'annulations, plus de satisfaction, "
        "plus de recommandations.</b>", s["body"]
    ))

    story.append(PageBreak())
    return story


# ─── Section 06 — Feuille de route ────────────────────────────────────────────
def build_roadmap(s):
    story = []
    story.append(Spacer(1, 8*mm))
    story.append(SectionHeader("06 — FEUILLE DE ROUTE SAAS",
                               "Les fonctionnalités à venir, organisées en phases"))
    story.append(Spacer(1, 5*mm))

    phases = [
        ("PHASE 1 — Lancement Commercial (T2 2026)", TERRA, [
            ("Bibliothèque de styles personnalisés",
             "Les salons importent leurs photos Instagram comme styles sélectionnables."),
            ("Capture de leads automatique",
             "Collecte email/téléphone en fin de simulation + notification salon en temps réel."),
            ("Bouton \"Réserver ce look\"",
             "Intégration Planity / Calendly / Doctolib Beauté."),
            ("QR code salon",
             "Chaque salon reçoit son QR code dédié à afficher en réception."),
        ]),
        ("PHASE 2 — Enrichissement IA (T3-T4 2026)", MID_BROWN, [
            ("Analyse du teint",
             "L'IA analyse la carnation de la main et recommande les couleurs les plus flatteuses."),
            ("Mode AR temps réel",
             "Superposition live sur la caméra (comme un filtre Snapchat) sans photo à prendre."),
            ("Collections saisonnières",
             "Nouveaux styles IA générés chaque saison et poussés automatiquement à tous les salons."),
            ("Comparaison avant/après",
             "Slide interactif pour comparer la main naturelle et la simulation."),
        ]),
        ("PHASE 3 — Plateforme Multi-Salons (2027)", DARK_BROWN, [
            ("White-label multi-tenant",
             "Chaque salon obtient son sous-domaine, ses couleurs et son logo propres."),
            ("Tableau de bord salon",
             "Analytics : styles populaires, leads capturés, taux de conversion, historique."),
            ("Profils clientes",
             "Sauvegarde des simulations, wishlist de looks, historique des poses."),
            ("Partage social",
             "Export au format Stories Instagram/TikTok depuis l'application."),
            ("Multi-langue",
             "Interface disponible en français, anglais et arabe."),
            ("Système de parrainage",
             "Salons partenaires qui recommandent NailSim Pro bénéficient d'une commission."),
        ]),
    ]

    for phase_title, color, items in phases:
        # Phase header
        ph_row = [[Paragraph(f'<font color="white"><b>{phase_title}</b></font>', s["body"])]]
        ph_tbl = Table(ph_row, colWidths=[CONTENT_W])
        ph_tbl.setStyle(TableStyle([
            ("BACKGROUND",  (0, 0), (-1, -1), color),
            ("PADDING",     (0, 0), (-1, -1), 8),
        ]))
        story.append(ph_tbl)

        for feat, desc in items:
            row = [[
                Paragraph('<font color="#C27B4A">→</font>', s["body"]),
                Paragraph(f'<b>{feat}</b>  <font color="#5C3D2E" size="9">— {desc}</font>',
                          s["body"]),
            ]]
            tbl = Table(row, colWidths=[8*mm, CONTENT_W - 8*mm])
            tbl.setStyle(TableStyle([
                ("VALIGN",   (0, 0), (-1, -1), "TOP"),
                ("PADDING",  (0, 0), (-1, -1), 5),
                ("LINEBELOW",(0, 0), (-1, -1), 0.3, LIGHT_TAN),
                ("BACKGROUND",(0, 0), (-1, -1), GREY_LIGHT),
            ]))
            story.append(tbl)

        story.append(Spacer(1, 3*mm))

    story.append(PageBreak())
    return story


# ─── Section 07 — Architecture technique ──────────────────────────────────────
def build_architecture(s):
    story = []
    story.append(Spacer(1, 8*mm))
    story.append(SectionHeader("07 — ARCHITECTURE TECHNIQUE",
                               "Simple, fiable, scalable — sans serveur à gérer"))
    story.append(Spacer(1, 5*mm))

    story.append(Paragraph(
        "NailSim Pro repose sur une stack moderne, entièrement managée, "
        "qui permet de servir des milliers de salons simultanément "
        "<b>sans infrastructure propre à maintenir</b>.", s["body"]
    ))
    story.append(Spacer(1, 4*mm))

    # Architecture diagram (textual)
    layers = [
        ("FRONTEND", "Next.js / React (PWA)", TERRA,
         "Application web progressive — installable comme app native sur iPhone/Android. "
         "Interface optimisée mobile-first, responsive."),
        ("DÉPLOIEMENT", "Vercel (serverless)", MID_BROWN,
         "Hébergement et déploiement automatique. CDN mondial, zéro downtime, "
         "scalabilité automatique. Déploiement en 1 commande git push."),
        ("IA — DÉTECTION", "Google MediaPipe", DARK_BROWN,
         "Modèle de détection de main open-source de Google. "
         "Tournant côté client (dans le navigateur), sans coût d'API. "
         "Précision élevée même sur des photos de qualité variable."),
        ("IA — GÉNÉRATION", "Flux Fill (Black Forest Labs) via Replicate", TERRA_DARK,
         "API d'inpainting de référence mondiale. Génère un rendu photoréaliste "
         "du style choisi uniquement sur les zones d'ongles masquées par MediaPipe. "
         "Facturé à l'usage (pay-as-you-go)."),
        ("DONNÉES", "Base de données + Authentification", MID_BROWN,
         "Pour le SaaS : Supabase (PostgreSQL managé) pour stocker les profils salons, "
         "clientes, simulations, leads et analytics. Auth intégrée."),
        ("INTÉGRATIONS", "Booking / Email / Analytics", DARK_BROWN,
         "Planity, Calendly, Doctolib Beauté pour la prise de RDV. "
         "SendGrid/Resend pour les emails automatiques. "
         "Plausible Analytics pour les tableaux de bord."),
    ]

    for layer, tech, color, desc in layers:
        row = [[
            Paragraph(f'<font color="white"><b>{layer}</b></font>', s["body"]),
            Paragraph(f'<b><font color="#C27B4A">{tech}</font></b><br/>'
                      f'<font size="8.5">{desc}</font>', s["body"]),
        ]]
        tbl = Table(row, colWidths=[38*mm, CONTENT_W - 38*mm])
        tbl.setStyle(TableStyle([
            ("BACKGROUND",  (0, 0), (0, 0), color),
            ("BACKGROUND",  (1, 0), (1, 0), CREAM),
            ("VALIGN",      (0, 0), (-1, -1), "MIDDLE"),
            ("ALIGN",       (0, 0), (0, 0), "CENTER"),
            ("PADDING",     (0, 0), (-1, -1), 9),
            ("LINEBELOW",   (0, 0), (-1, -1), 0.4, LIGHT_TAN),
        ]))
        story.append(tbl)

    story.append(Spacer(1, 5*mm))

    avantages = [
        "Aucun serveur à administrer — zéro maintenance infrastructure",
        "Coûts variables (pay-as-you-go IA) : les coûts croissent avec le revenu",
        "Déploiement mondial immédiat via le CDN Vercel",
        "Stack JavaScript unifiée (React) : un seul développeur peut tout maintenir",
        "API Replicate : swap d'IA possible sans réécrire le frontend",
        "RGPD-friendly : photos traitées à la volée, non stockées par défaut",
    ]

    story.append(Paragraph("Avantages de cette architecture", s["h3"]))
    for av in avantages:
        story.append(Paragraph(
            f'<font color="#C27B4A">●</font>  {av}', s["body_bullet"]
        ))

    story.append(PageBreak())
    return story


# ─── Section 08 — Modèle tarifaire ────────────────────────────────────────────
def build_pricing(s):
    story = []
    story.append(Spacer(1, 8*mm))
    story.append(SectionHeader("08 — MODÈLE TARIFAIRE",
                               "4 plans adaptés à chaque profil de salon"))
    story.append(Spacer(1, 5*mm))

    story.append(Paragraph(
        "NailSim Pro adopte un modèle SaaS par abonnement mensuel, "
        "sans engagement initial. Chaque plan inclut un accès complet à la plateforme "
        "correspondant aux besoins du salon.", s["body"]
    ))
    story.append(Spacer(1, 5*mm))

    plans = [
        PriceCard(
            plan="Starter",
            price="29 €",
            period="/ mois",
            features=[
                "1 salon",
                "18 styles standard",
                "QR code salon",
                "Statistiques basiques",
                "Support email",
            ],
            highlight=False,
            width=39*mm,
        ),
        PriceCard(
            plan="Pro",
            price="79 €",
            period="/ mois",
            features=[
                "Bibliothèque styles custom",
                "Intégration RDV",
                "Capture de leads",
                "Analytics avancés",
                "Notifs en temps réel",
                "Support prioritaire",
            ],
            highlight=True,
            width=39*mm,
        ),
        PriceCard(
            plan="Premium",
            price="149 €",
            period="/ mois",
            features=[
                "Mode AR temps réel",
                "Multi-établissements",
                "Collections saisonnières",
                "Accès API",
                "Analyse teint IA",
                "Support dédié",
            ],
            highlight=False,
            width=39*mm,
        ),
        PriceCard(
            plan="White-Label",
            price="299 €",
            period="/ mois",
            features=[
                "Branding 100% custom",
                "Sous-domaine dédié",
                "Onboarding personnalisé",
                "Tous les modules",
                "SLA garanti",
                "Account manager",
            ],
            highlight=False,
            width=39*mm,
        ),
    ]

    cards_row = [[card] for card in plans]
    # Place all 4 cards in a single row
    single_row = [[p for p in plans]]
    tbl = Table(single_row,
                colWidths=[39*mm, 39*mm, 39*mm, 39*mm],
                hAlign="CENTER")
    tbl.setStyle(TableStyle([
        ("VALIGN",  (0, 0), (-1, -1), "TOP"),
        ("PADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(tbl)

    story.append(Spacer(1, 5*mm))

    # Revenue projection table
    story.append(Paragraph("Projection de chiffre d'affaires récurrent", s["h3"]))
    story.append(Paragraph(
        "Avec seulement une fraction du marché français, le potentiel est considérable :", s["body"]
    ))
    story.append(Spacer(1, 3*mm))

    rev_data = [
        ["Scénario", "Salons abonnés", "Plan moyen", "ARR estimé"],
        ["Lancement (6 mois)", "50", "Starter (~29 €)", "~17 400 €/an"],
        ["Croissance (an 1)", "200", "Mix (~60 €)", "~144 000 €/an"],
        ["Scale (an 2)", "600", "Mix (~79 €)", "~568 000 €/an"],
        ["Maturité (an 3)", "1 500", "Mix (~90 €)", "~1 620 000 €/an"],
    ]

    tbl2 = Table(rev_data,
                 colWidths=[CONTENT_W * 0.30, CONTENT_W * 0.22,
                            CONTENT_W * 0.24, CONTENT_W * 0.24])
    tbl2.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0), DARK_BROWN),
        ("TEXTCOLOR",     (0, 0), (-1, 0), WHITE),
        ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",      (0, 0), (-1, 0), 9),
        ("ALIGN",         (1, 0), (-1, -1), "CENTER"),
        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [CREAM, LIGHT_TAN]),
        ("FONTSIZE",      (0, 1), (-1, -1), 8.5),
        ("PADDING",       (0, 0), (-1, -1), 7),
        ("LINEBELOW",     (0, 0), (-1, -1), 0.3, GREY_MID),
        ("TEXTCOLOR",     (3, 1), (3, -1), TERRA_DARK),
        ("FONTNAME",      (3, 1), (3, -1), "Helvetica-Bold"),
    ]))
    story.append(tbl2)

    story.append(PageBreak())
    return story


# ─── Section 09 — Opportunité de marché ───────────────────────────────────────
def build_market(s):
    story = []
    story.append(Spacer(1, 8*mm))
    story.append(SectionHeader("09 — OPPORTUNITÉ DE MARCHÉ",
                               "Un marché de masse sans solution existante"))
    story.append(Spacer(1, 5*mm))

    story.append(Paragraph(
        "Le marché de la prothèse ongulaire est en forte croissance, porté par les "
        "réseaux sociaux et une clientèle de plus en plus exigeante sur le rendu visuel. "
        "Or, <b>il n'existe aujourd'hui aucun outil de simulation IA</b> spécialement "
        "conçu pour ce marché en France ou en Europe.", s["body"]
    ))
    story.append(Spacer(1, 5*mm))

    market_data = [
        ["Marché", "Volume", "Potentiel SaaS (1% pénétration)"],
        ["Salons de beauté + prothésistes France", "~15 000", "~150 abonnés → ~130 K€/an"],
        ["Prothésistes indépendantes France", "~8 000", "~80 abonnés → ~70 K€/an"],
        ["Europe (EU-27 + UK)", "~80 000+", "~800 abonnés → ~700 K€/an"],
        ["Monde (EN/AR)   ← phase 3", "~500 000+", "Potentiel > 5 M€/an"],
    ]

    tbl = Table(market_data,
                colWidths=[CONTENT_W * 0.42, CONTENT_W * 0.22, CONTENT_W * 0.36])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0), DARK_BROWN),
        ("TEXTCOLOR",     (0, 0), (-1, 0), WHITE),
        ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",      (0, 0), (-1, 0), 9),
        ("ALIGN",         (1, 0), (-1, -1), "CENTER"),
        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [CREAM, LIGHT_TAN]),
        ("FONTSIZE",      (0, 1), (-1, -1), 8.5),
        ("PADDING",       (0, 0), (-1, -1), 7),
        ("LINEBELOW",     (0, 0), (-1, -1), 0.3, GREY_MID),
        ("TEXTCOLOR",     (2, 1), (2, -1), TERRA_DARK),
        ("FONTNAME",      (2, 1), (2, -1), "Helvetica-Bold"),
    ]))
    story.append(tbl)

    story.append(Spacer(1, 5*mm))

    story.append(Paragraph("Tendances qui accélèrent l'adoption", s["h3"]))
    trends = [
        ("Croissance du marché nail art", "+12%/an en France depuis 2020, porté par TikTok et Instagram."),
        ("Attente de digitalisation", "Les salons indépendants cherchent des outils accessibles et abordables."),
        ("IA grand public", "ChatGPT a normalisé l'IA : les propriétaires de salons sont réceptifs."),
        ("Zéro friction", "Une PWA sans installation lève la barrière d'adoption pour les clientes."),
        ("Modèle SaaS", "Abonnement mensuel préféré aux logiciels on-premise par les TPE/PME."),
        ("Instagram → RDV", "Le parcours visuel est déjà naturel : NailSim s'insère dans ce flux."),
    ]
    for title, desc in trends:
        story.append(Paragraph(
            f'<font color="#C27B4A">▶</font>  <b>{title}</b>  — {desc}',
            s["body_bullet"]
        ))

    story.append(Spacer(1, 5*mm))
    story.append(ColorBox(
        "Fenêtre d'opportunité : être premier sur ce marché = avantage décisif",
        bg_color=DARK_BROWN, text_color=GOLD, border_color=TERRA, height=13*mm
    ))

    story.append(PageBreak())
    return story


# ─── Section 10 — Avantages concurrentiels ─────────────────────────────────────
def build_competitive(s):
    story = []
    story.append(Spacer(1, 8*mm))
    story.append(SectionHeader("10 — AVANTAGES CONCURRENTIELS",
                               "Pourquoi NailSim Pro est difficile à copier"))
    story.append(Spacer(1, 5*mm))

    story.append(Paragraph(
        "Il existe quelques applications de simulation d'ongles (principalement asiatiques "
        "ou génériques), mais <b>aucune ne combine</b> la précision de détection IA, "
        "la simulation photoréaliste sur la vraie main et le modèle SaaS B2B "
        "pour les professionnels.", s["body"]
    ))
    story.append(Spacer(1, 4*mm))

    comp_data = [
        ["", "NailSim Pro", "Apps généralistes", "Filtres AR simples", "Catalogues papier"],
        ["Simulation sur vraie main",          "✓", "Partiel", "✗",  "✗"],
        ["IA photoréaliste (Flux)",             "✓", "✗",       "✗",  "✗"],
        ["Détection auto des ongles (MediaPipe)","✓","Partiel", "✓",  "✗"],
        ["18+ styles pro personnalisables",     "✓", "✓",       "✗",  "✓"],
        ["SaaS B2B multi-salons",               "✓", "✗",       "✗",  "✗"],
        ["Intégration prise de RDV",            "✓", "✗",       "✗",  "✗"],
        ["Capture de leads automatique",        "✓", "✗",       "✗",  "✗"],
        ["Tableau de bord salon",               "✓", "✗",       "✗",  "✗"],
        ["White-label custom",                  "✓", "✗",       "✗",  "✗"],
        ["PWA sans installation",               "✓", "Partiel", "✗",  "N/A"],
        ["Marché francophone ciblé",            "✓", "✗",       "✗",  "✓"],
    ]

    col_w = [CONTENT_W * 0.38] + [CONTENT_W * 0.155] * 4
    tbl = Table(comp_data, colWidths=col_w)
    style_cmds = [
        ("BACKGROUND",    (0, 0), (-1, 0), DARK_BROWN),
        ("TEXTCOLOR",     (0, 0), (-1, 0), WHITE),
        ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",      (0, 0), (-1, 0), 8),
        ("ALIGN",         (1, 0), (-1, -1), "CENTER"),
        ("FONTSIZE",      (0, 1), (-1, -1), 8),
        ("PADDING",       (0, 0), (-1, -1), 5),
        ("LINEBELOW",     (0, 0), (-1, -1), 0.3, GREY_MID),
        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [CREAM, LIGHT_TAN]),
        # NailSim Pro column highlight
        ("BACKGROUND",    (1, 0), (1, -1), TERRA),
        ("TEXTCOLOR",     (1, 0), (1, -1), WHITE),
        ("FONTNAME",      (1, 1), (1, -1), "Helvetica-Bold"),
    ]
    tbl.setStyle(TableStyle(style_cmds))
    story.append(tbl)

    story.append(Spacer(1, 5*mm))

    story.append(Paragraph("Barrières à l'entrée", s["h3"]))
    barriers = [
        "Expertise double (IA + métier nail art) difficile à trouver en une seule équipe",
        "L'intégration MediaPipe + Flux Fill est technique et requiert un tuning spécifique",
        "La base de styles (18+ et croissante) constitue un actif différenciant",
        "Le réseau de salons partenaires crée un effet de plateforme",
        "La marque NailSim Pro peut être déposée comme marque commerciale",
        "Premier arrivé = référence du marché = effet de réseau et de recommandation",
    ]
    for b in barriers:
        story.append(Paragraph(
            f'<font color="#C27B4A">◆</font>  {b}', s["body_bullet"]
        ))

    story.append(PageBreak())
    return story


# ─── Section 11 — Prochaines étapes ───────────────────────────────────────────
def build_next_steps(s):
    story = []
    story.append(Spacer(1, 8*mm))
    story.append(SectionHeader("11 — PROCHAINES ÉTAPES",
                               "Le plan d'action pour lancer NailSim Pro sur le marché"))
    story.append(Spacer(1, 5*mm))

    story.append(Paragraph(
        "L'application est déjà live et opérationnelle. "
        "Le passage au SaaS commercial peut se faire <b>en 3 à 4 mois</b> "
        "avec les ressources adéquates. Voici les actions prioritaires :", s["body"]
    ))
    story.append(Spacer(1, 4*mm))

    actions = [
        ("IMMÉDIAT (maintenant)", [
            ("Valider le concept", "Tester NailSim Pro avec 5 autres salons pilotes gratuitement."),
            ("Recueillir les retours", "Questionnaire qualitiatif : parcours, styles manquants, friction."),
            ("Identifier les champions", "Trouver 2-3 salons très motivés pour devenir prescripteurs."),
        ]),
        ("MOIS 1-2 (développement SaaS)", [
            ("Infrastructure multi-tenant", "Mise en place de Supabase, système de comptes salons, sous-domaines."),
            ("Plan Starter live", "Déploiement du plan 29€/mois avec QR code, stats basiques, paiement Stripe."),
            ("Onboarding automatisé", "Email de bienvenue, guide d'installation QR code, tutoriel vidéo."),
        ]),
        ("MOIS 3-4 (commercialisation)", [
            ("Plan Pro live", "Bibliothèque styles custom, capture leads, intégration RDV."),
            ("Stratégie acquisition", "Instagram Ads ciblés prothésistes, partenariats écoles nail art."),
            ("Affiliation", "Programme ambassadeur : 20% de commission pour chaque salon recommandé."),
        ]),
        ("MOIS 5-6 (scale)", [
            ("Analyse des données", "Identifier les styles les plus simulés → guider les salons."),
            ("Relations presse beauté", "Communiqué dans Beauté Sélection, Les Pros de la Beauté."),
            ("Levée de fonds optionnelle", "Deck investisseurs si l'objectif 100 salons est atteint."),
        ]),
    ]

    for phase_title, items in actions:
        ph_row = [[Paragraph(f'<font color="white"><b>{phase_title}</b></font>', s["body"])]]
        ph_tbl = Table(ph_row, colWidths=[CONTENT_W])
        ph_tbl.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), TERRA),
            ("PADDING",    (0, 0), (-1, -1), 7),
        ]))
        story.append(ph_tbl)

        for action, desc in items:
            row = [[
                Paragraph('<font color="#C27B4A"><b>→</b></font>', s["body"]),
                Paragraph(f'<b>{action}</b> — <font size="9">{desc}</font>', s["body"]),
            ]]
            tbl = Table(row, colWidths=[8*mm, CONTENT_W - 8*mm])
            tbl.setStyle(TableStyle([
                ("VALIGN",    (0, 0), (-1, -1), "TOP"),
                ("PADDING",   (0, 0), (-1, -1), 6),
                ("LINEBELOW", (0, 0), (-1, -1), 0.3, LIGHT_TAN),
                ("BACKGROUND",(0, 0), (-1, -1), GREY_LIGHT),
            ]))
            story.append(tbl)
        story.append(Spacer(1, 3*mm))

    story.append(Spacer(1, 4*mm))
    story.append(DividerLine(color=TERRA, thickness=1.5))
    story.append(Spacer(1, 4*mm))

    # CTA
    cta_data = [[
        Paragraph(
            '<b><font color="#FAF5F0" size="13">NailSim Pro est prêt.</font></b><br/>'
            '<font color="#D4A96A" size="10">La prochaine étape, c\'est vous.</font>',
            ParagraphStyle("CTA", parent=s["body"], alignment=TA_CENTER, leading=18)
        )
    ]]
    cta_tbl = Table(cta_data, colWidths=[CONTENT_W])
    cta_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), DARK_BROWN),
        ("PADDING",    (0, 0), (-1, -1), 18),
        ("ALIGN",      (0, 0), (-1, -1), "CENTER"),
        ("ROUNDEDCORNERS", [6]),
    ]))
    story.append(cta_tbl)

    story.append(Spacer(1, 5*mm))
    story.append(Paragraph(
        "Pour toute question ou pour planifier une démonstration :", s["body"]
    ))
    contact_data = [
        ["Application live :", "narjisse.vercel.app"],
        ["Contact :", "Institut Naïram Narjisse — Tresses (33 km de Bordeaux)"],
        ["Document :", "Confidentiel — Mars 2026"],
    ]
    for label, val in contact_data:
        story.append(Paragraph(
            f'<font color="#C27B4A"><b>{label}</b></font>  {val}',
            s["body"]
        ))

    return story


# ─── Main builder ───────────────────────────────────────────────────────────────
def build_pdf():
    output_path = "/home/user/Narjisse/NailSim-Pro-Dossier.pdf"

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=MARGIN_L,
        rightMargin=MARGIN_R,
        topMargin=MARGIN_T + 10*mm,   # extra space for header
        bottomMargin=MARGIN_B + 8*mm,  # extra space for footer
        title="NailSim Pro — Dossier de Présentation",
        author="Institut Naïram Narjisse",
        subject="SaaS Simulateur IA pour Prothésistes Ongulaires",
        creator="NailSim Pro Generator",
    )

    s = make_styles()

    story = []
    story += build_cover(s)
    story += build_toc(s)
    story += build_executive_summary(s)
    story += build_problem(s)
    story += build_solution(s)
    story += build_features(s)
    story += build_user_journey(s)
    story += build_roadmap(s)
    story += build_architecture(s)
    story += build_pricing(s)
    story += build_market(s)
    story += build_competitive(s)
    story += build_next_steps(s)

    doc.build(story, canvasmaker=HeaderFooterCanvas)
    print(f"PDF generated: {output_path}")
    return output_path


if __name__ == "__main__":
    build_pdf()
