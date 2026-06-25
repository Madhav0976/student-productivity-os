import { useEffect } from "react";

type KeyCombo = string; // e.g., "ctrl+k", "q", "escape"

function parseCombo(combo: KeyCombo) {
  const parts = combo.toLowerCase().split("+");
  return {
    ctrl: parts.includes("ctrl"),
    shift: parts.includes("shift"),
    alt: parts.includes("alt"),
    meta: parts.includes("meta"),
    key: parts[parts.length - 1],
  };
}

export function useKeyboardShortcut(
  combo: KeyCombo | KeyCombo[],
  callback: (e: KeyboardEvent) => void,
  options: { preventDefault?: boolean; enabled?: boolean } = {}
) {
  const { preventDefault = true, enabled = true } = options;
  const combos = Array.isArray(combo) ? combo : [combo];

  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      for (const c of combos) {
        const parsed = parseCombo(c);
        const keyMatch = e.key.toLowerCase() === parsed.key;
        const ctrlMatch = parsed.ctrl === (e.ctrlKey || e.metaKey);
        const shiftMatch = parsed.shift === e.shiftKey;
        const altMatch = parsed.alt === e.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          // For single-key shortcuts, don't trigger in inputs
          if (!parsed.ctrl && !parsed.shift && !parsed.alt && isInput) return;
          if (preventDefault) e.preventDefault();
          callback(e);
          return;
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [combos.join(","), callback, enabled, preventDefault]);
}
