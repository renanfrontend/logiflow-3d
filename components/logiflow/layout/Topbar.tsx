import Link from 'next/link';
import { Boxes, Code2, FlaskConical, MapPin } from 'lucide-react';

export function Topbar() {
  return (
    <header className="topbar">
      <Link href="/" className="brand" aria-label="LogiFlow 3D — início">
        <span aria-hidden="true">
          <Boxes size={25} />
        </span>
        LogiFlow <b>3D</b>
      </Link>
      <div className="location">
        <MapPin size={16} aria-hidden="true" /> Centro de distribuição · Guarulhos <span>SP</span>
      </div>
      <div className="demo">
        <FlaskConical size={15} aria-hidden="true" /> Ambiente demonstrativo
      </div>
      <a className="author" href="https://github.com/renanfrontend" target="_blank" rel="noreferrer" aria-label="GitHub de Renan Augusto (abre em nova aba)">
        <Code2 size={18} aria-hidden="true" /> <span>Renan Augusto</span>
      </a>
    </header>
  );
}
