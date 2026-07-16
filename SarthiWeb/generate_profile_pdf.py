import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        # Suppress headers/footers on the first page if it is a cover page
        if self._pageNumber == 1:
            # Draw Cover Page border accents
            self.setStrokeColor(colors.HexColor("#9C7C38"))
            self.setLineWidth(4)
            self.line(40, 40, 40, 750)
            self.line(40, 40, 570, 40)
            self.setStrokeColor(colors.HexColor("#0A2540"))
            self.setLineWidth(1)
            self.line(46, 46, 46, 744)
            self.line(46, 46, 564, 46)
            return

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#0A2540"))
        # Header
        self.drawString(54, 750, "SARTHI EXIM INDIA")
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#94A3B8"))
        self.drawRightString(558, 750, "Company Profile & Export Directory")
        
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 742, 558, 742)

        # Footer
        self.line(54, 50, 558, 50)
        self.drawString(54, 38, "Address: Mira Road East, Maharashtra, India | Email: sales@sarthigroups.com")
        self.drawRightString(558, 38, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def generate_pdf():
    pdf_path = "frontend/public/company-profile.pdf"
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(pdf_path), exist_ok=True)

    # Letter size: 612 x 792 pt
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=72,
        bottomMargin=72
    )

    styles = getSampleStyleSheet()

    # Brand Colors
    c_navy = colors.HexColor("#0A2540")
    c_gold = colors.HexColor("#9C7C38")
    c_text = colors.HexColor("#334155")
    c_light = colors.HexColor("#F8FAFC")

    # Typography / Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=c_navy,
        spaceAfter=4,
        spaceBefore=140
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=c_gold,
        spaceAfter=150
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=c_navy,
        spaceBefore=18,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=c_navy,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=15,
        textColor=c_text,
        spaceAfter=10
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=body_style,
        leftIndent=15,
        bulletIndent=5,
        spaceAfter=6
    )

    meta_label = ParagraphStyle(
        'MetaL',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        textColor=c_navy
    )

    meta_val = ParagraphStyle(
        'MetaV',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=c_text
    )

    story = []

    # --- COVER PAGE ---
    story.append(Spacer(1, 40))
    # Elegant Decorative Accent
    story.append(Paragraph("<font color='#9C7C38' size='36'>■</font>", body_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph("SARTHI EXIM INDIA", title_style))
    story.append(Paragraph("EXPORTING EXCELLENCE • BUILDING TRUST", subtitle_style))
    
    # Metadata Box at the bottom of cover
    meta_data = [
        [Paragraph("Document Name:", meta_label), Paragraph("Official Company Profile & Export Catalog", meta_val)],
        [Paragraph("Registration:", meta_label), Paragraph("Spices Board RCMC, IEC Registered Merchant Exporter", meta_val)],
        [Paragraph("Established:", meta_label), Paragraph("Mira Road, Maharashtra, India", meta_val)],
        [Paragraph("Contact Email:", meta_label), Paragraph("sales@sarthigroups.com", meta_val)],
        [Paragraph("Contact Phone:", meta_label), Paragraph("+91 97694 96113", meta_val)],
        [Paragraph("Website:", meta_label), Paragraph("www.sarthieximindia.com", meta_val)]
    ]
    t_meta = Table(meta_data, colWidths=[130, 320])
    t_meta.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
    ]))
    story.append(t_meta)
    story.append(PageBreak())

    # --- PAGE 2: ABOUT THE HOUSE ---
    story.append(Paragraph("1. About The House", h1_style))
    story.append(Paragraph(
        "Sarthi Exim India is a premier merchant-exporter working directly with key growers, "
        "cooperatives, and specialized processing units across India. We specialize in sourcing, quality checking, "
        "and exporting premium spices and agricultural commodities to overseas markets including the Gulf region, "
        "Europe, and Southeast Asia.", body_style))
    
    story.append(Paragraph(
        "Our operations are centered around strict quality control and a rigorous, error-free documentation process. "
        "By doing so, we ensure that every container shipped meets the specifications of importing customs houses and clears "
        "without surprise delays.", body_style))

    story.append(Paragraph("Our Core Commitments:", h2_style))
    story.append(Paragraph("• <b>Lab-Tested Lots:</b> Every batch undergoes inspection for moisture, purity, and chemical residues.", bullet_style))
    story.append(Paragraph("• <b>Documentation-First Sourcing:</b> We hold all necessary export licenses including IEC, GST, FSSAI, Spices Board RCMC, and FIEO membership.", bullet_style))
    story.append(Paragraph("• <b>Direct Farmer Linkages:</b> Direct sourcing ensures price competitiveness and crop traceability.", bullet_style))
    story.append(Paragraph("• <b>Bespoke Logistics:</b> Full Container Load (FCL) shipping, customized packaging, and moisture-absorbing liners are standard.", bullet_style))

    story.append(Spacer(1, 15))

    story.append(Paragraph("2. Product Range & Export Specifications", h1_style))
    story.append(Paragraph(
        "We supply six core product lines, processed under hygienic conditions and packed in high-grade bags to retain "
        "aroma, flavor, and freshness over long sea transits.", body_style))

    # Product Table
    prod_header_style = ParagraphStyle('PH', parent=meta_label, textColor=colors.white)
    prod_cell_style = ParagraphStyle('PC', parent=meta_val, fontSize=9, leading=12)
    prod_bold_style = ParagraphStyle('PB', parent=meta_label, fontSize=9, leading=12)
    
    prod_data = [
        [Paragraph("Product", prod_header_style), Paragraph("Grades / Varieties", prod_header_style), Paragraph("Key Export Specifications", prod_header_style)],
        [Paragraph("Red Chilli", prod_bold_style), Paragraph("Sannam S4, Teja S17, Byadgi", prod_cell_style), Paragraph("Stemless or with stem, high color values (ASTA), low moisture (&lt;12%)", prod_cell_style)],
        [Paragraph("Turmeric", prod_bold_style), Paragraph("Nizamabad Finger, Salem Double Polished", prod_cell_style), Paragraph("Curcumin content 3% to 5.5%, clean, well-dried", prod_cell_style)],
        [Paragraph("Black Pepper", prod_bold_style), Paragraph("Malabar Garbled, 500GL - 550GL", prod_cell_style), Paragraph("High piperine content, minimal extraneous matter", prod_cell_style)],
        [Paragraph("Cardamom", prod_bold_style), Paragraph("Green Bold (7mm, 8mm+)", prod_cell_style), Paragraph("Deep green color, fully ripe, high volatile oil content", prod_cell_style)],
        [Paragraph("Garlic", prod_bold_style), Paragraph("Fresh Bulbs, Dehydrated Flakes, Powder", prod_cell_style), Paragraph("Well-cured, no cloves sprouting, uniform grade sizes", prod_cell_style)],
        [Paragraph("Onion", prod_bold_style), Paragraph("Red Nasik Onion, Dehydrated Flakes", prod_cell_style), Paragraph("Sorted by diameter (45mm, 55mm+), firm skin", prod_cell_style)]
    ]
    t_prod = Table(prod_data, colWidths=[90, 160, 254])
    t_prod.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_light])
    ]))
    story.append(t_prod)
    
    story.append(PageBreak())

    # --- PAGE 3: EXPORT PROCESS & REGISTERED COMPLIANCE ---
    story.append(Paragraph("3. Our Export Process", h1_style))
    story.append(Paragraph(
        "Every shipping manifest moves through our four-stage fulfillment pipeline to guarantee consistency "
        "and custom compliance.", body_style))

    proc_data = [
        [Paragraph("<b>Stage 1: RFQ & Specification Alignment</b>", meta_label)],
        [Paragraph("We outline specifications, pricing (FOB/CIF), packaging weight, and delivery timeline. Samples are supplied on request.", body_style)],
        [Paragraph("<b>Stage 2: Sourcing & Quality Testing</b>", meta_label)],
        [Paragraph("Spices are sourced direct from origin, cleaned, graded, and checked in accredited laboratories for pesticide residues, moisture, and essential oils.", body_style)],
        [Paragraph("<b>Stage 3: Packing & Labelling</b>", meta_label)],
        [Paragraph("Packed in heavy-duty PP bags, jute bags, or custom boxes with moisture-absorbing barriers and clear batch coding.", body_style)],
        [Paragraph("<b>Stage 4: Custom Clearance & Loading</b>", meta_label)],
        [Paragraph("Container stuffing is monitored closely. Phytosanitary certificates, Certificates of Origin, and Bills of Lading are processed rapidly.", body_style)]
    ]
    t_proc = Table(proc_data, colWidths=[504])
    t_proc.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LINEBELOW', (0,0), (-1,0), 0.5, colors.HexColor("#CBD5E1")),
        ('LINEBELOW', (0,2), (-1,2), 0.5, colors.HexColor("#CBD5E1")),
        ('LINEBELOW', (0,4), (-1,4), 0.5, colors.HexColor("#CBD5E1")),
        ('LINEBELOW', (0,6), (-1,6), 0.5, colors.HexColor("#CBD5E1")),
    ]))
    story.append(t_proc)
    
    story.append(Spacer(1, 15))

    story.append(Paragraph("4. Statutory Certifications & Registration", h1_style))
    story.append(Paragraph(
        "Sarthi Exim India operates in full compliance with the statutory laws of the Government of India "
        "and is fully authorized to engage in international trade of agricultural goods:", body_style))

    story.append(Paragraph("• <b>Directorate General of Foreign Trade (DGFT):</b> Holder of valid Import Export Code (IEC).", bullet_style))
    story.append(Paragraph("• <b>Spices Board of India:</b> Registered Exporter of Spices with active RCMC.", bullet_style))
    story.append(Paragraph("• <b>FSSAI:</b> Food Safety and Standards Authority of India licensed exporter.", bullet_style))
    story.append(Paragraph("• <b>FIEO:</b> Registered with the Federation of Indian Export Organisations.", bullet_style))

    story.append(Spacer(1, 20))
    
    # Sign-off box
    sign_data = [
        [Paragraph("<b>Prepared by:</b> Sarthi Exim India Documentation Division", meta_val),
         Paragraph("<b>Date of Issue:</b> July 2026", meta_val)],
        [Paragraph("<b>Verification status:</b> Verified Exporter (IEC / Spices Board)", meta_val),
         Paragraph("<b>Contact:</b> sales@sarthigroups.com", meta_val)]
    ]
    t_sign = Table(sign_data, colWidths=[250, 254])
    t_sign.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (-1,-1), c_light),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(t_sign)

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF successfully generated.")

if __name__ == "__main__":
    generate_pdf()
