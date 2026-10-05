import { Check, Navigation, Package, Truck } from 'lucide-react';
import { SHIPMENTS } from '@/lib/logiflow/domain/fixtures';
import {
  DELIVERED_STAGE,
  IN_TRANSIT_STAGE,
  SHIPMENT_STAGES,
  findShipment,
  isShipmentId,
  stageOf,
  type AdvanceResult,
  type ShipmentProgress,
} from '@/lib/logiflow/domain/shipment';
import type { ShipmentId } from '@/lib/logiflow/domain/types';

interface TrackingProps {
  readonly shipmentId: ShipmentId;
  readonly progress: ShipmentProgress;
  readonly advance: AdvanceResult;
  readonly onSelect: (id: ShipmentId) => void;
  readonly onAdvance: () => void;
}

const ACTION_LABEL: Record<Exclude<AdvanceResult, { ok: true }>['reason'], string> = {
  delivered: 'Entrega concluída',
  'dock-blocked': 'Doca indisponível',
};

export function Tracking({ shipmentId, progress, advance, onSelect, onAdvance }: TrackingProps) {
  const shipment = findShipment(shipmentId);
  const stage = stageOf(progress, shipmentId);

  return (
    <section className="tracking" aria-labelledby="tracking-title">
      <div className="tracking-info">
        <span className="tracking-icon" aria-hidden="true">
          <Navigation size={21} />
        </span>
        <div>
          <span className="tiny">ACOMPANHAMENTO DE CARGA</span>
          <h2 id="tracking-title">{shipment.destination}</h2>
          <label className="sr-only" htmlFor="shipment-select">
            Selecionar carga
          </label>
          <select
            id="shipment-select"
            value={shipmentId}
            onChange={(event) => {
              const next = event.target.value;
              if (isShipmentId(next)) onSelect(next);
            }}
          >
            {SHIPMENTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ol className="timeline" aria-label={`Etapas da carga ${shipmentId}`}>
        {SHIPMENT_STAGES.map((name, index) => (
          <li key={name} className={index <= stage ? 'reached' : ''} aria-current={index === stage ? 'step' : undefined}>
            <span aria-hidden="true">{index < stage ? <Check size={15} /> : index === IN_TRANSIT_STAGE ? <Truck size={15} /> : <Package size={14} />}</span>
            <b>{name}</b>
          </li>
        ))}
      </ol>

      <div className="tracking-action">
        <span>
          {shipment.pallets} pallets · Setor {shipment.sector}
        </span>
        <button type="button" className="primary" onClick={onAdvance} disabled={!advance.ok}>
          {advance.ok ? 'Avançar etapa' : ACTION_LABEL[advance.reason]}
        </button>
        {stage === DELIVERED_STAGE && <span className="sr-only">Carga entregue.</span>}
      </div>
    </section>
  );
}
