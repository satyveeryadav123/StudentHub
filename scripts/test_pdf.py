import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

pdfmetrics.registerFont(TTFont("InkFree", "C:/Windows/Fonts/Inkfree.ttf"))
pdfmetrics.registerFont(TTFont("SegoePrint-Bold", "C:/Windows/Fonts/segoeprb.ttf"))

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("InkFree", 9)
        self.setFillColor(colors.HexColor("#475569"))
        page_str = f"Page {self._pageNumber} of {page_count}"
        width, height = A4
        self.drawRightString(width - 40, 24, page_str)
        self.drawString(64, 24, "AKTU B.Tech Sem-1 • Personal Student Lecture Notes")
        self.restoreState()

def draw_background(canvas_obj, doc):
    canvas_obj.saveState()
    width, height = A4
    
    # 1. Warm cream paper background
    canvas_obj.setFillColor(colors.HexColor("#FAF8F3"))
    canvas_obj.rect(0, 0, width, height, fill=True, stroke=False)
    
    # 2. Horizontal notebook lines
    canvas_obj.setStrokeColor(colors.HexColor("#E2E8F0"))
    canvas_obj.setLineWidth(0.6)
    y = 50
    while y < height - 50:
        canvas_obj.line(0, y, width, y)
        y += 20

    # 3. Red left margin line
    canvas_obj.setStrokeColor(colors.HexColor("#F87171"))
    canvas_obj.setLineWidth(1.2)
    canvas_obj.line(54, 0, 54, height)

    # 4. Header rule & running title
    canvas_obj.setStrokeColor(colors.HexColor("#CBD5E1"))
    canvas_obj.setLineWidth(1.0)
    canvas_obj.line(0, height - 42, width, height - 42)
    
    canvas_obj.setFont("SegoePrint-Bold", 9)
    canvas_obj.setFillColor(colors.HexColor("#334155"))
    canvas_obj.drawString(64, height - 34, "BAS102: Engineering Chemistry — Revision Notes")
    
    canvas_obj.restoreState()

doc = SimpleDocTemplate("test_output.pdf", pagesize=A4, leftMargin=64, rightMargin=40, topMargin=54, bottomMargin=50)
styles = getSampleStyleSheet()

h1_style = ParagraphStyle(
    'H1',
    parent=styles['Normal'],
    fontName='SegoePrint-Bold',
    fontSize=14,
    leading=18,
    textColor=colors.HexColor("#1D4ED8"),
    spaceAfter=10
)

body_style = ParagraphStyle(
    'Body',
    parent=styles['Normal'],
    fontName='InkFree',
    fontSize=11,
    leading=18,
    textColor=colors.HexColor("#1E293B"),
    spaceAfter=8
)

story = [
    Paragraph("UNIT 1: Atomic & Molecular Structure", h1_style),
    Paragraph("This is actual handwritten body text written onto the notebook page!", body_style),
    Paragraph("Molecular Orbital Theory (MOT) explains how atomic orbitals combine linearly (LCAO) to form bonding and antibonding molecular orbitals.", body_style)
]

doc.build(story, onFirstPage=draw_background, onLaterPages=draw_background, canvasmaker=NumberedCanvas)
print("Test PDF built successfully.")
