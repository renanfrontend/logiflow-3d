import { Forklift, Truck, X } from 'lucide-react';
import type { FleetAsset } from '@/lib/logiflow/domain/types';

interface AssetPanelProps {
  readonly asset: FleetAsset;
  readonly running: boolean;
  readonly onClose: () => void;
}

/**
 * Card flutuante sobre a cena: o detalhe aparece junto do objeto selecionado,
 * sem empurrar o painel do setor nem redimensionar o canvas.
 */
export function AssetPanel({ asset, running, onClose }: AssetPanelProps) {
  const isTruck = asset.kind === 'truck';
  const Icon = isTruck ? Truck : Forklift;

  return (
    <div className="asset-panel" role="region" aria-label={`Detalhes do ativo ${asset.id}`} aria-live="polite">
      <div className="asset-panel-head">
        <span className="asset-panel-icon" aria-hidden="true">
          <Icon size={18} />
        </span>
        <div>
          <span className="tiny">ATIVO SELECIONADO</span>
          <h3>{asset.id}</h3>
        </div>
        <button type="button" onClick={onClose} aria-label="Fechar detalhes do ativo" aria-keyshortcuts="Escape">
          <X size={16} aria-hidden="true" />
        </button>
      </div>
      <p>{isTruck ? 'Caminhão de transferência' : 'Empilhadeira elétrica'}</p>
      <dl className="asset-panel-values">
        <div>
          <dt>Estado</dt>
          <dd>{running ? 'Em movimento' : 'Pausado'}</dd>
        </div>
        <div>
          <dt>{isTruck ? 'Capacidade' : 'Bateria simulada'}</dt>
          <dd>{isTruck ? `${asset.capacityPallets} pallets` : `${asset.batteryPercent}%`}</dd>
        </div>
      </dl>
      <small>Posição ilustrativa · sem telemetria real</small>
    </div>
  );
}
