import { useEffect, useRef } from 'react';

export type ShortcutMap = Readonly<Record<string, () => void>>;

const EDITABLE = 'input, textarea, select, [contenteditable="true"]';

/**
 * Atalhos globais sem modificadores. Ignora campos editáveis e
 * mantém o listener estável via ref (sem re-registrar a cada render).
 */
export function useKeyboardShortcuts(shortcuts: ShortcutMap, enabled = true): void {
  const latest = useRef(shortcuts);

  useEffect(() => {
    latest.current = shortcuts;
  });

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target instanceof Element && target.closest(EDITABLE)) return;

      const key = event.key === ' ' ? 'Space' : event.key.toLowerCase();
      // Espaço em botões focados deve continuar acionando o próprio botão.
      if (key === 'Space' && target instanceof HTMLButtonElement) return;

      const handler = latest.current[key];
      if (!handler) return;
      event.preventDefault();
      handler();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled]);
}
