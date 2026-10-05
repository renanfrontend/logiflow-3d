import { useReducer } from 'react';
import {
  initialOperationState,
  operationReducer,
  selectAdvance,
  selectBalancingDelta,
  selectIsRunning,
  selectMetrics,
  type OperationAction,
  type OperationState,
} from '@/lib/logiflow/application/operation';
import type { FlowMetrics, MetricsDelta } from '@/lib/logiflow/domain/capacity';
import type { AdvanceResult } from '@/lib/logiflow/domain/shipment';
import { usePrefersReducedMotion } from './use-media-query';

export interface OperationView {
  readonly state: OperationState;
  readonly dispatch: (action: OperationAction) => void;
  readonly metrics: FlowMetrics;
  readonly delta: MetricsDelta | null;
  readonly advance: AdvanceResult;
  readonly running: boolean;
  readonly reducedMotion: boolean;
}

/**
 * Fachada da camada de aplicação para a UI.
 * Os seletores são O(1) e puros — memoização aqui seria custo sem ganho.
 */
export function useOperation(): OperationView {
  const [state, dispatch] = useReducer(operationReducer, initialOperationState);
  const prefersReducedMotion = usePrefersReducedMotion();

  return {
    state,
    dispatch,
    metrics: selectMetrics(state),
    delta: selectBalancingDelta(state),
    advance: selectAdvance(state),
    running: selectIsRunning(state, prefersReducedMotion),
    reducedMotion: prefersReducedMotion,
  };
}
