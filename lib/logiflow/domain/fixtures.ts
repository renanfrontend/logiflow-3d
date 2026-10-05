import type { FleetAsset, Scenario, ScenarioDefinition, SectorId, Shipment, Warehouse } from './types.ts';

/** Dados fictícios. Nenhum valor representa uma instalação real. */
export const WAREHOUSES: readonly Warehouse[] = [
  { id: 'A', name: 'Recebimento', subtitle: 'Conferência e entrada', position: [-5, -3], color: '#66d9ba', capacity: 1200, stock: 864, docks: 3 },
  { id: 'B', name: 'Fulfillment', subtitle: 'Separação e embalagem', position: [4, -3], color: '#8b9cfb', capacity: 1800, stock: 1476, docks: 3 },
  { id: 'C', name: 'Expedição', subtitle: 'Consolidação e saída', position: [0, 5], color: '#f3c676', capacity: 960, stock: 528, docks: 3 },
];

export const SHIPMENTS: readonly Shipment[] = [
  { id: 'LF-2048', destination: 'São Paulo • SP', sector: 'C', pallets: 24 },
  { id: 'LF-2049', destination: 'Campinas • SP', sector: 'B', pallets: 18 },
  { id: 'LF-2050', destination: 'Curitiba • PR', sector: 'A', pallets: 32 },
];

export const FLEET: readonly FleetAsset[] = [
  { id: 'TRK-01', kind: 'truck', capacityPallets: 32 },
  { id: 'TRK-02', kind: 'truck', capacityPallets: 32 },
  { id: 'TRK-03', kind: 'truck', capacityPallets: 32 },
  { id: 'FL-01', kind: 'forklift', batteryPercent: 86 },
  { id: 'FL-02', kind: 'forklift', batteryPercent: 64 },
];

export const SCENARIOS: Readonly<Record<Scenario, ScenarioDefinition>> = {
  normal: {
    id: 'normal',
    label: 'Operação normal',
    demand: 120,
    baseCapacity: 144,
    balancedCapacity: 180,
    blockedDock: null,
    balancingAssumption: null,
  },
  peak: {
    id: 'peak',
    label: 'Pico de demanda',
    demand: 168,
    baseCapacity: 144,
    balancedCapacity: 180,
    blockedDock: null,
    balancingAssumption: 'reforço de equipe eleva a capacidade para 180 pallets/h',
  },
  blocked: {
    id: 'blocked',
    label: 'Doca bloqueada',
    demand: 120,
    baseCapacity: 72,
    balancedCapacity: 108,
    blockedDock: { sector: 'C', index: 0 },
    balancingAssumption: 'doca alternativa eleva a capacidade para 108 pallets/h',
  },
};

export const SCENARIO_ORDER: readonly Scenario[] = ['normal', 'peak', 'blocked'];

export function findWarehouse(id: SectorId): Warehouse {
  const warehouse = WAREHOUSES.find((item) => item.id === id);
  if (!warehouse) throw new RangeError(`Setor desconhecido: ${id}`);
  return warehouse;
}

export function isSectorId(value: unknown): value is SectorId {
  return WAREHOUSES.some((item) => item.id === value);
}
