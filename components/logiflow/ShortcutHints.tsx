const HINTS = [
  { keys: ['1', '2', '3'], label: 'setores' },
  { keys: ['Espaço'], label: 'pausar' },
  { keys: ['R'], label: 'câmera' },
  { keys: ['H'], label: 'ocupação' },
  { keys: ['I'], label: 'interior' },
] as const;

/** Aceleradores para usuários recorrentes (heurística 7 de Nielsen), discretos para não poluir. */
export function ShortcutHints() {
  return (
    <p className="shortcut-hints">
      <span className="sr-only">Atalhos de teclado:</span>
      {HINTS.map(({ keys, label }) => (
        <span key={label}>
          {keys.map((key) => (
            <kbd key={key}>{key}</kbd>
          ))}{' '}
          {label}
        </span>
      ))}
    </p>
  );
}
