export type SectorId = 'A' | 'B' | 'C';

export type Scenario = 'normal' | 'peak' | 'blocked';

export type ShipmentId = `LF-${number}`;

export type FleetAssetId = `TRK-${string}` | `FL-${string}`;

export type HexColor = `#${string}`;

export interface Warehouse {
  readonly id: SectorId;
  readonly name: string;
  readonly subtitle: string;
  /** Posição no plano XZ da cena, em unidades de mundo. */
  readonly position: readonly [x: number, z: number];
  readonly color: HexColor;
  /** Capacidade de armazenagem em pallets. */
  readonly capacity: number;
  /** Snapshot inicial de estoque em pallets. */
  readonly stock: number;
  readonly docks: number;
}

export interface Shipment {
  readonly id: ShipmentId;
  readonly destination: string;
  readonly sector: SectorId;
  readonly pallets: number;
}

interface FleetAssetBase {
  readonly id: FleetAssetId;
}

export interface TruckAsset extends FleetAssetBase {
  readonly kind: 'truck';
  readonly capacityPallets: number;
}

export interface ForkliftAsset extends FleetAssetBase {
  readonly kind: 'forklift';
  readonly batteryPercent: number;
}

export type FleetAsset = TruckAsset | ForkliftAsset;

export interface ScenarioDefinition {
  readonly id: Scenario;
  readonly label: string;
  /** Demanda de saída em pallets/h. */
  readonly demand: number;
  readonly baseCapacity: number;
  readonly balancedCapacity: number;
  /** Doca indisponível no cenário, se houver. */
  readonly blockedDock: { readonly sector: SectorId; readonly index: number } | null;
  readonly balancingAssumption: string | null;
}
