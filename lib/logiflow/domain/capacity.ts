import { SCENARIOS } from './fixtures.ts';
import type { Scenario } from './types.ts';

export interface FlowMetrics {
  /** Demanda do cenário em pallets/h. */
  readonly demand: number;
  readonly capacity: number;
  readonly throughput: number;
  /** Acúmulo projetado em pallets/h. */
  readonly queue: number;
  /** Percentual da demanda atendida (0–100). */
  readonly sla: number;
  /** Espera adicional estimada em minutos. */
  readonly wait: number;
}

/**
 * Aproximação didática em regime constante:
 * fluxo = min(demanda, capacidade); fila = max(0, demanda − capacidade).
 */
export function computeFlowMetrics(scenario: Scenario, balanced: boolean): FlowMetrics {
  const definition = SCENARIOS[scenario];
  const demand = definition.demand;
  const capacity = balanced ? definition.balancedCapacity : definition.baseCapacity;
  const throughput = Math.min(demand, capacity);
  const queue = Math.max(0, demand - capacity);

  return {
    demand,
    capacity,
    throughput,
    queue,
    sla: Math.round((throughput / demand) * 100),
    wait: Math.round((queue / capacity) * 60),
  };
}

export type MetricsDelta = { readonly [K in keyof FlowMetrics]: number };

/** Diferença entre a operação balanceada e a base do mesmo cenário. */
export function compareBalancing(scenario: Scenario): MetricsDelta {
  const before = computeFlowMetrics(scenario, false);
  const after = computeFlowMetrics(scenario, true);
  return {
    demand: after.demand - before.demand,
    capacity: after.capacity - before.capacity,
    throughput: after.throughput - before.throughput,
    queue: after.queue - before.queue,
    sla: after.sla - before.sla,
    wait: after.wait - before.wait,
  };
}

export function canBalance(scenario: Scenario): boolean {
  return SCENARIOS[scenario].balancingAssumption !== null;
}
