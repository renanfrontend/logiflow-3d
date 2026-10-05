import { ArrowUpRight } from 'lucide-react';

export function PageFooter() {
  return (
    <footer>
      LogiFlow 3D <span>Concebido por Renan Augusto · React Three Fiber + Three.js + TypeScript</span>
      <a href="https://github.com/renanfrontend" target="_blank" rel="noreferrer">
        Conheça o desenvolvedor <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </footer>
  );
}
