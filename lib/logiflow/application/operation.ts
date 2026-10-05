import { canBalance, compareBalancing, computeFlowMetrics, type FlowMetrics, type MetricsDelta } from '../domain/capacity.ts';
import { evaluateAdvance, type AdvanceResult, type ShipmentProgress, type StageIndex } from '../domain/shipment.ts';
import type { FleetAssetId, Scenario, SectorId, ShipmentId } from '../domain/types.ts';

export type Layer = 'heat' | 'cutaway';

export type Notice =
  | { readonly kind: 'welcome' }
  | { readonly kind: 'tracking'; readonly shipment: ShipmentId }
  | { readonly kind: 'stage-advanced'; readonly shipment: ShipmentId; readonly stage: StageIndex; readonly leftWarehouse: boolean }
  | { readonly kind: 'dock-blocked'; readonly shipment: ShipmentId }
  | { readonly kind: 'scenario-changed'; readonly scenario: Scenario }
  | { readonly kind: 'balanced'; readonly scenario: Scenario }
  | { readonly kind: 'reset' };

export interface OperationState {
  readonly selectedSector: SectorId;
  readonly selectedAsset: FleetAssetId | null;
  readonly trackedShipment: ShipmentId;
  readonly progress: ShipmentProgress;
  readonly scenario: Scenario;
  readonly balanced: boolean;
  /** `null` = segue a preferência do sistema (prefers-reduced-motion). */
  readonly running: boolean | null;
  readonly layers: Readonly<Record<Layer, boolean>>;
  readonly notice: Notice;
}

export type OperationAction =
  | { readonly type: 'sector/select'; readonly sector: SectorId }
  | { readonly type: 'asset/select'; readonly asset: FleetAssetId }
  | { readonly type: 'asset/clear' }
  | { readonly type: 'shipment/track'; readonly shipment: ShipmentId }
  | { readonly type: 'shipment/advance' }
  | { readonly type: 'scenario/change'; readonly scenario: Scenario }
  | { readonly type: 'scenario/balance' }
  | { readonly type: 'motion/set'; readonly running: boolean }
  | { readonly type: 'layer/toggle'; readonly layer: Layer }
  | { readonly type: 'simulation/reset' };

export const initialOperationState: OperationState = {
  selectedSector: 'B',
  selectedAsset: null,
  trackedShipment: 'LF-2048',
  progress: {},
  scenario: 'normal',
  balanced: false,
  running: null,
  layers: { heat: false, cutaway: false },
  notice: { kind: 'welcome' },
};

export function operationReducer(state: OperationState, action: OperationAction): OperationState {
  switch (action.type) {
    case 'sector/select':
      return { ...state, selectedSector: action.sector, selectedAsset: null };

    case 'asset/select':
      return { ...state, selectedAsset: action.asset };

    case 'asset/clear':
      return { ...state, selectedAsset: null };

    case 'shipment/track':
      return { ...state, trackedShipment: action.shipment, notice: { kind: 'tracking', shipment: action.shipment } };

    case 'shipment/advance': {
      const shipment = state.trackedShipment;
      const result = evaluateAdvance(shipment, state);
      if (!result.ok) {
        return result.reason === 'dock-blocked' ? { ...state, notice: { kind: 'dock-blocked', shipment } } : state;
      }
      return {
        ...state,
        progress: { ...state.progress, [shipment]: result.next },
        notice: { kind: 'stage-advanced', shipment, stage: result.next, leftWarehouse: result.leftWarehouse },
      };
    }

    case 'scenario/change':
      return { ...state, scenario: action.scenario, balanced: false, notice: { kind: 'scenario-changed', scenario: action.scenario } };

    case 'scenario/balance':
      if (state.balanced || !canBalance(state.scenario)) return state;
      return { ...state, balanced: true, notice: { kind: 'balanced', scenario: state.scenario } };

    case 'motion/set':
      return { ...state, running: action.running };

    case 'layer/toggle':
      return { ...state, layers: { ...state.layers, [action.layer]: !state.layers[action.layer] } };

    case 'simulation/reset':
      return { ...initialOperationState, running: state.running, notice: { kind: 'reset' } };

    default: {
      const exhaustive: never = action;
      return exhaustive;
    }
  }
}

/* ---------- Selectors (derivações puras do estado) ---------- */

export const selectMetrics = (state: OperationState): FlowMetrics => computeFlowMetrics(state.scenario, state.balanced);

/** Delta do balanceamento — só existe depois de aplicado. */
export const selectBalancingDelta = (state: OperationState): MetricsDelta | null =>
  state.balanced ? compareBalancing(state.scenario) : null;

export const selectAdvance = (state: OperationState): AdvanceResult => evaluateAdvance(state.trackedShipment, state);

export const selectIsRunning = (state: OperationState, prefersReducedMotion: boolean): boolean =>
  state.running ?? !prefersReducedMotion;
