import type { Notice } from '../application/operation.ts';
import { SCENARIOS } from '../domain/fixtures.ts';
import { SHIPMENT_STAGES } from '../domain/shipment.ts';

/** Converte eventos de domínio em mensagens de interface (pt-BR). */
export function formatNotice(notice: Notice): string {
  switch (notice.kind) {
    case 'welcome':
      return 'Selecione um setor no mapa para explorar a operação.';
    case 'tracking':
      return `Acompanhando ${notice.shipment}. Use “Avançar etapa” no acompanhamento da carga.`;
    case 'stage-advanced': {
      const suffix = notice.leftWarehouse ? ' Estoque atualizado após a saída.' : '';
      return `${notice.shipment}: ${SHIPMENT_STAGES[notice.stage]}.${suffix}`;
    }
    case 'dock-blocked':
      return 'Doca C bloqueada. Aplique o balanceamento para liberar a rota alternativa.';
    case 'scenario-changed': {
      const { id, demand } = SCENARIOS[notice.scenario];
      if (id === 'normal') return 'Operação normal restaurada.';
      if (id === 'peak') return `Demanda elevada: ${demand} pallets/h. Teste o balanceamento.`;
      return 'Doca indisponível: capacidade reduzida. Teste uma rota alternativa.';
    }
    case 'balanced': {
      const assumption = SCENARIOS[notice.scenario].balancingAssumption;
      return `Balanceamento aplicado. Premissa: ${assumption}.`;
    }
    case 'reset':
      return 'Simulação reiniciada: estoque, cargas e cenário voltaram ao estado inicial.';
    default: {
      const exhaustive: never = notice;
      return exhaustive;
    }
  }
}

const integer = new Intl.NumberFormat('pt-BR');
const percent = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const formatInteger = (value: number): string => integer.format(value);

export const formatPercent = (ratio: number): string => `${percent.format(ratio * 100)}%`;

/** "+36", "−24", "0" — usa o sinal tipográfico de menos. */
export const formatSigned = (value: number): string =>
  value > 0 ? `+${integer.format(value)}` : value < 0 ? `−${integer.format(Math.abs(value))}` : '0';
