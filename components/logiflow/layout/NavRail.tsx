import { Activity, Boxes, Truck } from 'lucide-react';

/** Navegação decorativa da demo — sem destinos reais, por isso fora da árvore de acessibilidade. */
export function NavRail() {
  return (
    <aside className="rail" aria-hidden="true">
      <span className="rail-active">
        <Boxes size={23} />
      </span>
      <span title="Operação logística">
        <Truck size={22} />
      </span>
      <span title="Métricas da simulação">
        <Activity size={22} />
      </span>
      <div className="rail-bottom">LF</div>
    </aside>
  );
}
