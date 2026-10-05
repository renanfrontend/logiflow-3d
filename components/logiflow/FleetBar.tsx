import { Forklift as ForkliftIcon, Truck } from 'lucide-react';
import { FLEET } from '@/lib/logiflow/domain/fixtures';
import type { FleetAssetId } from '@/lib/logiflow/domain/types';

interface FleetBarProps {
  readonly selected: FleetAssetId | null;
  readonly onSelect: (id: FleetAssetId) => void;
}

const trucks = FLEET.filter((asset) => asset.kind === 'truck').length;
const forklifts = FLEET.length - trucks;

export function FleetBar({ selected, onSelect }: FleetBarProps) {
  return (
    <div className="fleet-bar" role="group" aria-label="Ativos no pátio">
      <b>Ativos no pátio</b>
      {FLEET.map((asset) => {
        const Icon = asset.kind === 'truck' ? Truck : ForkliftIcon;
        const active = selected === asset.id;
        return (
          <button type="button" key={asset.id} aria-pressed={active} className={active ? 'active' : ''} onClick={() => onSelect(asset.id)}>
            <Icon size={15} aria-hidden="true" />
            {asset.id}
          </button>
        );
      })}
      <span>
        {trucks} caminhões · {forklifts} empilhadeiras
      </span>
    </div>
  );
}
