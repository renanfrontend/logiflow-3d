import { ChevronRight, Package } from 'lucide-react';
import { SHIPMENTS, findWarehouse } from '@/lib/logiflow/domain/fixtures';
import { SHIPMENT_STAGES, hasLeftWarehouse, stageOf, type ShipmentProgress } from '@/lib/logiflow/domain/shipment';
import type { ShipmentId } from '@/lib/logiflow/domain/types';

interface ShipmentsTableProps {
  readonly progress: ShipmentProgress;
  readonly tracked: ShipmentId;
  readonly onTrack: (id: ShipmentId) => void;
}

export function ShipmentsTable({ progress, tracked, onTrack }: ShipmentsTableProps) {
  return (
    <section className="shipments" aria-labelledby="shipments-title">
      <div className="section-heading">
        <h2 id="shipments-title">
          Expedições do turno <span>{String(SHIPMENTS.length).padStart(2, '0')}</span>
        </h2>
        <span>Dados fictícios · ações nesta sessão</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Carga</th>
              <th scope="col">Destino</th>
              <th scope="col">Setor</th>
              <th scope="col">Volume</th>
              <th scope="col">Status</th>
              <th scope="col">
                <span className="sr-only">Ação</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {SHIPMENTS.map((shipment) => (
              <tr key={shipment.id} aria-current={tracked === shipment.id ? 'true' : undefined}>
                <th scope="row">
                  <span className="load-id">
                    <Package size={17} aria-hidden="true" />
                    {shipment.id}
                  </span>
                </th>
                <td>{shipment.destination}</td>
                <td>
                  {shipment.sector} · {findWarehouse(shipment.sector).name}
                </td>
                <td>{shipment.pallets} pallets</td>
                <td>
                  <span className={`shipment-status ${hasLeftWarehouse(progress, shipment.id) ? 'done' : ''}`}>
                    {SHIPMENT_STAGES[stageOf(progress, shipment.id)]}
                  </span>
                </td>
                <td>
                  <button type="button" className="dispatch" onClick={() => onTrack(shipment.id)} aria-label={`Acompanhar carga ${shipment.id}`}>
                    Acompanhar <ChevronRight size={15} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
