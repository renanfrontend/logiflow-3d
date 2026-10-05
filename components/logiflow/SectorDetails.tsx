import { Activity, Box, Truck } from 'lucide-react';
import type { FlowMetrics } from '@/lib/logiflow/domain/capacity';
import { SCENARIOS, SHIPMENTS, findWarehouse } from '@/lib/logiflow/domain/fixtures';
import { stockFor } from '@/lib/logiflow/domain/inventory';
import type { ShipmentProgress } from '@/lib/logiflow/domain/shipment';
import type { Scenario, SectorId } from '@/lib/logiflow/domain/types';
import { formatInteger } from '@/lib/logiflow/presentation/notice';

interface SectorDetailsProps {
  readonly sector: SectorId;
  readonly scenario: Scenario;
  readonly progress: ShipmentProgress;
  readonly metrics: FlowMetrics;
}

export function SectorDetails({ sector, scenario, progress, metrics }: SectorDetailsProps) {
  const warehouse = findWarehouse(sector);
  const stock = stockFor(sector, progress);
  const ratio = stock / warehouse.capacity;
  const blockedDock = SCENARIOS[scenario].blockedDock;
  const activeDocks = warehouse.docks - (blockedDock?.sector === sector ? 1 : 0);
  const sectorShipments = SHIPMENTS.filter((shipment) => shipment.sector === sector);

  return (
    <aside className="details" aria-label={`Detalhes do setor ${warehouse.id}`}>
      <div className="detail-top">
        <span className="sector-icon" style={{ color: warehouse.color }} aria-hidden="true">
          <Box size={24} />
        </span>
        <span className="tag">SETOR {warehouse.id}</span>
      </div>
      <h2>{warehouse.name}</h2>
      <p>{warehouse.subtitle}</p>
      <div className="detail-separator" />
      <div className="row">
        <span id="occupancy-label">Ocupação do armazém</span>
        <b>{Math.round(ratio * 100)}%</b>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-labelledby="occupancy-label"
        aria-valuemin={0}
        aria-valuemax={warehouse.capacity}
        aria-valuenow={stock}
      >
        <span style={{ width: `${ratio * 100}%`, background: warehouse.color }} />
      </div>
      <div className="row secondary">
        <span>{formatInteger(stock)} pallets</span>
        <span>{formatInteger(warehouse.capacity)} disponíveis no total</span>
      </div>
      <div className="detail-stats">
        <div>
          <span>Docas ativas</span>
          <strong>
            {activeDocks} / {warehouse.docks}
          </strong>
        </div>
        <div>
          <span>Turno</span>
          <strong>Diurno</strong>
        </div>
      </div>
      <div className="insight">
        <Activity size={19} aria-hidden="true" />
        <div>
          <b>{metrics.queue ? 'Atenção ao fluxo' : 'Operação equilibrada'}</b>
          <p>
            {metrics.queue
              ? 'A demanda supera a capacidade. Use o laboratório para comparar uma alternativa.'
              : 'A capacidade de processamento atende à demanda do cenário atual.'}
          </p>
        </div>
      </div>
      <span className="tiny">PRÓXIMA CARGA DO SETOR</span>
      {sectorShipments.map((shipment) => (
        <div className="next-load" key={shipment.id}>
          <Truck size={21} aria-hidden="true" />
          <div>
            <b>{shipment.id}</b>
            <span>{shipment.destination}</span>
          </div>
          <span>{shipment.pallets} plt</span>
        </div>
      ))}
    </aside>
  );
}
