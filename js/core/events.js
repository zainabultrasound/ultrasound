// ============================================================
// CENTRAL EVENT DELEGATION SYSTEM
// ============================================================

const listeners = new Map();

export function on(parent, eventType, selector, handler) {
  const key = `${eventType}:${selector}`;
  if (listeners.has(key)) return;

  const wrapper = (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) {
      handler(e, target);
    }
  };

  listeners.set(key, { parent, eventType, wrapper, handler });
  parent.addEventListener(eventType, wrapper);
}

export function off(parent, eventType, selector) {
  const key = `${eventType}:${selector}`;
  const entry = listeners.get(key);
  if (entry) {
    entry.parent.removeEventListener(entry.eventType, entry.wrapper);
    listeners.delete(key);
  }
}

export function clearAll(parent) {
  for (const [key, entry] of listeners) {
    if (entry.parent === parent) {
      entry.parent.removeEventListener(entry.eventType, entry.wrapper);
      listeners.delete(key);
    }
  }
}

export function emit(target, name, detail = {}) {
  target.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
}

export function onCustom(target, name, handler) {
  target.addEventListener(name, handler);
}