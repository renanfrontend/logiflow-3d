import { SHIPMENTS, WAREHOUSES, findWarehouse } from './fixtures.ts';
import { hasLeftWarehouse, type ShipmentProgress } from './shipment.ts';
import type { SectorId } from './types.ts';

export type OccupancyLevel = 'low' | 'moderate' | 'high';

/** Limiares de ocupação usados pela camada de calor e pelos indicadores. */
export const OCCUPANCY_THRESHOLDS = { moderate: 0.6, high: 0.8 } as const;

export function stockFor(sector: SectorId, progress: ShipmentProgress): number {
  const dispatched = SHIPMENTS.filter(
    (shipment) => shipment.sector === sector && hasLeftWarehouse(progress, shipment.id),
  ).reduce((sum, shipment) => sum + shipment.pallets, 0);
  return findWarehouse(sector).stock - dispatched;
}

export function totalStock(progress: ShipmentProgress): number {
  return WAREHOUSES.reduce((sum, warehouse) => sum + stockFor(warehouse.id, progress), 0);
}

export const TOTAL_CAPACITY = WAREHOUSES.reduce((sum, warehouse) => sum + warehouse.capacity, 0);

/** Razão de ocupação entre 0 e 1. */
export function occupancyRatio(sector: SectorId, progress: ShipmentProgress): number {
  return stockFor(sector, progress) / findWarehouse(sector).capacity;
}

export function occupancyLevel(ratio: number): OccupancyLevel {
  if (ratio >= OCCUPANCY_THRESHOLDS.high) return 'high';
  if (ratio >= OCCUPANCY_THRESHOLDS.moderate) return 'moderate';
  return 'low';
}
