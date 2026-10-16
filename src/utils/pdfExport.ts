import { jsPDF } from 'jspdf';
import { StudySessionResult } from '../types/study';

export interface PdfExportOptions {
  includeSummary: boolean;
  includeConcepts: boolean;
  includeDefinitions: boolean;
  includeFlashcards: boolean;
  includeExamAlerts: boolean;
  includeMetrics: boolean;
  paperSize: 'a4' | 'letter';
  fontSize: 'compact' | 'normal' | 'spacious';
}

export const DEFAULT_PDF_OPTIONS: PdfExportOptions = {
  includeSummary: true,
  includeConcepts: true,
  includeDefinitions: true,
  includeFlashcards: true,
  includeExamAlerts: true,
  includeMetrics: true,
  paperSize: 'a4',
  fontSize: 'normal',
};

/**
 * Strips unsupported characters and sanitizes text for clean PDF rendering
 */
export function sanitizePdfText(str: string): string {
  if (!str) return '';
  return str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2022\u2023]/g, '•')
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, '  ');
}

/**
 * Builds and downloads a high-fidelity PDF document containing the study session summary,
 * key definitions, flashcards deck, and exam traps for offline reading.
 */
export function generateStudySessionPdf(
  session: StudySessionResult,
  options: Partial<PdfExportOptions> = {}
): jsPDF {
  const opts: PdfExportOptions = { ...DEFAULT_PDF_OPTIONS, ...options };
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: opts.paperSize,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Colors
  const primaryTeal = [13, 92, 75]; // #0d5c4b
  const darkTeal = [10, 76, 62];
  const slateDark = [30, 41, 59]; // #1e293b
  const slateMuted = [100, 116, 139]; // #64748b
  const bgLight = [248, 250, 252];
  const borderLight = [226, 232, 240];
  const amberBg = [254, 243, 199];
  const amberBorder = [245, 158, 11];
  const roseBg = [255, 241, 242];
  const emeraldBg = [236, 253, 245];

  // Helper: check space and auto-page break
  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 12) {
      doc.addPage();
      y = margin + 10;
      drawRunningHeader();
    }
  };

  const drawRunningHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text(`LecturaAI — Offline Study Guide: ${sanitizePdfText(session.title).slice(0, 50)}`, margin, margin);
    doc.text(`Target: ${session.targetExam}`, pageWidth - margin, margin, { align: 'right' });
    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, margin + 2, pageWidth - margin, margin + 2);
  };

  // -------------------------------------------------------------
  // Title / Document Header Block
  // -------------------------------------------------------------
  // Header background banner
  doc.setFillColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.roundedRect(margin, y, contentWidth, 32, 3, 3, 'F');

  // Brand tag
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(167, 243, 208); // light mint
  doc.text('LECTURAAI • UNIVERSITY STUDY PACKET (OFFLINE EDITION)', margin + 6, y + 8);

  // Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  const titleLines = doc.splitTextToSize(sanitizePdfText(session.title), contentWidth - 12);
  doc.text(titleLines[0] || 'Study Session Notes', margin + 6, y + 16);

  // Meta Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(209, 250, 229);
  const metaText = `Subject: ${session.subject}   |   Target: ${session.targetExam}   |   Generated: ${new Date().toLocaleDateString()}`;
  doc.text(metaText, margin + 6, y + 25);

  y += 36;

  // -------------------------------------------------------------
  // Study Performance & Metric Summary Pills
  // -------------------------------------------------------------
  if (opts.includeMetrics && session.metrics) {
    const pillWidth = (contentWidth - 6) / 3;
    const pillHeight = 14;

    const stats = [
      {
        label: 'EST. TIME SAVED',
        val: `${session.metrics.timeSavedMin} Minutes`,
      },
      {
        label: 'COMPRESSION RATIO',
        val: `${session.metrics.compressionRatioPercent}% Saved`,
      },
      {
        label: 'REVISION DECK',
        val: `${session.flashcards.length} Flashcards`,
      },
    ];

    stats.forEach((st, i) => {
      const px = margin + i * (pillWidth + 3);
      doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
      doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
      doc.roundedRect(px, y, pillWidth, pillHeight, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
      doc.text(st.label, px + 4, y + 5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
      doc.text(st.val, px + 4, y + 11);
    });

    y += pillHeight + 6;
  }

  // -------------------------------------------------------------
  // SECTION 1: Executive Summary & Overview
  // -------------------------------------------------------------
  if (opts.includeSummary && session.overviewSummary) {
    ensureSpace(25);

    // Section title
    doc.setFillColor(darkTeal[0], darkTeal[1], darkTeal[2]);
    doc.rect(margin, y, 3, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text('1. Executive Academic Synthesis', margin + 6, y + 5.5);
    y += 10;

    // Overview paragraphs
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor( slateDark[0], slateDark[1], slateDark[2]);

    const paragraphs = session.overviewSummary.split('\n\n').filter(Boolean);
    for (const para of paragraphs) {
      const cleanPara = sanitizePdfText(para);
      const lines = doc.splitTextToSize(cleanPara, contentWidth - 4);
      const neededHeight = lines.length * 4.5;
      ensureSpace(neededHeight + 4);

      doc.text(lines, margin + 2, y);
      y += neededHeight + 3;
    }

    // High Yield Bullets
    if (session.bulletSummary && session.bulletSummary.length > 0) {
      ensureSpace(18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
      doc.text('Core Exam Takeaways & Principles:', margin + 2, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);

      session.bulletSummary.forEach((bullet, bIdx) => {
        const bulletText = sanitizePdfText(bullet);
        const bLines = doc.splitTextToSize(`${bIdx + 1}.  ${bulletText}`, contentWidth - 8);
        const bulletHeight = bLines.length * 4.3;
        ensureSpace(bulletHeight + 2);

        // subtle bullet pill bar
        doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
        doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
        doc.roundedRect(margin, y - 3, contentWidth, bulletHeight + 3, 1.5, 1.5, 'FD');

        doc.text(bLines, margin + 3, y + 1);
        y += bulletHeight + 5;
      });
    }

    y += 4;
  }

  // -------------------------------------------------------------
  // SECTION 2: Must-Know Definitions & Glossary
  // -------------------------------------------------------------
  if (opts.includeDefinitions && session.definitions && session.definitions.length > 0) {
    ensureSpace(25);

    doc.setFillColor(darkTeal[0], darkTeal[1], darkTeal[2]);
    doc.rect(margin, y, 3, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(`2. Must-Know Glossary & Definitions (${session.definitions.length} Terms)`, margin + 6, y + 5.5);
    y += 10;

    session.definitions.forEach((def, dIdx) => {
      const termClean = sanitizePdfText(def.term);
      const defClean = sanitizePdfText(def.definition);
      const examClean = def.examContext ? sanitizePdfText(def.examContext) : '';

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const defLines = doc.splitTextToSize(defClean, contentWidth - 10);
      const examLines = examClean ? doc.splitTextToSize(`Exam Note: ${examClean}`, contentWidth - 10) : [];

      const blockHeight = 10 + defLines.length * 4 + (examLines.length ? examLines.length * 3.8 + 2 : 0);
      ensureSpace(blockHeight + 3);

      // Card container
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
      doc.roundedRect(margin, y, contentWidth, blockHeight, 2, 2, 'FD');

      // Term title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
      doc.text(`${dIdx + 1}. ${termClean}`, margin + 4, y + 6);

      // Importance badge
      const badgeText = (def.importance || 'HIGH').toUpperCase();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      const badgeWidth = doc.getTextWidth(badgeText) + 6;
      doc.setFillColor(emeraldBg[0], emeraldBg[1], emeraldBg[2]);
      doc.roundedRect(margin + contentWidth - badgeWidth - 4, y + 2, badgeWidth, 5, 1, 1, 'F');
      doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
      doc.text(badgeText, margin + contentWidth - badgeWidth - 1, y + 5.5);

      // Definition text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
      doc.text(defLines, margin + 4, y + 11);

      // Exam note if present
      if (examLines.length > 0) {
        const examY = y + 11 + defLines.length * 4;
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.8);
        doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
        doc.text(examLines, margin + 4, examY);
      }

      y += blockHeight + 3.5;
    });

    y += 4;
  }

  // -------------------------------------------------------------
  // SECTION 3: Key Concepts & Laws
  // -------------------------------------------------------------
  if (opts.includeConcepts && session.concepts && session.concepts.length > 0) {
    ensureSpace(25);

    doc.setFillColor(darkTeal[0], darkTeal[1], darkTeal[2]);
    doc.rect(margin, y, 3, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(`3. Core Concepts & Theoretical Invariants`, margin + 6, y + 5.5);
    y += 10;

    session.concepts.forEach((concept, cIdx) => {
      const titleClean = sanitizePdfText(concept.title);
      const explClean = sanitizePdfText(concept.explanation);
      const formulaClean = concept.formulaOrRule ? sanitizePdfText(concept.formulaOrRule) : '';

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const explLines = doc.splitTextToSize(explClean, contentWidth - 10);
      const formLines = formulaClean ? doc.splitTextToSize(`Invariant Rule / Formula: ${formulaClean}`, contentWidth - 14) : [];

      const blockHeight = 10 + explLines.length * 4 + (formLines.length ? formLines.length * 4 + 6 : 0);
      ensureSpace(blockHeight + 4);

      doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
      doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
      doc.roundedRect(margin, y, contentWidth, blockHeight, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
      doc.text(`Concept ${cIdx + 1}: ${titleClean}`, margin + 4, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
      doc.text(explLines, margin + 4, y + 11);

      if (formLines.length > 0) {
        const formY = y + 12 + explLines.length * 4;
        const formBoxH = formLines.length * 4 + 4;
        doc.setFillColor(amberBg[0], amberBg[1], amberBg[2]);
        doc.setDrawColor(amberBorder[0], amberBorder[1], amberBorder[2]);
        doc.roundedRect(margin + 4, formY - 3, contentWidth - 8, formBoxH, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(180, 83, 9);
        doc.text(formLines, margin + 6, formY + 1);
      }

      y += blockHeight + 4;
    });

    y += 4;
  }

  // -------------------------------------------------------------
  // SECTION 4: Interactive Spaced Repetition Flashcards
  // -------------------------------------------------------------
  if (opts.includeFlashcards && session.flashcards && session.flashcards.length > 0) {
    ensureSpace(30);

    doc.setFillColor(darkTeal[0], darkTeal[1], darkTeal[2]);
    doc.rect(margin, y, 3, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(`4. Spaced Repetition Flashcards (${session.flashcards.length} Cards)`, margin + 6, y + 5.5);
    y += 10;

    session.flashcards.forEach((card, fcIdx) => {
      const frontClean = sanitizePdfText(card.front);
      const backClean = sanitizePdfText(card.back);
      const tipClean = card.examTip ? sanitizePdfText(card.examTip) : '';

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const frontLines = doc.splitTextToSize(`Q: ${frontClean}`, contentWidth - 10);
      const backLines = doc.splitTextToSize(`A: ${backClean}`, contentWidth - 10);
      const tipLines = tipClean ? doc.splitTextToSize(`Examiner Tip: ${tipClean}`, contentWidth - 10) : [];

      const cardHeight =
        12 +
        frontLines.length * 4 +
        backLines.length * 4 +
        (tipLines.length ? tipLines.length * 3.8 + 4 : 0);

      ensureSpace(cardHeight + 4);

      // Outer card box
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
      doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, 'FD');

      // Top info bar: Card number, topic, box
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
      doc.text(`FLASHCARD #${fcIdx + 1} • TOPIC: ${card.topic || session.subject}`, margin + 4, y + 5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
      doc.text(`BOX ${card.box || 1} / 5`, margin + contentWidth - 20, y + 5);

      // Question
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
      doc.text(frontLines, margin + 4, y + 10);

      // Divider line
      const divY = y + 11 + frontLines.length * 4;
      doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
      doc.line(margin + 4, divY, margin + contentWidth - 4, divY);

      // Answer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
      doc.text(backLines, margin + 4, divY + 4.5);

      // Examiner Tip
      if (tipLines.length > 0) {
        const tipY = divY + 5.5 + backLines.length * 4;
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.8);
        doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
        doc.text(tipLines, margin + 4, tipY);
      }

      y += cardHeight + 3.5;
    });

    y += 4;
  }

  // -------------------------------------------------------------
  // SECTION 5: Critical Exam Traps & Alerts
  // -------------------------------------------------------------
  if (opts.includeExamAlerts && session.examAlerts && session.examAlerts.length > 0) {
    ensureSpace(30);

    doc.setFillColor(darkTeal[0], darkTeal[1], darkTeal[2]);
    doc.rect(margin, y, 3, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(`5. Critical Exam Traps & Student Pitfalls`, margin + 6, y + 5.5);
    y += 10;

    session.examAlerts.forEach((alert, aIdx) => {
      const titleClean = sanitizePdfText(alert.title);
      const trapClean = sanitizePdfText(alert.trapDescription);
      const avoidClean = sanitizePdfText(alert.howToAvoid);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const trapLines = doc.splitTextToSize(`Pitfall: ${trapClean}`, contentWidth - 10);
      const avoidLines = doc.splitTextToSize(`Scoring Key: ${avoidClean}`, contentWidth - 10);

      const alertHeight = 12 + trapLines.length * 3.8 + avoidLines.length * 3.8;
      ensureSpace(alertHeight + 4);

      doc.setFillColor(roseBg[0], roseBg[1], roseBg[2]);
      doc.setDrawColor(254, 205, 211);
      doc.roundedRect(margin, y, contentWidth, alertHeight, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(159, 18, 57); // dark rose
      doc.text(`Trap ${aIdx + 1}: ${titleClean}`, margin + 4, y + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(190, 18, 60);
      doc.text(trapLines, margin + 4, y + 10);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
      doc.text(avoidLines, margin + 4, y + 11 + trapLines.length * 3.8);

      y += alertHeight + 3.5;
    });
  }

  // -------------------------------------------------------------
  // Add Running Footers & Page Numbers
  // -------------------------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    // Bottom line
    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - margin + 2, pageWidth - margin, pageHeight - margin + 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text('LecturaAI Study Engine — Offline Student Revision Document', margin, pageHeight - margin + 6);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - margin + 6, { align: 'right' });
  }

  return doc;
}

/**
 * Downloads the PDF directly with a sanitized filename
 */
export function downloadStudySessionPdf(
  session: StudySessionResult,
  options?: Partial<PdfExportOptions>
): void {
  const doc = generateStudySessionPdf(session, options);
  const cleanTitle = session.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .slice(0, 35);
  const fileName = `LecturaAI_${cleanTitle || 'study_packet'}_offline.pdf`;
  doc.save(fileName);
}
