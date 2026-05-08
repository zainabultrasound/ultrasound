// ============================================================
// VOICE TYPING SERVICE (Web Speech API – free, browser-based)
// Supports Chrome & Edge.  Appends transcript to existing text.
// ============================================================

import { getState, setState, updateFieldValue } from '../core/state.js';

console.log('[Voice] Service loaded');

const MEDICAL_CORRECTIONS = {
  'hydro nephrosis': 'hydronephrosis',
  'hydro ureter': 'hydroureter',
  'echo texture': 'echotexture',
  'cortico medullary': 'corticomedullary',
  'cortico medullary demarcation': 'corticomedullary demarcation',
  'pelvi calyceal': 'pelvicalyceal',
  'sub chorionic': 'subchorionic',
  'cardio mega ly': 'cardiomegaly',
  'oligo hydro amnios': 'oligohydramnios',
  'poly hydro amnios': 'polyhydramnios',
  'endo metrial': 'endometrial',
  'myo metrial': 'myometrial',
  'gestational sack': 'gestational sac',
  'yolk sack': 'yolk sac',
  'fetal poll': 'fetal pole',
  'crown rump': 'crown-rump',
  'bi parietal': 'biparietal',
  'bpd': 'BPD',
  'hc': 'HC',
  'ac': 'AC',
  'fl': 'FL',
  'amniotic fluid index': 'amniotic fluid index',
  'resistive index': 'resistive index',
  'pulsatility index': 'pulsatility index',
  'cerebro placental': 'cerebroplacental',
  'ductus venosus': 'ductus venosus',
  'try cuspid': 'tricuspid',
  'trycuspid': 'tricuspid',
  'anterior': 'anterior',
  'posterior': 'posterior',
  'fundal': 'fundal',
  'low lying': 'low-lying',
  'polycystic': 'polycystic',
  'adeno myosis': 'adenomyosis',
  'fibroid': 'fibroid',
  'free fluid': 'free fluid',
  'ascites': 'ascites',
  'calcification': 'calcification',
  'calcifications': 'calcifications',
  'micro calcifications': 'microcalcifications',
  'macro calcifications': 'macrocalcifications',
  'hypoechoic': 'hypoechoic',
  'hyperechoic': 'hyperechoic',
  'anechoic': 'anechoic',
  'isoechoic': 'isoechoic',
  'heterogeneous': 'heterogeneous',
  'homogeneous': 'homogeneous',
  'echogenic': 'echogenic',
  'echogenicity': 'echogenicity',
  'spiculated': 'spiculated',
  'lobulated': 'lobulated',
  'well defined': 'well-defined',
  'ill defined': 'ill-defined',
  'bi rads': 'BIRADS',
  'by rads': 'BIRADS',
  'ti rads': 'TIRADS',
  'ty rads': 'TIRADS',
  'fibro glandular': 'fibroglandular',
  'axillary': 'axillary',
  'supraclavicular': 'supraclavicular',
  'cervical': 'cervical',
  'inguinal': 'inguinal',
  'femoral': 'femoral',
  'para aortic': 'para-aortic',
  'peri pancreatic': 'peripancreatic',
  'retro peritoneum': 'retroperitoneum',
  'retro peritoneal': 'retroperitoneal',
  'intra peritoneal': 'intraperitoneal',
  'sub capsular': 'subcapsular',
  'peri nephric': 'perinephric',
  'peri renal': 'perirenal',
  'intra renal': 'intrarenal',
  'extra renal': 'extrarenal',
  'endo pelvic': 'endopelvic',
  'trans vaginal': 'transvaginal',
  'trans rectal': 'transrectal',
  'trans abdominal': 'transabdominal',
};

let recognition = null;
let activeField = null;
let isListening = false;
let manualStop = false;
let restartTimer = null;

export function isSpeechSupported() {
  const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  console.log('[Voice] Speech recognition supported:', supported);
  return supported;
}

export function getVoiceLanguage() {
  return getState().voiceLanguage || 'en-US';
}

export function setVoiceLanguage(lang) {
  setState({ voiceLanguage: lang });
  if (isListening && recognition) {
    const field = activeField;
    stopListening();
    if (field) setTimeout(() => startListening(field), 200);
  }
}

export function startListening(fieldElement) {
  console.log('[Voice] startListening called with', fieldElement?.id, fieldElement?.tagName);

  if (!isSpeechSupported()) {
    alert('Speech recognition is not supported in your browser.\nPlease use Google Chrome or Microsoft Edge.');
    return;
  }

  if (isListening) {
    stopListening();
    setTimeout(() => startListening(fieldElement), 150);
    return;
  }

  activeField = fieldElement;
  isListening = true;
  manualStop = false;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = getVoiceLanguage();
  recognition.maxAlternatives = 1;

  recognition.onresult = handleResult;
  recognition.onerror = handleError;
  recognition.onend = handleEnd;

  try {
    recognition.start();
    console.log('[Voice] recognition started');
    updateAllButtonStates();
  } catch (err) {
    console.warn('[Voice] start error:', err);
    isListening = false;
    activeField = null;
    recognition = null;
    updateAllButtonStates();
  }
}

export function stopListening() {
  manualStop = true;
  if (restartTimer) {
    clearTimeout(restartTimer);
    restartTimer = null;
  }
  if (recognition) {
    try { recognition.abort(); } catch (e) {}
    recognition = null;
  }
  isListening = false;
  activeField = null;
  updateAllButtonStates();
}

export function toggleListening(fieldElement) {
  console.log('[Voice] toggleListening', isListening, activeField === fieldElement);
  if (isListening && activeField === fieldElement) {
    stopListening();
  } else {
    startListening(fieldElement);
  }
}

export function destroyVoice() {
  stopListening();
  recognition = null;
  activeField = null;
  isListening = false;
  manualStop = true;
}

export function initVoiceLanguageSelector() {
  const select = document.getElementById('voice-language-select');
  if (!select) return;
  select.value = getVoiceLanguage();
  select.addEventListener('change', () => setVoiceLanguage(select.value));
  document.addEventListener('state:change', (e) => {
    if (e.detail.key === 'voiceLanguage' && select.value !== e.detail.newValue) {
      select.value = e.detail.newValue;
    }
  });
}

function handleResult(event) {
  if (!activeField) return;
  let transcript = '';
  for (let i = event.resultIndex; i < event.results.length; i++) {
    if (event.results[i].isFinal) {
      transcript += event.results[i][0].transcript;
    }
  }
  if (!transcript.trim()) return;

  let corrected = applyCorrections(transcript);
  const existingValue = activeField.value;
  const needsSpace = existingValue && !existingValue.endsWith(' ') && !existingValue.endsWith('\n');
  const separator = needsSpace ? ' ' : '';
  const newValue = existingValue + separator + corrected;
  console.log('[Voice] Appending:', corrected, '=> New value:', newValue.substring(0, 80));

  activeField.value = newValue;

  const sectionId = activeField.dataset.section;
  const fieldId = activeField.dataset.field;
  const indexStr = activeField.dataset.index;
  const index = (indexStr !== '' && indexStr !== undefined && indexStr !== null)
    ? parseInt(indexStr)
    : null;

  if (sectionId && fieldId) {
    // For dynamic form fields with section/field/index
    updateFieldValue(sectionId, fieldId, newValue, index);
  } else if (fieldId) {
    // For patient/impression fields (no sectionId)
    // dispatch event to update state through existing component logic
    console.log('[Voice] Field without section, dispatching input event');
    activeField.dispatchEvent(new Event('input', { bubbles: true }));
    activeField.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    console.warn('[Voice] Active field missing data-field attribute');
  }

  activeField.dispatchEvent(new Event('input', { bubbles: true }));
  activeField.dispatchEvent(new Event('change', { bubbles: true }));
}

function applyCorrections(text) {
  let corrected = text;
  for (const [wrong, right] of Object.entries(MEDICAL_CORRECTIONS)) {
    const escaped = wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('\\b' + escaped + '\\b', 'gi');
    corrected = corrected.replace(regex, right);
  }
  return corrected;
}

function handleError(event) {
  console.warn('[Voice] error:', event.error, event.message);
  if (event.error === 'not-allowed') {
    alert('Microphone access was denied.\nPlease allow microphone access in your browser settings and try again.');
    stopListening();
  } else if (event.error === 'no-speech') {
    // silent
  } else if (event.error === 'audio-capture') {
    alert('No microphone detected. Please connect a microphone and try again.');
    stopListening();
  } else if (event.error === 'network') {
    // transient
  } else if (event.error === 'aborted') {
    // ok
  } else {
    stopListening();
  }
}

function handleEnd() {
  if (manualStop) {
    isListening = false;
    activeField = null;
    recognition = null;
    updateAllButtonStates();
    return;
  }
  if (isListening && activeField && !manualStop) {
    restartTimer = setTimeout(() => {
      if (isListening && activeField && !manualStop) {
        try {
          if (recognition) recognition.start();
          else startListening(activeField);
        } catch (e) {
          console.warn('[Voice] auto-restart failed:', e);
          isListening = false;
          activeField = null;
          recognition = null;
          updateAllButtonStates();
        }
      }
    }, 300);
  } else {
    isListening = false;
    activeField = null;
    recognition = null;
    updateAllButtonStates();
  }
}

function updateAllButtonStates() {
  document.querySelectorAll('.voice-btn').forEach((btn) => {
    const targetId = btn.dataset.voiceTarget;
    const field = targetId ? document.getElementById(targetId) : null;
    const isActive = isListening && field === activeField;
    btn.classList.toggle('listening', isActive);
    btn.textContent = isActive ? '🔴' : '🎤';
    btn.title = isActive ? 'Stop dictation' : 'Click to dictate';
  });
}