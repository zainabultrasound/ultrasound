// ============================================================
// print.js – VECTOR PDF via pdfmake (Compact & Robust)
// ============================================================

import { getState, setState } from './core/state.js';
import CONFIG from './core/config.js';
import { uploadPDF, getPDFPublicUrl, updateReport } from './services/supabase.js';
import { isAppOnline } from './services/sync.js';

let isGenerating = false;

/**
 * Standard browser print (uses print.css)
 */
export function printReport() {
  window.print();
}

/**
 * Generate a vector PDF of the current report.
 * - Always downloads locally.
 * - Uploads only if report has no existing pdf_url.
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

  try {
    const state = getState();
    if (!state.reportType) {
      alert('Please load a scan type first.');
      return;
    }

    // 1. Build pdfmake document definition directly from state
    const docDefinition = buildPDFDefinition(state);

    // 2. Generate blob using pdfmake (global window.pdfMake)
    const pdfMake = window.pdfMake;
    if (!pdfMake) {
      throw new Error('pdfmake library not loaded. Check CDN scripts.');
    }

    let pdfBlob;
    try {
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfBlob = await new Promise((resolve, reject) => {
        pdfDocGenerator.getBlob((blob) => {
          if (blob && blob.size > 0) resolve(blob);
          else reject(new Error('pdfmake produced empty blob'));
        });
      });
    } catch (err) {
      // Log the definition to help debugging
      console.error('PDF generation failed. Document definition:', JSON.stringify(docDefinition, null, 2));
      throw err;
    }

    // 3. Build filename and download
    const filename = buildFilename(state);
    downloadBlob(pdfBlob, filename);

    // 4. Cloud upload only if online, report exists, and no existing cloud PDF
    if (isAppOnline() && state.reportId && !state.pdf_url) {
      try {
        const uploadPath = `${state.patientInfo.patient_code || 'unknown'}/${filename}`;
        await uploadPDF(uploadPath, pdfBlob);
        const publicUrl = getPDFPublicUrl(uploadPath);
        await updateReport(state.reportId, { pdf_url: publicUrl });
        setState({ pdf_url: publicUrl });
        alert('PDF saved locally and uploaded to cloud.');
      } catch (uploadErr) {
        console.error('Cloud upload failed:', uploadErr);
        alert('PDF saved locally, but cloud upload failed.');
      }
    } else {
      alert('PDF downloaded.');
    }
  } catch (err) {
    alert('PDF generation failed: ' + err.message);
    console.error(err);
  } finally {
    resetGenerationState(btn);
  }
}

// ---------- Build pdfmake document definition ----------

function buildPDFDefinition(state) {
  const { patientInfo: p, currentTemplate: tpl, values, impression, additionalNotes, reportNumber, createdAt, scanTypeTitle, reportStatus } = state;

  const esc = (str) => (str == null) ? '' : String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // ------------- Compact Professional Styles -------------
  const styles = {
    header: { fontSize: 14, bold: true, alignment: 'center', margin: [0, 0, 0, 2] },
    subheader: { fontSize: 10, alignment: 'center', margin: [0, 0, 0, 4], color: '#555' },
    sectionTitle: { fontSize: 11, bold: true, margin: [0, 8, 0, 3], decoration: 'underline' },
    tableHeader: { bold: true, fillColor: '#eeeeee' },
    fieldLabel: { bold: true, fontSize: 9 },
    fieldValue: { fontSize: 9 },
  };

  const content = [];

  // ---- Header ----
  content.push({ text: CONFIG.clinicName, style: 'header' });
  content.push({ text: `${CONFIG.clinicAddress} | Phone: ${CONFIG.clinicPhone}`, style: 'subheader' });
  content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2 }], margin: [0, 4, 0, 4] });

  // ---- Report Metadata ----
  content.push({
    table: {
      widths: ['*', '*'],
      body: [
        [
          { text: `Report #: ${esc(reportNumber || '—')}`, style: 'fieldLabel' },
          { text: `Date: ${createdAt ? new Date(createdAt).toLocaleDateString() : new Date().toLocaleDateString()}`, style: 'fieldLabel' }
        ],
        [
          { text: `Scan Type: ${esc(scanTypeTitle || '—')}`, style: 'fieldLabel' },
          { text: `Status: ${reportStatus === 'final' ? 'Final' : 'Draft'}`, style: 'fieldLabel' }
        ]
      ]
    },
    layout: 'noBorders',
    margin: [0, 4, 0, 4]
  });

  // ---- Patient Information ----
  content.push({ text: 'Patient Information', style: 'sectionTitle' });

  const patientRows = [
    ['Patient ID', p.patient_code, 'Name', p.name],
    ['Age', p.age, 'Gender', p.gender],
    ['Phone', p.phone, 'Referred By', p.referred_by],
    ['Referring Clinic', p.referring_clinic, '', '']
  ];
  if (p.lmp) patientRows.push(['LMP', p.lmp, 'Gestational Age', p.gestational_age || '']);
  if (p.clinical_history) patientRows.push(['Clinical History', { text: p.clinical_history, colSpan: 3 }, '', '']);

  // Defensive: ensure body is always a 2D array
  const safeBody = patientRows
    .filter(row => Array.isArray(row) && row.length > 0)
    .map(row => row.map(cell => (typeof cell === 'string' ? { text: esc(cell), style: 'fieldValue' } : { ...cell, style: 'fieldValue' })));

  content.push({
    table: {
      widths: ['auto', '*', 'auto', '*'],
      body: safeBody
    },
    layout: 'lightHorizontalLines',
    margin: [0, 0, 0, 4]
  });

  // ---- Template Sections ----
  if (tpl && tpl.sections) {
    tpl.sections.forEach(section => {
      content.push({ text: section.title, style: 'sectionTitle' });

      if (section.repeatable) {
        const items = values[section.id] || [{}];
        items.forEach((item, idx) => {
          content.push({ text: `${section.groupLabel || 'Item'} ${idx + 1}`, italics: true, margin: [0, 4, 0, 2] });
          const rows = [];
          section.fields.forEach(field => {
            if (isFieldHidden(field, item, values, p)) return;
            rows.push([
              { text: `${field.label}${field.required ? ' *' : ''}`, style: 'fieldLabel' },
              { text: formatFieldValue(field, item[field.id]), style: 'fieldValue' }
            ]);
          });
          if (rows.length > 0) {
            content.push({
              table: { widths: ['auto', '*'], body: rows },
              layout: 'noBorders',
              margin: [0, 0, 0, 4]
            });
          }
        });
      } else {
        const rows = [];
        section.fields.forEach(field => {
          if (isFieldHidden(field, values[section.id] || {}, values, p)) return;
          const val = (values[section.id] || {})[field.id] ?? '';
          rows.push([
            { text: `${field.label}${field.required ? ' *' : ''}`, style: 'fieldLabel' },
            { text: formatFieldValue(field, val), style: 'fieldValue' }
          ]);
        });
        if (rows.length > 0) {
          content.push({
            table: { widths: ['auto', '*'], body: rows },
            layout: 'noBorders',
            margin: [0, 0, 0, 4]
          });
        }
      }
    });
  }

  // ---- Impression & Notes ----
  content.push({ text: 'Impression & Notes', style: 'sectionTitle' });
  content.push({ text: [{ text: 'Impression: ', bold: true }, esc(impression || '—')], margin: [0, 2, 0, 2] });
  if (additionalNotes) {
    content.push({ text: [{ text: 'Additional Notes: ', bold: true }, esc(additionalNotes)], margin: [0, 0, 0, 4] });
  }

  // ---- Signature Area ----
  content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }], margin: [0, 12, 0, 0] });
  content.push({
    table: {
      widths: ['*', 'auto'],
      body: [
        [{ text: `Reporting Doctor: ${CONFIG.doctorName}`, style: 'fieldLabel' }, { text: '________________________', alignment: 'right' }],
        [{ text: `Qualification: ${CONFIG.doctorQualification}`, style: 'fieldLabel' }, { text: "Doctor's Signature / Stamp", fontSize: 8, alignment: 'right' }],
        [{ text: `Registration: ${CONFIG.doctorRegistration}`, style: 'fieldLabel' }, '']
      ]
    },
    layout: 'noBorders',
    margin: [0, 4, 0, 0]
  });

  return {
    content,
    styles,
    defaultStyle: { font: 'Roboto', fontSize: 10, lineHeight: 1.2 },
    pageSize: 'A4',
    pageMargins: [28, 28, 28, 28],
    info: {
      title: buildFilename(state),
      author: CONFIG.clinicName,
    }
  };
}

// Helper: format a field value for display
function formatFieldValue(field, value) {
  if (value == null || value === '') return '—';
  if (field.type === 'checkbox') return value === true || value === 'true' ? '✓' : '✗';
  if (field.type === 'measurement') return field.unit ? `${value} ${field.unit}` : String(value);
  if (field.type === 'textarea') return value; // keep line breaks
  return String(value);
}

// Helper: conditional field visibility
function isFieldHidden(field, itemValues, allValues, patientInfo) {
  if (!field.showIf) return false;
  const dependField = field.showIf.field;
  let dependValue = itemValues?.[dependField] ?? allValues?.[dependField] ?? patientInfo[dependField] ?? '';
  return String(dependValue) !== String(field.showIf.equals);
}

// ---------- Filename & download helpers ----------

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