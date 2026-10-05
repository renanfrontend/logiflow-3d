import { SCENARIOS, SHIPMENTS } from './fixtures.ts';
import type { Scenario, Shipment, ShipmentId } from './types.ts';

export const SHIPMENT_STAGES = ['Confirmada', 'Separação', 'Carregamento', 'Em trânsito', 'Entregue'] as const;

export type ShipmentStage = (typeof SHIPMENT_STAGES)[number];

/** Índice da etapa (0 = Confirmada … 4 = Entregue). */
export type StageIndex = 0 | 1 | 2 | 3 | 4;

export type ShipmentProgress = Readonly<Partial<Record<ShipmentId, StageIndex>>>;

export const LOADING_STAGE: StageIndex = 2;
export const IN_TRANSIT_STAGE: StageIndex = 3;
export const DELIVERED_STAGE: StageIndex = 4;

export function stageOf(progress: ShipmentProgress, id: ShipmentId): StageIndex {
  return progress[id] ?? 0;
}

/** O volume sai do estoque uma única vez, na transição para "Em trânsito". */
export function hasLeftWarehouse(progress: ShipmentProgress, id: ShipmentId): boolean {
  return stageOf(progress, id) >= IN_TRANSIT_STAGE;
}

export function findShipment(id: ShipmentId): Shipment {
  const shipment = SHIPMENTS.find((item) => item.id === id);
  if (!shipment) throw new RangeError(`Carga desconhecida: ${id}`);
  return shipment;
}

export function isShipmentId(value: unknown): value is ShipmentId {
  return SHIPMENTS.some((item) => item.id === value);
}

export interface AdvanceContext {
  readonly progress: ShipmentProgress;
  readonly scenario: Scenario;
  readonly balanced: boolean;
}

export type AdvanceResult =
  | { readonly ok: true; readonly next: StageIndex; readonly leftWarehouse: boolean }
  | { readonly ok: false; readonly reason: 'delivered' | 'dock-blocked' };

/** Regra única para avançar etapa — usada pelo reducer e pela UI (botão desabilitado). */
export function evaluateAdvance(id: ShipmentId, context: AdvanceContext): AdvanceResult {
  const current = stageOf(context.progress, id);
  if (current >= DELIVERED_STAGE) return { ok: false, reason: 'delivered' };

  const blockedDock = SCENARIOS[context.scenario].blockedDock;
  const isBlocked =
    blockedDock !== null &&
    !context.balanced &&
    findShipment(id).sector === blockedDock.sector &&
    current === LOADING_STAGE;
  if (isBlocked) return { ok: false, reason: 'dock-blocked' };

  const next = (current + 1) as StageIndex;
  return { ok: true, next, leftWarehouse: next === IN_TRANSIT_STAGE };
}
