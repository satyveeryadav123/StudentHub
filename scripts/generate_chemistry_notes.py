import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register Fonts
FONT_REGULAR = "InkFree"
FONT_HEADER = "SegoePrint-Bold"

try:
    pdfmetrics.registerFont(TTFont("InkFree", "C:/Windows/Fonts/Inkfree.ttf"))
    pdfmetrics.registerFont(TTFont("SegoePrint-Bold", "C:/Windows/Fonts/segoeprb.ttf"))
except Exception as e:
    print(f"Font loading fallback: {e}")
    FONT_REGULAR = "Helvetica"
    FONT_HEADER = "Helvetica-Bold"

class NumberedCanvas(canvas.Canvas):
    """Two-pass canvas for total page count in footer."""
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
            self.draw_footer(num_pages)
            super().showPage()
        super().save()

    def draw_footer(self, total_pages):
        self.saveState()
        width, height = A4
        self.setFont(FONT_REGULAR, 9)
        self.setFillColor(colors.HexColor("#475569"))
        page_str = f"Page {self._pageNumber} of {total_pages}"
        self.drawRightString(width - 40, 24, page_str)
        self.drawString(64, 24, "AKTU B.Tech Sem-1 • Personal Student Revision Notes")
        self.restoreState()

def draw_notebook_background(canvas_obj, doc):
    """Draw warm cream notebook paper with horizontal ruling lines and left red margin FIRST."""
    canvas_obj.saveState()
    width, height = A4
    
    # 1. Warm cream paper fill
    canvas_obj.setFillColor(colors.HexColor("#FAF8F3"))
    canvas_obj.rect(0, 0, width, height, fill=True, stroke=False)
    
    # 2. Horizontal notebook ruling lines
    canvas_obj.setStrokeColor(colors.HexColor("#E2E8F0"))
    canvas_obj.setLineWidth(0.6)
    y = 50
    while y < height - 50:
        canvas_obj.line(0, y, width, y)
        y += 20

    # 3. Red vertical margin line
    canvas_obj.setStrokeColor(colors.HexColor("#F87171"))
    canvas_obj.setLineWidth(1.2)
    canvas_obj.line(54, 0, 54, height)

    # 4. Header line & title
    canvas_obj.setStrokeColor(colors.HexColor("#CBD5E1"))
    canvas_obj.setLineWidth(1.0)
    canvas_obj.line(0, height - 42, width, height - 42)
    
    canvas_obj.setFont(FONT_HEADER, 9)
    canvas_obj.setFillColor(colors.HexColor("#334155"))
    canvas_obj.drawString(64, height - 34, "BAS102: Engineering Chemistry — Student Study Notes")
    
    canvas_obj.restoreState()

def create_note_styles():
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'NoteTitle',
        parent=styles['Normal'],
        fontName=FONT_HEADER,
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'NoteH1',
        parent=styles['Normal'],
        fontName=FONT_HEADER,
        fontSize=13,
        leading=17,
        textColor=colors.HexColor("#1D4ED8"), # Blue pen ink
        spaceBefore=12,
        spaceAfter=5,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'NoteH2',
        parent=styles['Normal'],
        fontName=FONT_HEADER,
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#4338CA"), # Indigo pen ink
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'NoteBody',
        parent=styles['Normal'],
        fontName=FONT_REGULAR,
        fontSize=10.5,
        leading=17,
        textColor=colors.HexColor("#1E293B"), # Dark blue ballpoint pen ink
        spaceAfter=7
    )

    bullet_style = ParagraphStyle(
        'NoteBullet',
        parent=styles['Normal'],
        fontName=FONT_REGULAR,
        fontSize=10,
        leading=16,
        textColor=colors.HexColor("#1E293B"),
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'NoteCallout',
        parent=styles['Normal'],
        fontName=FONT_REGULAR,
        fontSize=10,
        leading=15,
        textColor=colors.HexColor("#0F172A"),
        backColor=colors.HexColor("#FEF3C7"), # Soft Yellow Highlighter Box
        borderColor=colors.HexColor("#F59E0B"),
        borderWidth=0.8,
        borderPadding=7,
        spaceBefore=6,
        spaceAfter=8
    )

    return {
        'title': title_style,
        'h1': h1_style,
        'h2': h2_style,
        'body': body_style,
        'bullet': bullet_style,
        'callout': callout_style
    }

def generate_unit_1(output_path, st):
    doc = SimpleDocTemplate(output_path, pagesize=A4, leftMargin=64, rightMargin=40, topMargin=54, bottomMargin=50)
    story = []
    
    story.append(Paragraph("<u>UNIT 1: Atomic & Molecular Structure</u>", st['title']))
    story.append(Spacer(1, 2))
    
    # --- PAGE 1 ---
    story.append(Paragraph("1. Molecular Orbital Theory (MOT)", st['h1']))
    story.append(Paragraph("Think of MOT as a partnership: when two individual atoms come together, their atomic orbitals merge completely to form brand new <b>Molecular Orbitals (MOs)</b> that belong to the entire molecule.", st['body']))
    
    story.append(Paragraph("<b>Core Postulates of LCAO Principle:</b>", st['h2']))
    story.append(Paragraph("• <b>LCAO Principle:</b> Atomic Orbitals combine linearly by addition (&psi;<sub>A</sub> + &psi;<sub>B</sub> &rArr; Constructive interference) or subtraction (&psi;<sub>A</sub> - &psi;<sub>B</sub> &rArr; Destructive interference).", st['bullet']))
    story.append(Paragraph("• <b>Bonding MOs (&sigma;, &pi;):</b> Lower energy, higher stability than isolated atomic orbitals. Electron density accumulates between nuclei.", st['bullet']))
    story.append(Paragraph("• <b>Antibonding MOs (&sigma;*, &pi;*):</b> Higher energy, lower stability. Electron density drops to zero at the nodal plane between nuclei.", st['bullet']))
    story.append(Paragraph("• <b>Bond Order Formula:</b><br/><b>Bond Order = &frac12; (N<sub>b</sub> - N<sub>a</sub>)</b><br/>where N<sub>b</sub> = number of bonding electrons, N<sub>a</sub> = number of antibonding electrons.", st['callout']))
    
    story.append(Paragraph("<b>Homonuclear Diatomic Molecules (N<sub>2</sub> & O<sub>2</sub>):</b>", st['h2']))
    story.append(Paragraph("• <b>Nitrogen (N<sub>2</sub> - 14 e<sup>-</sup>):</b> Electronic Config: &sigma;1s<sup>2</sup> &sigma;*1s<sup>2</sup> &sigma;2s<sup>2</sup> &sigma;*2s<sup>2</sup> (&pi;2p<sub>x</sub><sup>2</sup> = &pi;2p<sub>y</sub><sup>2</sup>) &sigma;2p<sub>z</sub><sup>2</sup>.<br/>N<sub>b</sub> = 10, N<sub>a</sub> = 4 &rArr; Bond Order = &frac12;(10 - 4) = 3 (Triple Bond). All electrons are paired &rArr; <b>Diamagnetic</b>.", st['body']))
    story.append(Paragraph("• <b>Oxygen (O<sub>2</sub> - 16 e<sup>-</sup>):</b> Electronic Config: &sigma;1s<sup>2</sup> &sigma;*1s<sup>2</sup> &sigma;2s<sup>2</sup> &sigma;*2s<sup>2</sup> &sigma;2p<sub>z</sub><sup>2</sup> (&pi;2p<sub>x</sub><sup>2</sup> = &pi;2p<sub>y</sub><sup>2</sup>) (&pi;*2p<sub>x</sub><sup>1</sup> = &pi;*2p<sub>y</sub><sup>1</sup>).<br/>N<sub>b</sub> = 10, N<sub>a</sub> = 6 &rArr; Bond Order = &frac12;(10 - 6) = 2 (Double Bond). Contains 2 unpaired electrons in &pi;* &rArr; <b>Paramagnetic</b>.", st['body']))
    
    story.append(Paragraph("<b>Heteronuclear Diatomics (CO & NO):</b>", st['h2']))
    story.append(Paragraph("• <b>Carbon Monoxide (CO - 14 e<sup>-</sup>):</b> O is more electronegative than C. Bond order = 3, highly stable.", st['body']))
    story.append(Paragraph("• <b>Nitric Oxide (NO - 15 e<sup>-</sup>):</b> Has 1 unpaired electron in &pi;*2p orbital. Bond order = 2.5. Paramagnetic.", st['body']))

    story.append(PageBreak())

    # --- PAGE 2 ---
    story.append(Paragraph("2. Band Theory of Solids", st['h1']))
    story.append(Paragraph("In a solid crystal, billions of atomic orbitals overlap to form continuous energy bands. Valence electrons form the <i>Valence Band (VB)</i> and empty upper states form the <i>Conduction Band (CB)</i>.", st['body']))
    
    story.append(Paragraph("<b>Classification based on Band Gap (E<sub>g</sub>):</b>", st['h2']))
    story.append(Paragraph("1. <b>Conductors (Metals):</b> VB and CB overlap directly (E<sub>g</sub> = 0). Electrons move freely upon applying voltage.", st['bullet']))
    story.append(Paragraph("2. <b>Insulators (Diamond, Wood):</b> Huge forbidden band gap (E<sub>g</sub> > 3 eV). Thermal energy cannot promote electrons to CB.", st['bullet']))
    story.append(Paragraph("3. <b>Semiconductors (Si, Ge):</b> Small energy gap (E<sub>g</sub> &approx; 1 eV). At 0K acts as insulator; at room temp, thermal excitation promotes electrons.", st['bullet']))
    story.append(Paragraph("• <b>Doping:</b> Intrinsic vs Extrinsic. <i>n-type:</i> Doped with Group 15 (P/As) &rArr; excess e<sup>-</sup>. <i>p-type:</i> Doped with Group 13 (B/Ga) &rArr; excess holes.", st['body']))
    
    story.append(Paragraph("<i>Diagram Sketch:</i> [Valence Band] &mdash; (small 1eV gap) &mdash; [Conduction Band] (Semiconductor).", st['callout']))

    story.append(Paragraph("3. Liquid Crystals & Applications", st['h1']))
    story.append(Paragraph("Liquid crystals exist in a state of matter between crystalline solid and isotropic liquid (called <b>Mesophase</b>). They flow like liquid but possess molecular orientational order like a crystal!", st['body']))
    
    story.append(Paragraph("<b>Structural Classification of Liquid Crystals:</b>", st['h2']))
    story.append(Paragraph("• <b>Nematic Phase:</b> Molecules are aligned parallel along a long axis (orientational order) but have no positional layers. Looks thread-like under microscope.", st['bullet']))
    story.append(Paragraph("• <b>Smectic Phase:</b> Molecules have orientational order AND form distinct parallel layers. Feels soap-like.", st['bullet']))
    story.append(Paragraph("• <b>Cholesteric Phase:</b> Layered structure with each layer rotated slightly, forming a helical spiral (optically active, changes color with temperature!).", st['bullet']))
    
    story.append(Paragraph("<b>Engineering Applications:</b>", st['h2']))
    story.append(Paragraph("1. <b>Liquid Crystal Displays (LCDs):</b> Applied electric field reorients nematic molecules in watches and laptops.<br/>2. <b>Thermography:</b> Cholesteric liquid crystals change color with temperature &rArr; skin fever sensors & circuit hotspot detection.", st['body']))

    story.append(Paragraph("4. Quick Exam Revision Summary", st['h1']))
    story.append(Paragraph("• Bond Order = &frac12; (N<sub>b</sub> - N<sub>a</sub>). N<sub>2</sub> (BO=3, Diamagnetic) vs O<sub>2</sub> (BO=2, Paramagnetic).<br/>• Semiconductor Gap E<sub>g</sub> &approx; 1 eV; Metal E<sub>g</sub> = 0.<br/>• Nematic (thread-like) vs Smectic (layered) vs Cholesteric (helical spiral).", st['callout']))

    doc.build(story, onFirstPage=draw_notebook_background, onLaterPages=draw_notebook_background, canvasmaker=NumberedCanvas)
    print("Unit 1 built.")

def generate_unit_2(output_path, st):
    doc = SimpleDocTemplate(output_path, pagesize=A4, leftMargin=64, rightMargin=40, topMargin=54, bottomMargin=50)
    story = []

    story.append(Paragraph("<u>UNIT 2: Spectroscopic Techniques & Applications</u>", st['title']))
    story.append(Spacer(1, 4))

    # --- PAGE 1 ---
    story.append(Paragraph("1. UV-Visible Spectroscopy", st['h1']))
    story.append(Paragraph("UV-Vis spectroscopy deals with the absorption of ultraviolet (200-400 nm) or visible (400-800 nm) radiation, promoting valence electrons from bonding/non-bonding orbitals to antibonding orbitals.", st['body']))

    story.append(Paragraph("<b>Beer-Lambert Law (Core Formula):</b>", st['h2']))
    story.append(Paragraph("When monochromatic light passes through a homogeneous solution, the rate of decrease of intensity with path length is proportional to light intensity and solution concentration.<br/><b>A = log<sub>10</sub>(I<sub>0</sub> / I) = &epsilon; &middot; c &middot; l</b><br/>where A = Absorbance, &epsilon; = Molar absorptivity (L mol<sup>-1</sup> cm<sup>-1</sup>), c = Concentration (mol/L), l = Path length (cm).", st['callout']))

    story.append(Paragraph("<b>Key Terminology & Spectral Shifts:</b>", st['h2']))
    story.append(Paragraph("• <b>Chromophore:</b> An isolated unsaturated functional group responsible for light absorption (e.g., -C=C-, -C=O, -N=N-).", st['bullet']))
    story.append(Paragraph("• <b>Auxochrome:</b> A non-absorbing group with lone pairs that intensifies color when attached to a chromophore (e.g., -OH, -NH<sub>2</sub>, -Cl).", st['bullet']))
    story.append(Paragraph("• <b>Bathochromic Shift (Red Shift):</b> Shift of absorption maximum (&lambda;<sub>max</sub>) to longer wavelength.", st['bullet']))
    story.append(Paragraph("• <b>Hypsochromic Shift (Blue Shift):</b> Shift of &lambda;<sub>max</sub> to shorter wavelength.", st['bullet']))
    story.append(Paragraph("• <b>Hyperchromic Effect:</b> Increase in absorption intensity (&epsilon;<sub>max</sub>).", st['bullet']))
    story.append(Paragraph("• <b>Hypochromic Effect:</b> Decrease in absorption intensity (&epsilon;<sub>max</sub>).", st['bullet']))

    story.append(Paragraph("2. Infrared (IR) Spectroscopy", st['h1']))
    story.append(Paragraph("IR radiation (4000 to 400 cm<sup>-1</sup>) excites <b>molecular vibrations</b> (stretching and bending of chemical bonds). Think of chemical bonds as mechanical springs!", st['body']))

    story.append(Paragraph("<b>Hooke's Law for Vibrational Frequency:</b><br/><b>&nu; = &frac12;&pi;c &radic;(k / &mu;)</b><br/>where k = bond force constant (triple bond > double bond > single bond), &mu; = reduced mass = (m<sub>1</sub>m<sub>2</sub>)/(m<sub>1</sub>+m<sub>2</sub>).", st['callout']))

    story.append(Paragraph("<b>Vibrational Modes & Spectral Regions:</b>", st['h2']))
    story.append(Paragraph("• <b>Stretching Vibrations:</b> Distance between atoms changes along bond axis (Symmetric vs Asymmetric).", st['bullet']))
    story.append(Paragraph("• <b>Bending Vibrations:</b> Bond angle changes (In-plane: Scissoring/Rocking; Out-of-plane: Wagging/Twisting).", st['bullet']))
    story.append(Paragraph("• <b>Functional Group Region (4000 - 1500 cm<sup>-1</sup>):</b> Characteristic peaks for -OH (3200-3600 cm<sup>-1</sup> broad), >C=O (1700 cm<sup>-1</sup> sharp peak).", st['bullet']))
    story.append(Paragraph("• <b>Fingerprint Region (1500 - 400 cm<sup>-1</sup>):</b> Unique absorption pattern for every organic molecule.", st['bullet']))

    story.append(PageBreak())

    # --- PAGE 2 ---
    story.append(Paragraph("3. <sup>1</sup>H-NMR Spectroscopy (Nuclear Magnetic Resonance)", st['h1']))
    story.append(Paragraph("NMR uses radiofrequency radiation in a strong magnetic field (B<sub>0</sub>) to study hydrogen nuclei (protons) in an organic molecule.", st['body']))

    story.append(Paragraph("<b>Chemical Shift (&delta; in ppm):</b><br/>Position of proton absorption relative to reference compound Tetramethylsilane (TMS = 0 ppm).<br/><b>&delta; = [(&nu;<sub>sample</sub> - &nu;<sub>TMS</sub>) / Operating Freq in MHz] &times; 10<sup>6</sup></b>", st['callout']))

    story.append(Paragraph("<b>NMR Interpretation Rules:</b>", st['h2']))
    story.append(Paragraph("1. <b>Number of Signals:</b> Gives the number of non-equivalent sets of protons.", st['bullet']))
    story.append(Paragraph("2. <b>Spin-Spin Splitting (n+1 Rule):</b> A proton signal splits into (n + 1) peaks, where n = number of neighboring protons on adjacent carbons. (e.g., -CH<sub>2</sub>-CH<sub>3</sub> &rArr; CH<sub>3</sub> splits CH<sub>2</sub> into triplet 2+1=3).", st['bullet']))
    story.append(Paragraph("3. <b>Peak Area (Integration):</b> Area under peak is proportional to number of protons in that chemical environment.", st['bullet']))

    story.append(Paragraph("<b>Structural Elucidation Example (Ethanol CH<sub>3</sub>CH<sub>2</sub>OH):</b>", st['h2']))
    story.append(Paragraph("• <b>CH<sub>3</sub> protons (3H):</b> Splits CH<sub>2</sub> signal &rArr; Quartet (1:3:3:1) at &delta; 1.2 ppm.<br/>• <b>CH<sub>2</sub> protons (2H):</b> Split by CH<sub>3</sub> &rArr; Triplet (1:2:1) at &delta; 3.7 ppm.<br/>• <b>-OH proton (1H):</b> Singlet at &delta; 4.8 ppm.", st['body']))

    story.append(Paragraph("4. Quick Exam Revision Summary", st['h1']))
    story.append(Paragraph("• <b>Beer-Lambert:</b> A = &epsilon; c l.<br/>• <b>Chromophore:</b> Light absorbing group (-C=C-) vs <b>Auxochrome:</b> Color enhancing group (-OH).<br/>• <b>IR Region:</b> Functional (4000-1500 cm<sup>-1</sup>) vs Fingerprint (1500-400 cm<sup>-1</sup>).<br/>• <b>NMR Reference:</b> TMS at &delta; = 0 ppm; Peak splitting = (n+1) rule.", st['callout']))

    doc.build(story, onFirstPage=draw_notebook_background, onLaterPages=draw_notebook_background, canvasmaker=NumberedCanvas)
    print("Unit 2 built.")

def generate_unit_3(output_path, st):
    doc = SimpleDocTemplate(output_path, pagesize=A4, leftMargin=64, rightMargin=40, topMargin=54, bottomMargin=50)
    story = []

    story.append(Paragraph("<u>UNIT 3: Water Chemistry & Phase Rule</u>", st['title']))
    story.append(Spacer(1, 4))

    # --- PAGE 1 ---
    story.append(Paragraph("1. Hardness of Water & EDTA Method", st['h1']))
    story.append(Paragraph("Hardness is the property of water that prevents lather formation with soap due to dissolved Ca<sup>2+</sup> and Mg<sup>2+</sup> salts.", st['body']))

    story.append(Paragraph("<b>Types of Hardness:</b>", st['h2']))
    story.append(Paragraph("• <b>Temporary Hardness (Carbonate):</b> Caused by bicarbonates Ca(HCO<sub>3</sub>)<sub>2</sub> & Mg(HCO<sub>3</sub>)<sub>2</sub>. Easily removed by boiling.", st['bullet']))
    story.append(Paragraph("• <b>Permanent Hardness (Non-Carbonate):</b> Caused by chlorides & sulfates CaCl<sub>2</sub>, MgSO<sub>4</sub>. Cannot be removed by boiling.", st['bullet']))
    story.append(Paragraph("• <b>Units Conversion:</b> 1 ppm = 1 mg/L = 0.07 &deg;Cl = 0.1 &deg;Fr.", st['bullet']))

    story.append(Paragraph("<b>EDTA Titration Method:</b>", st['h2']))
    story.append(Paragraph("• Indicator: Eriochrome Black T (EBT) at pH 10 (Ammonia buffer NH<sub>4</sub>OH + NH<sub>4</sub>Cl).<br/>• <b>Color Change:</b> Wine Red (Ca/Mg-EBT complex) &rArr; Steel Blue (Free EBT at endpoint). EDTA forms 1:1 stable complex with Ca<sup>2+</sup>/Mg<sup>2+</sup>.", st['callout']))

    story.append(Paragraph("2. Water Softening Processes", st['h1']))

    story.append(Paragraph("<b>A. Zeolite (Permutit) Process:</b>", st['h2']))
    story.append(Paragraph("Hydrated sodium aluminosilicate Na<sub>2</sub>O&middot;Al<sub>2</sub>O<sub>3</sub>&middot;xSiO<sub>2</sub>&middot;yH<sub>2</sub>O (Na<sub>2</sub>Ze) exchanges Na<sup>+</sup> for Ca<sup>2+</sup>/Mg<sup>2+</sup>.<br/><b>Na<sub>2</sub>Ze + Ca<sup>2+</sup> &rArr; CaZe + 2Na<sup>+</sup></b><br/>Regeneration: Washed with 10% NaCl brine solution: <i>CaZe + 2NaCl &rArr; Na<sub>2</sub>Ze + CaCl<sub>2</sub></i>.", st['body']))

    story.append(Paragraph("<b>B. Ion-Exchange Process (Demineralization):</b>", st['h2']))
    story.append(Paragraph("• Cation Exchanger (RH<sup>+</sup>): Exchanges Ca<sup>2+</sup>, Mg<sup>2+</sup> for H<sup>+</sup>.<br/>• Anion Exchanger (ROH<sup>-</sup>): Exchanges Cl<sup>-</sup>, SO<sub>4</sub><sup>2-</sup> for OH<sup>-</sup>.<br/>• H<sup>+</sup> + OH<sup>-</sup> &rArr; H<sub>2</sub>O. Produces ultra-pure demineralized water for high-pressure boilers!", st['body']))

    story.append(PageBreak())

    # --- PAGE 2 ---
    story.append(Paragraph("3. Boiler Troubles", st['h1']))
    story.append(Paragraph("1. <b>Scale vs Sludge:</b> Sludge is loose, slimy precipitate formed in cooler boiler zones; Scale is hard, adherent coating on hot inner walls causing overheating.", st['bullet']))
    story.append(Paragraph("2. <b>Priming & Foaming:</b> Priming = carryover of water droplets in steam; Foaming = production of persistent bubbles.", st['bullet']))
    story.append(Paragraph("3. <b>Caustic Embrittlement:</b> Cracking of boiler metal due to high NaOH concentration in hairline stress cracks.", st['bullet']))

    story.append(Paragraph("4. Phase Rule & Water System", st['h1']))

    story.append(Paragraph("<b>Gibbs Phase Rule Equation:</b><br/><b>F = C - P + 2</b><br/>where F = Degrees of Freedom, C = Components, P = Phases.", st['callout']))

    story.append(Paragraph("<b>Single Component Water System (C = 1):</b>", st['h2']))
    story.append(Paragraph("• <b>Phases:</b> Ice (solid), Water (liquid), Vapour (gas).<br/>• <b>Curves (OA, OB, OC):</b> 2 phases in equilibrium (P = 2). F = 1 - 2 + 2 = 1 (Univariant).<br/>• <b>Areas between curves:</b> Single phase exists (P = 1). F = 1 - 1 + 2 = 2 (Bivariant).<br/>• <b>Triple Point 'O':</b> All 3 phases co-exist in equilibrium at T = 0.0075&deg;C, P = 4.58 mm Hg. P = 3, F = 1 - 3 + 2 = 0 (Non-variant / Invariant!).", st['body']))

    story.append(Paragraph("5. Quick Exam Revision Summary", st['h1']))
    story.append(Paragraph("• <b>EDTA Endpoint:</b> Wine red &rArr; Steel blue.<br/>• <b>Zeolite Regeneration:</b> 10% NaCl solution.<br/>• <b>Gibbs Phase Rule:</b> F = C - P + 2.<br/>• <b>Triple Point of Water:</b> T = 0.0075&deg;C, P = 4.58 mmHg (F = 0).", st['callout']))

    doc.build(story, onFirstPage=draw_notebook_background, onLaterPages=draw_notebook_background, canvasmaker=NumberedCanvas)
    print("Unit 3 built.")

def generate_unit_4(output_path, st):
    doc = SimpleDocTemplate(output_path, pagesize=A4, leftMargin=64, rightMargin=40, topMargin=54, bottomMargin=50)
    story = []

    story.append(Paragraph("<u>UNIT 4: Polymers, Organometallics & Composites</u>", st['title']))
    story.append(Spacer(1, 4))

    # --- PAGE 1 ---
    story.append(Paragraph("1. Classification of Polymers", st['h1']))
    story.append(Paragraph("Polymers are giant macromolecules constructed by linking small repeating chemical units (monomers).", st['body']))

    story.append(Paragraph("<b>Thermoplastics vs Thermosetting Polymers:</b>", st['h2']))
    story.append(Paragraph("• <b>Thermoplastics:</b> Linear or branched polymers with weak van der Waals forces. Soften on heating, easily reshaped & recycled (e.g., Polyethylene, PVC, Polystyrene).", st['bullet']))
    story.append(Paragraph("• <b>Thermosets:</b> Highly cross-linked 3D networks. Do not soften on heating once molded; decompose under high heat (e.g., Bakelite, Vulcanized rubber, Epoxy resin).", st['bullet']))

    story.append(Paragraph("<b>Conducting Polymers:</b>", st['h2']))
    story.append(Paragraph("Polymers that conduct electricity due to continuous <b>conjugated &pi;-bonds</b> (alternating single and double bonds).<br/>Examples: <b>Polyacetylene</b> (-CH=CH-)<sub>n</sub>, <b>Polyaniline</b>.<br/><i>Doping Concept:</i> Conductivity increases by million times upon oxidation (p-doping with I<sub>2</sub>) or reduction (n-doping with Na). Applications: OLED screens, solar cells, biosensors.", st['callout']))

    story.append(Paragraph("2. Organometallic Compounds", st['h1']))
    story.append(Paragraph("Organometallics contain at least one direct <b>Carbon-Metal (C-M)</b> bond.", st['body']))

    story.append(Paragraph("<b>Grignard Reagents (R-Mg-X):</b>", st['h2']))
    story.append(Paragraph("Prepared by reacting alkyl halide with Mg ribbon in dry ether:<br/><b>R-X + Mg &rArr; R-Mg-X</b><br/><i>Reactivity:</i> C-Mg bond is strongly polar (C<sup>&delta;-</sup> &mdash; Mg<sup>&delta;+</sup>X). Acts as a strong nucleophile.<br/>• Reaction with HCHO &rArr; Primary Alcohol.<br/>• Reaction with R-CHO &rArr; Secondary Alcohol.<br/>• Reaction with Ketones &rArr; Tertiary Alcohol.<br/>• Reaction with CO<sub>2</sub> &rArr; Carboxylic Acid.", st['body']))

    story.append(PageBreak())

    # --- PAGE 2 ---
    story.append(Paragraph("3. Industrial Organometallic Catalysts", st['h1']))
    story.append(Paragraph("<b>Ziegler-Natta Catalyst:</b><br/>Combination of Triethylaluminium and Titanium tetrachloride <b>[Al(C<sub>2</sub>H<sub>5</sub>)<sub>3</sub> + TiCl<sub>4</sub>]</b>. Used in industrial synthesis of linear, high-density polyethylene (HDPE) under low pressure.", st['callout']))

    story.append(Paragraph("4. Composite Materials & FRP", st['h1']))
    story.append(Paragraph("Composites are multiphase materials created by combining two physically distinct materials: <b>Matrix Phase</b> (continuous binder) + <b>Reinforcement Phase</b> (fibers/particles providing high strength).", st['body']))

    story.append(Paragraph("<b>Fiber-Reinforced Plastics (FRP):</b>", st['h2']))
    story.append(Paragraph("• <b>Glass Fiber Reinforced Plastic (GFRP):</b> High tensile strength, lightweight, corrosion resistant. Used in boat hulls, water tanks, automotive body panels.", st['bullet']))
    story.append(Paragraph("• <b>Carbon Fiber Reinforced Plastic (CFRP):</b> Extreme rigidity and ultralight weight. Used in aerospace (aircraft wings), racing cars, sports equipment.", st['bullet']))

    story.append(Paragraph("5. Quick Exam Revision Summary", st['h1']))
    story.append(Paragraph("• <b>Thermoplastics:</b> Soften on heat (PVC) vs <b>Thermosets:</b> Cross-linked, permanent (Bakelite).<br/>• <b>Conducting Polymers:</b> Conjugated &pi;-bonds (Polyaniline).<br/>• <b>Grignard Reagent:</b> R-Mg-X in dry ether.<br/>• <b>Ziegler-Natta Catalyst:</b> Al(C<sub>2</sub>H<sub>5</sub>)<sub>3</sub> + TiCl<sub>4</sub>.", st['callout']))

    doc.build(story, onFirstPage=draw_notebook_background, onLaterPages=draw_notebook_background, canvasmaker=NumberedCanvas)
    print("Unit 4 built.")

def generate_unit_5(output_path, st):
    doc = SimpleDocTemplate(output_path, pagesize=A4, leftMargin=64, rightMargin=40, topMargin=54, bottomMargin=50)
    story = []

    story.append(Paragraph("<u>UNIT 5: Fuels, Combustion & Corrosion</u>", st['title']))
    story.append(Spacer(1, 4))

    # --- PAGE 1 ---
    story.append(Paragraph("1. Fuels & Calorific Value", st['h1']))
    story.append(Paragraph("A fuel is a combustible substance containing Carbon and Hydrogen that releases large amounts of heat energy upon burning in air.", st['body']))

    story.append(Paragraph("<b>Gross (HCV) vs Net (LCV) Calorific Value:</b>", st['h2']))
    story.append(Paragraph("• <b>HCV / Gross CV:</b> Total heat produced when 1 unit fuel is burned completely and products are cooled to 15&deg;C (steam condenses).", st['bullet']))
    story.append(Paragraph("• <b>LCV / Net CV:</b> Heat produced when steam is allowed to escape without condensing.<br/><b>LCV = HCV - (0.09 &times; H &times; 587) cal/g</b> (where H = % Hydrogen in fuel).", st['callout']))

    story.append(Paragraph("<b>Bomb Calorimeter:</b>", st['h2']))
    story.append(Paragraph("Used to measure HCV of solid and liquid fuels.<br/><b>HCV = [(W + w)(t<sub>2</sub> - t<sub>1</sub>) - Corrections] / m</b> cal/g<br/>where W = mass of water, w = water equivalent of calorimeter, m = mass of fuel.", st['body']))

    story.append(Paragraph("<b>Dulong's Theoretical Formula:</b><br/><b>HCV = &frac12;100 [ 8080 C + 34500 (H - O/8) + 2240 S ] kcal/kg</b>", st['callout']))

    story.append(Paragraph("2. Lubricants & Mechanisms", st['h1']))
    story.append(Paragraph("Substances applied between moving metal surfaces to reduce friction, heat, and wear.", st['body']))

    story.append(Paragraph("<b>Lubrication Mechanisms:</b>", st['h2']))
    story.append(Paragraph("1. <b>Hydrodynamic (Fluid-Film):</b> Thick liquid layer (> 1000 &Aring;) completely separates moving parts under low load/high speed.", st['bullet']))
    story.append(Paragraph("2. <b>Boundary Lubrication:</b> Thin monolayer absorbed on surface under high load/low speed when fluid film breaks.", st['bullet']))
    story.append(Paragraph("3. <b>Extreme Pressure (EP):</b> Under extreme load/high temp, EP additives (organic compounds of S, P, Cl) react with metal surface forming high-melting protective metallic films.", st['bullet']))

    story.append(PageBreak())

    # --- PAGE 2 ---
    story.append(Paragraph("3. Key Lubricant Properties", st['h1']))
    story.append(Paragraph("• <b>Viscosity Index (VI):</b> Measure of change of viscosity with temperature. High VI = minimal change (ideal for engines!).<br/>• <b>Flash Point:</b> Minimum temp at which fuel gives off vapor that ignites momentarily with a spark.", st['body']))

    story.append(Paragraph("4. Corrosion & Cathodic Protection", st['h1']))
    story.append(Paragraph("Corrosion is the gradual destruction of metal due to chemical/electrochemical reaction with environment.", st['body']))

    story.append(Paragraph("<b>Types of Electrochemical Corrosion:</b>", st['h2']))
    story.append(Paragraph("• <b>Galvanic Corrosion:</b> When two dissimilar metals are in contact in electrolyte, more active metal acts as Anode and corrodes.", st['bullet']))
    story.append(Paragraph("• <b>Pitting Corrosion:</b> Localized attack forming deep pin-holes due to breakdown of protective oxide surface film.", st['bullet']))

    story.append(Paragraph("<b>Cathodic Protection Methods:</b>", st['h2']))
    story.append(Paragraph("1. <b>Sacrificial Anode Method:</b> Structure to be protected (e.g., steel pipeline) is connected by wire to a more reactive metal anode (Zn, Mg bar). The sacrificial anode corrodes, protecting the steel!", st['callout']))
    story.append(Paragraph("2. <b>Impressed Current Cathodic Protection (ICCP):</b> External DC current is applied in opposite direction to neutralize corrosion current.", st['body']))

    story.append(Paragraph("5. Quick Exam Revision Summary", st['h1']))
    story.append(Paragraph("• <b>LCV:</b> LCV = HCV - 0.09 H &times; 587.<br/>• <b>Dulong Formula:</b> HCV = &frac12;100 [8080C + 34500(H - O/8) + 2240S].<br/>• <b>Viscosity Index:</b> Resistance to viscosity change with temp.<br/>• <b>Sacrificial Anode:</b> Zn/Mg attached to protect iron.", st['callout']))

    doc.build(story, onFirstPage=draw_notebook_background, onLaterPages=draw_notebook_background, canvasmaker=NumberedCanvas)
    print("Unit 5 built.")

def main():
    output_dir = "public/notes/engineering-chemistry"
    os.makedirs(output_dir, exist_ok=True)
    
    st = create_note_styles()
    
    generate_unit_1(os.path.join(output_dir, "unit-1-notes.pdf"), st)
    generate_unit_2(os.path.join(output_dir, "unit-2-notes.pdf"), st)
    generate_unit_3(os.path.join(output_dir, "unit-3-notes.pdf"), st)
    generate_unit_4(os.path.join(output_dir, "unit-4-notes.pdf"), st)
    generate_unit_5(os.path.join(output_dir, "unit-5-notes.pdf"), st)
    
    print("All 5 units generated successfully in public/notes/engineering-chemistry/")

if __name__ == "__main__":
    main()
