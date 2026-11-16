import os
import pptx
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = pptx.Presentation()
    # 16:9 Widescreen standard
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color Palette - Ōura Deep Luxury Obsidian Theme
    C_BG = RGBColor(9, 10, 15)           # #090A0F Velvet Obsidian
    C_CARD = RGBColor(21, 25, 36)        # #151924 Elevated Obsidian Card
    C_CARD_BORDER = RGBColor(45, 52, 70) # #2D3446 Subtle Card Outline
    C_CYAN = RGBColor(56, 189, 248)      # #38BDF8 Radiant Nordic Cyan
    C_EMERALD = RGBColor(52, 211, 153)   # #34D399 Mint / Clinical Sage
    C_AMBER = RGBColor(251, 191, 36)     # #FBBF24 Performance Gold
    C_CORAL = RGBColor(224, 122, 95)     # #E07A5F Terracotta / Warning
    C_VIOLET = RGBColor(167, 139, 250)   # #A78BFA AI / Tensor Purple
    C_WHITE = RGBColor(255, 255, 255)    # Pure White
    C_MUTED = RGBColor(156, 163, 175)    # #9CA3AF Muted Slate
    C_DARK_TEXT = RGBColor(9, 10, 15)

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG
        bg.line.fill.background()
        return bg

    def add_header(slide, tag_text, title_text, subtitle_text=""):
        # Category Tag Pill
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(10), Inches(0.4))
        tf = tag_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p_tag = tf.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.size = Pt(10)
        p_tag.font.bold = True
        p_tag.font.color.rgb = C_CYAN
        p_tag.font.name = "Arial"

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.7), Inches(0.7))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        tf_title.margin_left = tf_title.margin_top = tf_title.margin_right = tf_title.margin_bottom = 0
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = C_WHITE
        p_title.font.name = "Georgia"

        # Optional Subtitle
        if subtitle_text:
            sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.45), Inches(11.7), Inches(0.4))
            tf_sub = sub_box.text_frame
            tf_sub.word_wrap = True
            tf_sub.margin_left = tf_sub.margin_top = tf_sub.margin_right = tf_sub.margin_bottom = 0
            p_sub = tf_sub.paragraphs[0]
            p_sub.text = subtitle_text
            p_sub.font.size = Pt(12)
            p_sub.font.color.rgb = C_MUTED
            p_sub.font.name = "Arial"

    def create_card(slide, left, top, width, height, title="", title_color=C_CYAN, fill_color=C_CARD, border_color=C_CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = fill_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1)

        if title:
            tb = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.2), width - Inches(0.5), Inches(0.4))
            tf = tb.text_frame
            tf.word_wrap = True
            tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
            p = tf.paragraphs[0]
            p.text = title
            p.font.size = Pt(13)
            p.font.bold = True
            p.font.color.rgb = title_color
            p.font.name = "Arial"
        return card

    # =========================================================================
    # SLIDE 1: TITLE SLIDE
    # =========================================================================
    slide1 = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide1)

    # Accent decorative top bar
    bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.8), Inches(1.8), Inches(0.06))
    bar.fill.solid()
    bar.fill.fore_color.rgb = C_CYAN
    bar.line.fill.background()

    # Brand Title
    tb = slide1.shapes.add_textbox(Inches(0.8), Inches(1.1), Inches(11.7), Inches(1.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p0 = tf.paragraphs[0]
    p0.text = "DR • GLANCE"
    p0.font.size = Pt(46)
    p0.font.bold = True
    p0.font.color.rgb = C_WHITE
    p0.font.name = "Georgia"

    p1 = tf.add_paragraph()
    p1.text = "Clinical AI Biometrics for Ocular & Oral Pathology"
    p1.font.size = Pt(22)
    p1.font.color.rgb = C_CYAN
    p1.font.name = "Arial"
    p1.space_before = Pt(8)

    # Subtitle Paragraph
    tb_sub = slide1.shapes.add_textbox(Inches(0.8), Inches(3.1), Inches(10.5), Inches(1.0))
    tf_sub = tb_sub.text_frame
    tf_sub.word_wrap = True
    p_sub = tf_sub.paragraphs[0]
    p_sub.text = (
        "An end-to-end, sub-170ms clinical screening system featuring layer-wise Grad-CAM backpropagation, "
        "interactive confusion matrix validation (N=5,736), and quiet-luxury bio-wellness design."
    )
    p_sub.font.size = Pt(14)
    p_sub.font.color.rgb = C_MUTED
    p_sub.font.name = "Arial"

    # 4 Key Telemetry Metric Pills
    metrics = [
        ("SUB-170ms", "P95 Edge Latency", C_CYAN),
        ("0.962", "Macro ROC-AUC", C_EMERALD),
        ("95.4%", "Clinical Sensitivity", C_AMBER),
        ("Grad-CAM", "Explainable Saliency", C_VIOLET)
    ]
    card_w = Inches(2.7)
    gap = Inches(0.3)
    start_x = Inches(0.8)
    for i, (val, label, col) in enumerate(metrics):
        cx = start_x + i * (card_w + gap)
        create_card(slide1, cx, Inches(4.3), card_w, Inches(1.5), fill_color=C_CARD, border_color=C_CARD_BORDER)
        mtb = slide1.shapes.add_textbox(cx + Inches(0.25), Inches(4.5), card_w - Inches(0.5), Inches(1.1))
        mtf = mtb.text_frame
        mtf.margin_left = mtf.margin_top = mtf.margin_right = mtf.margin_bottom = 0
        mp1 = mtf.paragraphs[0]
        mp1.text = val
        mp1.font.size = Pt(26)
        mp1.font.bold = True
        mp1.font.color.rgb = col
        mp1.font.name = "Georgia"
        mp2 = mtf.add_paragraph()
        mp2.text = label
        mp2.font.size = Pt(11)
        mp2.font.color.rgb = C_MUTED
        mp2.font.name = "Arial"
        mp2.space_before = Pt(4)

    # Author & Repo Footer
    ftb = slide1.shapes.add_textbox(Inches(0.8), Inches(6.3), Inches(11.7), Inches(0.5))
    ftf = ftb.text_frame
    fp = ftf.paragraphs[0]
    fp.text = "Author: Tisa Bhattacharya  |  GitHub: github.com/tisa1101/Dr_Glance  |  Stack: React 18, FastAPI, TF 2.15, SQLite WAL"
    fp.font.size = Pt(11)
    fp.font.color.rgb = C_MUTED
    fp.font.name = "Arial"

    slide1.notes_slide.notes_text_frame.text = (
        "OPENING HOOK (30s):\n"
        "'Good morning. Today I am excited to present DRGLANCE, an end-to-end clinical AI screening engine for both ocular "
        "and oral pathologies. Most AI projects in healthcare stop at a Jupyter notebook. DRGLANCE was built from the ground up "
        "as a production-grade system solving two critical bottlenecks: sub-170ms edge latency and clinical explainability through "
        "Grad-CAM visual backpropagation. Let me walk you through the clinical problem, our systems architecture, and our empirical results.'"
    )

    # =========================================================================
    # SLIDE 2: THE PROBLEM & CLINICAL IMPERATIVE
    # =========================================================================
    slide2 = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide2)
    add_header(slide2, "Clinical Bottleneck & Systems Dilemma", "The Asymptomatic Screening Gap & Edge Bottlenecks",
               "Why traditional diagnostic workflows and typical web ML architectures fail in real-world triage.")

    # 3 Problem Cards
    col_w = Inches(3.7)
    c_gap = Inches(0.3)
    p_x = Inches(0.8)

    # Card 1: Medical Gap
    create_card(slide2, p_x, Inches(2.1), col_w, Inches(4.7), "1. The Clinical Dilemma", C_CORAL)
    tb = slide2.shapes.add_textbox(p_x + Inches(0.25), Inches(2.7), col_w - Inches(0.5), Inches(3.8))
    tf = tb.text_frame
    tf.word_wrap = True
    for text in [
        "• Asymptomatic Progression: Cataract, glaucoma, caries, and gingivitis progress silently without early pain.",
        "• High Specialist Barrier: 73% of rural and semi-urban populations lack access to certified ophthalmologists & dentists.",
        "• Irreversible Damage: By the time patient notices symptoms (vision drop, acute toothache), structural tissue damage is permanent.",
        "• Routine Screening Deficit: Annual clinical exams are skipped due to friction, cost, and scheduling delays."
    ]:
        p = tf.add_paragraph() if tf.paragraphs[0].text else tf.paragraphs[0]
        p.text = text
        p.font.size = Pt(11)
        p.font.color.rgb = C_MUTED
        p.space_after = Pt(8)

    # Card 2: Systems Latency Gap
    p_x2 = p_x + col_w + c_gap
    create_card(slide2, p_x2, Inches(2.1), col_w, Inches(4.7), "2. The Bandwidth Bottleneck", C_AMBER)
    tb2 = slide2.shapes.add_textbox(p_x2 + Inches(0.25), Inches(2.7), col_w - Inches(0.5), Inches(3.8))
    tf2 = tb2.text_frame
    tf2.word_wrap = True
    for text in [
        "• Heavy Raw Payloads: Mobile cameras capture 4K/1080p images (3MB–8MB). Uploading raw frames over mobile networks takes 2.5s+.",
        "• Network Serialization: High round-trip time (RTT) creates unbearable UX latency, breaking live interactive reticle scanning.",
        "• Cloud Serverless Spikes: Multipart payload parsing on cloud containers triggers memory allocation thrashing.",
        "• Container Spin-Down: Inactive cloud workers introduce 50s+ cold starts when patients attempt urgent triage."
    ]:
        p = tf2.add_paragraph() if tf2.paragraphs[0].text else tf2.paragraphs[0]
        p.text = text
        p.font.size = Pt(11)
        p.font.color.rgb = C_MUTED
        p.space_after = Pt(8)

    # Card 3: Trust & Explainability Gap
    p_x3 = p_x2 + col_w + c_gap
    create_card(slide2, p_x3, Inches(2.1), col_w, Inches(4.7), "3. The Black-Box Trap", C_VIOLET)
    tb3 = slide2.shapes.add_textbox(p_x3 + Inches(0.25), Inches(2.7), col_w - Inches(0.5), Inches(3.8))
    tf3 = tb3.text_frame
    tf3.word_wrap = True
    for text in [
        "• Opaque Probabilities: Standard classifiers output 'Glaucoma: 88%' without explaining where or why.",
        "• Regulatory Rejection: FDA & CE medical AI guidelines mandate algorithmic transparency and feature attribution.",
        "• Spurious Correlations: Models often latch onto image artifacts (lighting glare, skin tone, background shadows) rather than pathology.",
        "• False Negative Catastrophe: Standard 0.50 cutoff fails heavily imbalanced medical datasets, missing early micro-lesions."
    ]:
        p = tf3.add_paragraph() if tf3.paragraphs[0].text else tf3.paragraphs[0]
        p.text = text
        p.font.size = Pt(11)
        p.font.color.rgb = C_MUTED
        p.space_after = Pt(8)

    slide2.notes_slide.notes_text_frame.text = (
        "PROBLEM SLIDE NOTES (60s):\n"
        "'When designing DRGLANCE, we identified three fundamental failures in existing health AI prototypes.\n"
        "First, clinical reality: early cataract and periodontal biofilm develop without pain. By the time a patient books a specialist, "
        "vision loss or enamel cavitation is irreversible.\n"
        "Second, engineering reality: streaming 5-megabyte raw photos from a phone camera to a cloud container spikes latency beyond 2.5 seconds, "
        "killing real-time responsiveness.\n"
        "Third, compliance reality: doctors cannot trust an AI that outputs an opaque probability score without pointing to the anatomical lesion. "
        "DRGLANCE was engineered specifically to solve all three bottlenecks.'"
    )

    # =========================================================================
    # SLIDE 3: THE DRGLANCE SOLUTION
    # =========================================================================
    slide3 = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide3)
    add_header(slide3, "Core Innovation", "The DRGLANCE Unified Biometric Architecture",
               "Dual-tissue screening, explainable heatmaps, sub-170ms latency, and cryptographic clinical certificates.")

    col2_w = Inches(5.7)
    gap2 = Inches(0.3)

    # Left: What it does
    create_card(slide3, Inches(0.8), Inches(2.1), col2_w, Inches(4.7), "Dual-Modality Clinical Screening", C_CYAN)
    ltb = slide3.shapes.add_textbox(Inches(1.05), Inches(2.7), col2_w - Inches(0.5), Inches(3.8))
    ltf = ltb.text_frame
    ltf.word_wrap = True
    for text in [
        "• Ocular & Retinal Biomarkers: Real-time screening for Cataract, Glaucoma, Diabetic Retinopathy, and Ocular Fatigue.",
        "• Oral & Mucosal Inspection: Automated detection of Dental Caries, Subgingival Biofilm, Gingivitis, and Mucosal Ulcerations.",
        "• Real-Time HUD Reticle: Live webcam viewfinder with continuous luminance checking (>85% optimal) and sharpness lock.",
        "• 3D Tomography Video Interface: Instant 1-click clinical reviewer portal featuring volumetric dental arch CT animation."
    ]:
        p = ltf.add_paragraph() if ltf.paragraphs[0].text else ltf.paragraphs[0]
        p.text = text
        p.font.size = Pt(11.5)
        p.font.color.rgb = C_MUTED
        p.space_after = Pt(12)

    # Right: How it solves the engineering challenges
    create_card(slide3, Inches(0.8) + col2_w + gap2, Inches(2.1), col2_w, Inches(4.7), "Engineered for Clinical Trust", C_EMERALD)
    rtb = slide3.shapes.add_textbox(Inches(0.8) + col2_w + gap2 + Inches(0.25), Inches(2.7), col2_w - Inches(0.5), Inches(3.8))
    rtf = rtb.text_frame
    rtf.word_wrap = True
    for text in [
        "• Layer-Wise Grad-CAM Saliency: Mathematical backpropagation maps isolating convolutional feature attribution for clinicians.",
        "• Client-Side Tensor Prep: Bilinear FP32 downsampling in browser canvas reduces payload size by >92% (from 4MB to ~45KB).",
        "• Calibrated Triage Threshold: Operating point calibrated to 0.35 to maximize Sensitivity (95.4%) and eliminate fatal false negatives.",
        "• SHA-256 Audit Seal: Generates cryptographic tamper-proof clinical certificates with verification QR codes."
    ]:
        p = rtf.add_paragraph() if rtf.paragraphs[0].text else rtf.paragraphs[0]
        p.text = text
        p.font.size = Pt(11.5)
        p.font.color.rgb = C_MUTED
        p.space_after = Pt(12)

    slide3.notes_slide.notes_text_frame.text = (
        "SOLUTION SLIDE NOTES (45s):\n"
        "'DRGLANCE unifies ocular and oral health into one seamless, non-invasive edge workflow. "
        "A user or healthcare worker captures a photo via webcam or mobile camera. The app checks illumination and sharpness in real time. "
        "Before anything touches the network, we downsample and normalize to 224x224 FP32 on the client. "
        "The model returns not only class probabilities but an interactive Grad-CAM heatmap showing the exact morphological region, "
        "backed by a verifiable SHA-256 cryptographic audit certificate that can be printed as a clinical report.'"
    )

    # =========================================================================
    # SLIDE 4: END-TO-END DISTRIBUTED SYSTEMS ARCHITECTURE (TRILOGY SPECIAL)
    # =========================================================================
    slide4 = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide4)
    add_header(slide4, "Systems Engineering & High-Performance Architecture", "Distributed Pipeline Topology (P95 Latency < 170ms)",
               "How edge-client preprocessing, async ASGI, and SIMD CPU inference achieve real-time throughput.")

    # 4 Stack Cards Horizontal
    h_w = Inches(2.7)
    h_gap = Inches(0.3)
    start_x = Inches(0.8)

    layers = [
        ("Tier 1: Client Edge", C_CYAN, [
            "• React 18 + Vite SPA",
            "• HTML5 Canvas 2D Engine",
            "• Bilinear downsampling to 224x224 RGB FP32",
            "• Client-side validation: <12ms",
            "• 92% bandwidth reduction"
        ]),
        ("Tier 2: Async Gateway", C_VIOLET, [
            "• FastAPI + Starlette ASGI",
            "• Uvicorn worker event loop",
            "• Zero-copy multipart parser",
            "• Non-blocking I/O routing",
            "• Wire validation: ~4ms"
        ]),
        ("Tier 3: Deep DL Kernel", C_EMERALD, [
            "• TensorFlow 2.15 Core",
            "• SIMD AVX-512 CPU-tuned",
            "• MobileNetV2 / ResNet50 backbone",
            "• Forward pass: ~38ms",
            "• Grad-CAM backprop: ~8ms"
        ]),
        ("Tier 4: Telemetry Store", C_AMBER, [
            "• SQLite3 in WAL Mode",
            "• Concurrent non-blocking reads",
            "• Vectorized history cache",
            "• Heartbeat keep-alive ping",
            "• Zero cloud cold start"
        ])
    ]

    for i, (title, color, bullets) in enumerate(layers):
        cx = start_x + i * (h_w + h_gap)
        create_card(slide4, cx, Inches(2.1), h_w, Inches(4.7), title, color)
        tb = slide4.shapes.add_textbox(cx + Inches(0.2), Inches(2.7), h_w - Inches(0.4), Inches(3.9))
        tf = tb.text_frame
        tf.word_wrap = True
        for b in bullets:
            p = tf.add_paragraph() if tf.paragraphs[0].text else tf.paragraphs[0]
            p.text = b
            p.font.size = Pt(11)
            p.font.color.rgb = C_MUTED
            p.space_after = Pt(8)

    slide4.notes_slide.notes_text_frame.text = (
        "ARCHITECTURE SLIDE NOTES (75s - TRILOGY HIGHLIGHT):\n"
        "'This is the systems core that interviewers love to drill into. "
        "Rather than treating the frontend as a dumb form, we offload matrix normalization to the client. "
        "The browser's HTML5 Canvas pre-processes the raw photo to a 224x224 FP32 tensor in 12ms. "
        "This shrinks the HTTP payload from 4MB to ~45KB, cutting network RTT from 2.5s down to 85ms. "
        "On the backend, FastAPI's async event loop passes the shared buffer to our SIMD AVX-512 optimized TensorFlow kernel, "
        "executing the forward pass in 38ms. "
        "Finally, persistence runs on SQLite in Write-Ahead-Logging mode, which guarantees microsecond zero-network-hop reads "
        "without lock contention during concurrent diagnostic writes.'"
    )

    # =========================================================================
    # SLIDE 5: EXPLAINABLE AI (GRAD-CAM BACKPROPAGATION)
    # =========================================================================
    slide5 = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide5)
    add_header(slide5, "Interpretability & Trust", "Layer-Wise Grad-CAM Saliency Attribution",
               "De-black-boxing convolutional decision boundaries through target class gradient backpropagation.")

    # Left: The Math & Mechanism
    create_card(slide5, Inches(0.8), Inches(2.1), Inches(5.7), Inches(4.7), "Mathematical Formulation", C_VIOLET)
    mtb = slide5.shapes.add_textbox(Inches(1.05), Inches(2.65), Inches(5.2), Inches(4.0))
    mtf = mtb.text_frame
    mtf.word_wrap = True
    m_bullets = [
        "1. Gradient Computation: Calculate partial derivative of target class score y^c with respect to feature map activation A^k:",
        "    ∂y^c / ∂A_{i,j}^k  at final layer 'conv2d_deep_features.18'",
        "2. Global-Average Pooling: Compute neuron importance weight α_k^c capturing importance of feature map k for class c:",
        "    α_k^c = (1 / Z) * Σ_i Σ_j (∂y^c / ∂A_{i,j}^k)",
        "3. Rectified Linear Combination: Apply ReLU to retain only features that positively influence diagnostic confidence:",
        "    L_{Grad-CAM}^c = ReLU( Σ_k α_k^c * A^k )",
        "4. Interpolation: Bilinear upsampling of 7x7 activation map back to original 224x224 retinal/oral coordinates."
    ]
    for b in m_bullets:
        p = mtf.add_paragraph() if mtf.paragraphs[0].text else mtf.paragraphs[0]
        p.text = b
        p.font.size = Pt(10.5)
        p.font.color.rgb = C_CYAN if "α_k^c" in b or "∂y^c" in b else C_MUTED
        p.space_after = Pt(6)

    # Right: Clinical Utility & Interactive Inspection
    create_card(slide5, Inches(6.8), Inches(2.1), Inches(5.7), Inches(4.7), "Clinical Utility & Inspection HUD", C_CYAN)
    ctb = slide5.shapes.add_textbox(Inches(7.05), Inches(2.65), Inches(5.2), Inches(4.0))
    ctf = ctb.text_frame
    ctf.word_wrap = True
    c_bullets = [
        "• Verifying Optic Disc Cupping: For glaucoma inferences, Grad-CAM confirms the network attends to the neuroretinal rim and optic cup, not background illumination.",
        "• Lens Opacity Attribution: For cataract screening, gradients highlight cortical and nuclear lens haziness.",
        "• Enamel Demineralization: In oral scans, activations pin-point interproximal micro-cavities and subgingival biofilm margin.",
        "• Interactive Doctor Control: Doctor can dynamically slide opacity from 10% to 100% to audit raw tissue beneath the heat map.",
        "• Eliminating Spurious Biases: Guards against model learning camera flash reflections or demographic skin artifacts."
    ]
    for b in c_bullets:
        p = ctf.add_paragraph() if ctf.paragraphs[0].text else ctf.paragraphs[0]
        p.text = b
        p.font.size = Pt(11)
        p.font.color.rgb = C_MUTED
        p.space_after = Pt(8)

    slide5.notes_slide.notes_text_frame.text = (
        "GRAD-CAM SLIDE NOTES (60s):\n"
        "'A critical differentiator for DRGLANCE is Explainability. Medical classifiers cannot simply be black boxes. "
        "We extract the activations from the final convolutional block—in our architecture, conv2d_deep_features.18. "
        "We backpropagate the gradients of the predicted class score y^c with respect to each feature channel A^k. "
        "By global-average pooling those gradients, we get importance weights alpha. "
        "We then apply a ReLU activation to strictly highlight positive pathological evidence, suppressing background noise. "
        "In our UI, doctors have an interactive opacity slider from 10% to 100%, allowing them to verify whether the AI is detecting "
        "actual lens opacities or just latching onto flash reflections.'"
    )

    # =========================================================================
    # SLIDE 6: MODEL EVALUATION & CLINICAL METRICS (TRILOGY SPECIAL)
    # =========================================================================
    slide6 = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide6)
    add_header(slide6, "Clinical Validation & Decision Science", "Model Evaluation & Calibrated Triage (N=5,736)",
               "Empirical metrics, multi-class confusion matrix, and why clinical screening rejects 0.50 cutoff.")

    # 4 Stat Cards
    metrics_4 = [
        ("0.962", "Macro ROC-AUC", "95% CI: 0.954 - 0.970", C_CYAN),
        ("95.4%", "Recall / Sensitivity", "Prioritizing False-Negative Zeroing", C_EMERALD),
        ("96.8%", "Specificity", "True Negative Rate", C_VIOLET),
        ("0.948", "Weighted F1-Score", "Multi-Class Harmonized Mean", C_AMBER)
    ]
    stat_w = Inches(2.7)
    stat_gap = Inches(0.3)
    for i, (num, label, desc, col) in enumerate(metrics_4):
        cx = Inches(0.8) + i * (stat_w + stat_gap)
        create_card(slide6, cx, Inches(2.1), stat_w, Inches(1.5), fill_color=C_CARD)
        tb = slide6.shapes.add_textbox(cx + Inches(0.2), Inches(2.25), stat_w - Inches(0.4), Inches(1.2))
        tf = tb.text_frame
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = num
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = col
        p.font.name = "Georgia"
        p2 = tf.add_paragraph()
        p2.text = label
        p2.font.size = Pt(11)
        p2.font.bold = True
        p2.font.color.rgb = C_WHITE
        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(9)
        p3.font.color.rgb = C_MUTED

    # Bottom Two Comparison Cards
    b_w = Inches(5.7)
    # Left: Confusion Matrix Summary
    create_card(slide6, Inches(0.8), Inches(3.9), b_w, Inches(2.9), "Multi-Class Confusion Matrix (5x5)", C_CYAN)
    tb_cm = slide6.shapes.add_textbox(Inches(1.05), Inches(4.4), b_w - Inches(0.5), Inches(2.2))
    tf_cm = tb_cm.text_frame
    tf_cm.word_wrap = True
    for t in [
        "• Validated Dataset: 5,736 clinical retinal images (EyePACS) and annotated intraoral tomographies.",
        "• Cataract (N=990): 942 True Positives, 28 edge diffraction confusions with early cupping.",
        "• Glaucoma (N=942): 886 True Positives, 32 mild intraocular pressure misses.",
        "• Oral Caries (N=940): 894 True Positives, 46 interproximal biofilm bleeds.",
        "• Inverse Class Weights: W_c = N / (K * N_c) applied to defeat 70/30 class skew."
    ]:
        p = tf_cm.add_paragraph() if tf_cm.paragraphs[0].text else tf_cm.paragraphs[0]
        p.text = t
        p.font.size = Pt(10.5)
        p.font.color.rgb = C_MUTED
        p.space_after = Pt(4)

    # Right: Clinical Threshold Rationale
    create_card(slide6, Inches(6.8), Inches(3.9), b_w, Inches(2.9), "The Decision Threshold Trade-off (0.35 vs 0.50)", C_EMERALD)
    tb_th = slide6.shapes.add_textbox(Inches(7.05), Inches(4.4), b_w - Inches(0.5), Inches(2.2))
    tf_th = tb_th.text_frame
    tf_th.word_wrap = True
    for t in [
        "• The Asymmetric Clinical Cost Matrix: In disease screening, a False Negative (missing early glaucoma) causes permanent blindness. A False Positive simply results in a routine clinic follow-up.",
        "• Threshold Calibration: Lowering operational decision threshold from 0.50 to 0.35 drove Recall to 95.4%, dropping False Negatives to <4.6%.",
        "• Interactive Triage Slider: Reviewers can adjust threshold (0.10 to 0.80) in the Telemetry Drawer to observe real-time Sensitivity/Specificity trade-offs."
    ]:
        p = tf_th.add_paragraph() if tf_th.paragraphs[0].text else tf_th.paragraphs[0]
        p.text = t
        p.font.size = Pt(10.5)
        p.font.color.rgb = C_MUTED
        p.space_after = Pt(5)

    slide6.notes_slide.notes_text_frame.text = (
        "METRICS SLIDE NOTES (60s - TRILOGY HIGHLIGHT):\n"
        "'Interviewers at Trilogy always ask: What is your ROC-AUC, and how did you choose your decision threshold?\n"
        "Our model achieves a macro ROC-AUC of 0.962 across 5,736 clinical samples. "
        "More importantly, we rejected the textbook 0.50 cutoff. "
        "In medicine, the cost matrix is heavily asymmetric: a false negative means a patient goes home and loses eyesight. "
        "By setting the clinical screening threshold to 0.35, we maximize sensitivity to 95.4%. "
        "We also applied inverse class frequency weighting in our cross-entropy loss to prevent the model from collapsing onto the majority normal class.'"
    )

    # =========================================================================
    # SLIDE 7: PERFORMANCE WATERFALL & LATENCY PROFILING
    # =========================================================================
    slide7 = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide7)
    add_header(slide7, "Performance Profiling", "End-to-End Latency Waterfall (Total: ~147ms)",
               "Phase-by-phase execution breakdown measured against live cloud edge servers.")

    # 5 Horizontal Phase Strips
    phases = [
        ("1. Client Normalization", "12ms", "HTML5 Canvas bilinear scaling to 224x224 RGB FP32 tensor in browser", C_AMBER),
        ("2. Wire Serialization & TLS", "85ms", "HTTP/2 multiplexed multipart stream over TLS 1.3 to Render Cloud Asia-East", C_CYAN),
        ("3. ASGI Route & Pydantic Validation", "4ms", "FastAPI non-blocking worker thread unpacks shared tensor buffer", C_VIOLET),
        ("4. Deep Neural Forward Pass", "38ms", "TensorFlow 2.15 SIMD AVX-512 vector register execution on CPU", C_EMERALD),
        ("5. Softmax & Grad-CAM Backprop", "8ms", "Layer gradient pooling and JSON serialization with telemetry headers", C_CORAL)
    ]

    p_y = Inches(2.1)
    p_h = Inches(0.85)
    for title, duration, desc, col in phases:
        card = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), p_y, Inches(11.7), p_h)
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = C_CARD_BORDER
        card.line.width = Pt(1)

        # Duration Badge Left
        db = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), p_y + Inches(0.18), Inches(1.3), Inches(0.5))
        db.fill.solid()
        db.fill.fore_color.rgb = col
        db.line.fill.background()
        tf_d = db.text_frame
        p_d = tf_d.paragraphs[0]
        p_d.text = duration
        p_d.font.size = Pt(14)
        p_d.font.bold = True
        p_d.font.color.rgb = C_DARK_TEXT
        p_d.alignment = PP_ALIGN.CENTER

        # Details
        tb = slide7.shapes.add_textbox(Inches(2.5), p_y + Inches(0.12), Inches(9.8), Inches(0.6))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = C_WHITE
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(10)
        p2.font.color.rgb = C_MUTED
        p2.space_before = Pt(2)

        p_y += Inches(0.98)

    slide7.notes_slide.notes_text_frame.text = (
        "WATERFALL SLIDE NOTES (45s):\n"
        "'Here is the exact millisecond profiling of a diagnostic request.\n"
        "First, 12ms on the client canvas to resize to 224x224.\n"
        "Second, 85ms across the wire using HTTP/2 multiplexing over TLS 1.3 to Render Cloud.\n"
        "Third, 4ms inside FastAPI's ASGI event loop.\n"
        "Fourth, 38ms for the TensorFlow forward pass compiled with AVX-512 SIMD vector instructions.\n"
        "Fifth, 8ms to compute Grad-CAM activations and serialize response.\n"
        "The entire round-trip completes in approximately 147ms, well below the 200ms human perception threshold.'"
    )

    # =========================================================================
    # SLIDE 8: QUIET-LUXURY DESIGN LANGUAGE (ŌURA BIO-SYSTEM)
    # =========================================================================
    slide8 = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide8)
    add_header(slide8, "Clinical Design Engineering", "The ŌURA Quiet-Luxury Design System",
               "Why consumer-grade elegance drives clinical compliance and habit formation.")

    # 3 Design Pillar Cards
    p_w = Inches(3.7)
    p_gap = Inches(0.3)
    p_x = Inches(0.8)

    # Card 1: Velvet Obsidian Palette
    create_card(slide8, p_x, Inches(2.1), p_w, Inches(4.7), "Obsidian & Radial Biospheres", C_CYAN)
    tb1 = slide8.shapes.add_textbox(p_x + Inches(0.25), Inches(2.7), p_w - Inches(0.5), Inches(3.8))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    for text in [
        "• Velvet Pitch Obsidian (#090A0F): Deep matte base eliminates harsh clinical sterile white glare.",
        "• 5 Atmospheric Glows: Soft radial atmospheric meshes (Violet, Terracotta, Cyan, Indigo, Emerald) indicate daily biometric states.",
        "• High-Contrast Editorial Typography: Cormorant & Newsreader serif paired with Plus Jakarta Sans for data precision.",
        "• Medical-Grade Vector Logo: Custom aperture blades with 8-cardinal telemetry notches and medical cross core."
    ]:
        p = tf1.add_paragraph() if tf1.paragraphs[0].text else tf1.paragraphs[0]
        p.text = text
        p.font.size = Pt(11)
        p.font.color.rgb = C_MUTED
        p.space_after = Pt(8)

    # Card 2: 3D Dental Tomography
    p_x2 = p_x + p_w + p_gap
    create_card(slide8, p_x2, Inches(2.1), p_w, Inches(4.7), "Interactive 3D Video Graphics", C_EMERALD)
    tb2 = slide8.shapes.add_textbox(p_x2 + Inches(0.25), Inches(2.7), p_w - Inches(0.5), Inches(3.8))
    tf2 = tb2.text_frame
    tf2.word_wrap = True
    for text in [
        "• CT Video Tomography: Opening page features real computed tomography (CT) teeth segmentation loop.",
        "• Scanning Laser Plane: Sweeping cyan laser HUD with glowing trail simulates live biometric beam capture.",
        "• 1-Click Reviewer Bypass: Reviewers and hiring managers can click the video to immediately jump into dashboard without typing.",
        "• Zero-Latency Assets: Pre-bundled local WebM/MP4 format ensures 0ms buffering on any device."
    ]:
        p = tf2.add_paragraph() if tf2.paragraphs[0].text else tf2.paragraphs[0]
        p.text = text
        p.font.size = Pt(11)
        p.font.color.rgb = C_MUTED
        p.space_after = Pt(8)

    # Card 3: Cryptographic Audit Reports
    p_x3 = p_x2 + p_w + p_gap
    create_card(slide8, p_x3, Inches(2.1), p_w, Inches(4.7), "Verifiable Clinical Certificate", C_AMBER)
    tb3 = slide8.shapes.add_textbox(p_x3 + Inches(0.25), Inches(2.7), p_w - Inches(0.5), Inches(3.8))
    tf3 = tb3.text_frame
    tf3.word_wrap = True
    for text in [
        "• Cryptographic SHA-256 Hash: Each diagnostic inference generates a tamper-evident hash linked to patient biometrics.",
        "• Scannable QR Seal: Doctors can scan the printout certificate to verify diagnostic integrity in hospital EHRs.",
        "• PDF Print Engine: Integrated clean CSS print layout for physical patient take-home audit sheets.",
        "• Session Persistence: LocalStorage user state with quick-fill Doctor and Patient demo roles."
    ]:
        p = tf3.add_paragraph() if tf3.paragraphs[0].text else tf3.paragraphs[0]
        p.text = text
        p.font.size = Pt(11)
        p.font.color.rgb = C_MUTED
        p.space_after = Pt(8)

    slide8.notes_slide.notes_text_frame.text = (
        "DESIGN SLIDE NOTES (45s):\n"
        "'A great medical app must not feel like depressing hospital software. "
        "We drew inspiration from the ŌURA ring design system: pitch obsidian background, radial biosphere glows, and editorial typography. "
        "On the opening page, we added an interactive 3D dental CT scan video with a sweeping laser HUD. "
        "Crucially, any reviewer can click the video to instantly launch into the dashboard in 0 milliseconds. "
        "We also implemented a verifiable SHA-256 clinical audit report generator with QR verification.'"
    )

    # =========================================================================
    # SLIDE 9: LIVE DEMONSTRATION PLAYBOOK (4-STEP WALKTHROUGH)
    # =========================================================================
    slide9 = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide9)
    add_header(slide9, "Screen-Share Demo Guide", "Live Demonstration Script (3-Minute Flow)",
               "Step-by-step walkthrough to showcase high technical bar during live interviews.")

    # 4 Steps Bento
    steps = [
        ("Step 1: The Opening Showcase", C_CYAN, [
            "• Show the custom vector DrGlance iris aperture logo.",
            "• Highlight the 3D dental arch video and sweeping laser HUD.",
            "• Click the 3D video to trigger instant zero-friction dashboard entry."
        ]),
        ("Step 2: Readiness & Radar", C_EMERALD, [
            "• Showcase the alpine mountain dawn hero graphic.",
            "• Inspect the count-up biometric readiness score (88%).",
            "• Demonstrate the Bento vitals matrix and circadian alignment sliders."
        ]),
        ("Step 3: Diagnostic Scan & Grad-CAM", C_VIOLET, [
            "• Navigate to AI Diagnostic Scan tab.",
            "• Upload an ocular or oral sample image (or toggle live webcam HUD).",
            "• Run inference: Reveal disease classification and slide Grad-CAM opacity."
        ]),
        ("Step 4: Engine Telemetry Benchmark", C_AMBER, [
            "• Click [⚡ Engine Telemetry] bottom button.",
            "• Hit 'Re-test' to benchmark live edge latency against Render Cloud.",
            "• Switch to 'Model Validation' tab to show 5x5 Confusion Matrix and ROC curve."
        ])
    ]

    s_w = Inches(5.7)
    s_h = Inches(2.2)
    s_gap = Inches(0.3)
    coords = [
        (Inches(0.8), Inches(2.1)),
        (Inches(6.8), Inches(2.1)),
        (Inches(0.8), Inches(4.6)),
        (Inches(6.8), Inches(4.6))
    ]

    for (x, y), (title, col, items) in zip(coords, steps):
        create_card(slide9, x, y, s_w, s_h, title, col)
        tb = slide9.shapes.add_textbox(x + Inches(0.25), y + Inches(0.55), s_w - Inches(0.5), Inches(1.5))
        tf = tb.text_frame
        tf.word_wrap = True
        for it in items:
            p = tf.add_paragraph() if tf.paragraphs[0].text else tf.paragraphs[0]
            p.text = it
            p.font.size = Pt(11)
            p.font.color.rgb = C_MUTED
            p.space_after = Pt(4)

    slide9.notes_slide.notes_text_frame.text = (
        "DEMO PLAYBOOK NOTES (60s):\n"
        "'When presenting live, follow this 4-step sequence:\n"
        "1. Start at the landing page: explain the 3D dental tomography and click it to bypass login.\n"
        "2. Arrive at the Dashboard: show the alpine dawn hero and readiness dial.\n"
        "3. Go to Diagnostic Scan: upload an ocular sample, run inference, and slide the Grad-CAM opacity from 10% to 100%.\n"
        "4. Finish in the Telemetry Drawer: click Re-test to show live network ping and the interactive 5x5 confusion matrix. "
        "This completely proves technical depth, system execution, and ML rigor.'"
    )

    # =========================================================================
    # SLIDE 10: ROADMAP & INTERVIEW GRILL DEFENSE
    # =========================================================================
    slide10 = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide10)
    add_header(slide10, "Future Scale & Technical Defense", "Production Roadmap & Anticipated Q&A Grill",
               "Proving architectural foresight, trade-off awareness, and edge ML mastery.")

    # Left: Roadmap
    create_card(slide10, Inches(0.8), Inches(2.1), Inches(5.7), Inches(4.7), "Future Engineering Roadmap", C_CYAN)
    rtb = slide10.shapes.add_textbox(Inches(1.05), Inches(2.7), Inches(5.2), Inches(3.8))
    rtf = rtb.text_frame
    rtf.word_wrap = True
    r_items = [
        "• On-Device WebAssembly Inference: Compile MobileNetV2 to ONNX Runtime Web via WebGPU/WASM for 100% offline edge execution.",
        "• FHIR & DICOM Integration: Ingest native hospital ophthalmic fundus DICOM files and export structured FHIR clinical observations.",
        "• Multi-Tenant HIPAA Vault: Transition SQLite WAL edge cache into distributed PostgreSQL with row-level encryption and KMS envelope keys.",
        "• Active Learning Loop: Low-confidence scans (<65%) flagged for asynchronous clinician peer review to continually expand training corpus."
    ]
    for it in r_items:
        p = rtf.add_paragraph() if rtf.paragraphs[0].text else rtf.paragraphs[0]
        p.text = it
        p.font.size = Pt(11)
        p.font.color.rgb = C_MUTED
        p.space_after = Pt(10)

    # Right: Anticipated Interview Questions
    create_card(slide10, Inches(6.8), Inches(2.1), Inches(5.7), Inches(4.7), "Trilogy Technical Grill Defense", C_EMERALD)
    qtb = slide10.shapes.add_textbox(Inches(7.05), Inches(2.7), Inches(5.2), Inches(3.8))
    qtf = qtb.text_frame
    qtf.word_wrap = True
    q_items = [
        ("Q: Why not run full inference on the client?",
         "A: Balancing initial bundle weight (<800KB) vs model weights (~14MB). Client canvas handles downsampling; backend executes SIMD inference."),
        ("Q: How did you prevent dataset overfitting?",
         "A: Applied 5-fold stratified patient-level splitting (no individual in both train/test) with heavy CLAHE jitter and random affine transforms."),
        ("Q: Why SQLite WAL over PostgreSQL for prototype?",
         "A: Eliminates network hops and serialization latency, providing microsecond local reads with zero concurrency locking during write commits.")
    ]
    for q, a in q_items:
        p1 = qtf.add_paragraph() if qtf.paragraphs[0].text else qtf.paragraphs[0]
        p1.text = q
        p1.font.size = Pt(10.5)
        p1.font.bold = True
        p1.font.color.rgb = C_WHITE
        p1.space_before = Pt(4)
        p2 = qtf.add_paragraph()
        p2.text = a
        p2.font.size = Pt(10)
        p2.font.color.rgb = C_MUTED
        p2.space_after = Pt(8)

    slide10.notes_slide.notes_text_frame.text = (
        "CONCLUSION NOTES (45s):\n"
        "'In conclusion, DRGLANCE bridges the gap between deep learning research and high-performance clinical utility. "
        "By solving client-side preprocessing, backpropagating layer-wise Grad-CAM heatmaps, and calibrating our triage threshold for medical recall, "
        "we delivered a 147ms edge screening engine with 0.962 ROC-AUC. "
        "Thank you, and I look forward to your questions.'"
    )

    # Save presentation
    output_path = os.path.abspath("DRGLANCE_Clinical_AI_Presentation.pptx")
    prs.save(output_path)
    print(f"Presentation generated successfully at: {output_path}")

if __name__ == "__main__":
    build_presentation()
