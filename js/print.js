// ============================================================
// print.js – RELIABLE PDF GENERATION (off‑screen capture)
// ============================================================

import { getState, setState } from './core/state.js';
import CONFIG from './core/config.js';
import { uploadPDF, getPDFPublicUrl, updateReport } from './services/supabase.js';
import { isAppOnline } from './services/sync.js';

let isGenerating = false;

/**
 * Standard browser print using print.css
 */
export function printReport() {
  window.print();
}

/**
 * Generates a PDF of the current report.
 * - Always downloads the PDF locally.
 * - Uploads to Supabase ONLY if no pdf_url exists on the current report.
 * - Uses off‑screen rendering for 100% reliable canvas capture.
 */
export async function generatePDF() {
  if (isGenerating) {
    console.warn('PDF generation already in progress.');
    return;
  }
  isGenerating = true;

  const btn = document.getElementById('btn-pdf');
  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ Generating...';
  }

  const state = getState();
  const source = document.getElementById('printable-report');
  if (!source) {
    alert('Report not ready. Please load a scan first.');
    resetGenerationState(btn);
    return;
  }

  // 1. Deep-clone the report content
  const clone = source.cloneNode(true);

  // Remove non‑printable elements from clone
  clone.querySelectorAll(
    '.print-hide, .add-btn, .remove-btn, .action-buttons, #history-panel, #action-buttons, #sidebar-toggle'
  ).forEach(el => el.remove());

  // Ensure print‑only elements are visible
  clone.querySelectorAll('.print-visible-only').forEach(el => {
    el.style.display = 'flex';
  });

  // Strip all IDs to avoid duplicates
  clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));

  // Force A4‑ish layout for capture (794px ≈ 210mm @96dpi)
  clone.style.width = '794px';
  clone.style.margin = '0 auto';
  clone.style.background = '#ffffff';
  clone.style.overflow = 'visible';

  // 2. Off‑screen container (visible to canvas, hidden from user)
  const offScreen = document.createElement('div');
  offScreen.style.position = 'absolute';
  offScreen.style.left = '-9999px';
  offScreen.style.top = '0';
  offScreen.style.visibility = 'visible';
  offScreen.style.opacity = '1';
  offScreen.style.backgroundColor = '#ffffff';
  offScreen.style.width = '794px';   // match clone
  offScreen.style.padding = '0';
  offScreen.style.margin = '0';
  offScreen.appendChild(clone);
  document.body.appendChild(offScreen);

  // 3. Force layout + paint
  clone.getBoundingClientRect();
  await new Promise(resolve => requestAnimationFrame(resolve));
  await new Promise(resolve => setTimeout(resolve, 200)); // extra safety for fonts/images

  let pdfBlob = null;

  try {
    // 4. Capture via html2canvas
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794,
    });

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Captured canvas is empty.');
    }

    // 5. Build multi‑page PDF with jsPDF
    const pdf = new jspdf.jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;        // A4 width in mm
    const pageHeight = 297;       // A4 height in mm
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;
    let pageNum = 0;

    while (position < imgHeight) {
      if (pageNum > 0) {
        pdf.addPage();
      }

      const sliceHeight = Math.min(pageHeight, imgHeight - position);
      // Create a slice canvas for the current page
      const sliceCanvas = document.createElement('canvas');
      const scaleFactor = canvas.width / imgWidth; // px per mm
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = Math.round(sliceHeight * scaleFactor);
      const ctx = sliceCanvas.getContext('2d');
      ctx.drawImage(
        canvas,
        0, Math.round(position * scaleFactor), canvas.width, sliceCanvas.height,
        0, 0, canvas.width, sliceCanvas.height
      );

      pdf.addImage(
        sliceCanvas.toDataURL('image/jpeg', 0.95),
        'JPEG',
        0,
        0,
        imgWidth,
        sliceHeight,
        undefined,
        'FAST'
      );

      position += sliceHeight;
      pageNum++;
    }

    pdfBlob = pdf.output('blob');

    if (!pdfBlob || pdfBlob.size === 0) {
      throw new Error('Generated PDF blob is empty.');
    }

    // 6. Always download locally
    const filename = buildFilename(state);
    downloadBlob(pdfBlob, filename);

    // 7. Upload only if online, report exists, and NO existing cloud PDF
    if (isAppOnline() && state.reportId && !state.pdf_url) {
      try {
        const filePath = `${state.patientInfo.patient_code || 'unknown'}/${filename}`;
        await uploadPDF(filePath, pdfBlob);
        const publicUrl = getPDFPublicUrl(filePath);
        await updateReport(state.reportId, { pdf_url: publicUrl });
        setState({ pdf_url: publicUrl });  // remember for future clicks
        alert('PDF saved locally and uploaded to cloud.');
      } catch (uploadErr) {
        console.error('Upload failed, but local PDF was saved:', uploadErr);
        alert('PDF downloaded, but cloud upload failed.');
      }
    } else {
      alert('PDF downloaded.');
    }
  } catch (err) {
    alert('PDF generation failed: ' + err.message);
    console.error(err);
  } finally {
    // Clean up
    if (offScreen.parentNode) {
      document.body.removeChild(offScreen);
    }
    resetGenerationState(btn);
  }
}

function buildFilename(state) {
  const base = sanitizeFilename(
    state.reportNumber ||
    (state.patientInfo?.name ? state.patientInfo.name.trim() : '') ||
    'report'
  );
  return `${base}.pdf`;
}

function sanitizeFilename(str) {
  return str.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, '_') || 'report';
}

function resetGenerationState(btn) {
  isGenerating = false;
  if (btn) {
    btn.disabled = false;
    btn.textContent = '📄 Download PDF';
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}