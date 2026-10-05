'use client';

import type { Ref } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Line } from '@react-three/drei';
import { SCENARIOS, WAREHOUSES } from '@/lib/logiflow/domain/fixtures';
import { occupancyLevel, occupancyRatio } from '@/lib/logiflow/domain/inventory';
import type { ShipmentProgress } from '@/lib/logiflow/domain/shipment';
import type { FleetAsset, FleetAssetId, Scenario, SectorId } from '@/lib/logiflow/domain/types';
import { CameraRig, INITIAL_CAMERA_POSITION, type CameraRigHandle } from './CameraRig';
import { Forklift } from './Forklift';
import { LabelProjector, type LabelAnchor, type LabelRegistry } from './LabelProjector';
import { SCENE_PALETTE } from './palette';
import type { Vec3 } from './primitives';
import { Truck } from './Truck';
import { WarehouseModel, labelHeight } from './WarehouseModel';
import { Yard } from './Yard';

export type SceneHandle = CameraRigHandle;

export interface SceneProps {
  readonly ref?: Ref<SceneHandle>;
  readonly fleet: readonly FleetAsset[];
  readonly selectedSector: SectorId;
  readonly selectedAsset: FleetAssetId | null;
  readonly scenario: Scenario;
  readonly balanced: boolean;
  readonly progress: ShipmentProgress;
  readonly running: boolean;
  readonly reducedMotion: boolean;
  readonly heat: boolean;
  readonly cutaway: boolean;
  /** Elementos DOM dos rótulos de setor, indexados pelo id do setor. */
  readonly labelRegistry: LabelRegistry;
  readonly onSelectSector: (id: SectorId) => void;
  readonly onSelectAsset: (id: FleetAssetId) => void;
}

const FORKLIFT_ORIGINS: readonly Vec3[] = [
  [-5, 0.05, 0.15],
  [3, 0.05, 0.15],
];

const ALTERNATIVE_ROUTE: readonly Vec3[] = [
  [-7, 0.16, 1],
  [0, 0.16, 1],
  [8, 0.16, 1],
  [8, 0.16, 8],
];

/** Velocidade no anel (segmentos/s). A doca bloqueada desacelera o pátio. */
const TRUCK_SPEED = { nominal: 0.055, congested: 0.025 } as const;

export default function Scene({
  ref,
  fleet,
  selectedSector,
  selectedAsset,
  scenario,
  balanced,
  progress,
  running,
  reducedMotion,
  heat,
  cutaway,
  labelRegistry,
  onSelectSector,
  onSelectAsset,
}: SceneProps) {
  // A doca continua indisponível após o balanceamento; o que muda é a rota alternativa.
  const blockedDock = SCENARIOS[scenario].blockedDock;
  const truckSpeed = blockedDock && !balanced ? TRUCK_SPEED.congested : TRUCK_SPEED.nominal;
  const trucks = fleet.filter((asset) => asset.kind === 'truck');
  const forklifts = fleet.filter((asset) => asset.kind === 'forklift');
  const labelAnchors: readonly LabelAnchor[] = WAREHOUSES.map(({ id, position: [x, z] }) => ({
    id,
    position: [x, labelHeight(cutaway), z],
  }));

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      orthographic
      // Pausado = render sob demanda: GPU ociosa até haver interação.
      frameloop={running ? 'always' : 'demand'}
      camera={{ position: [...INITIAL_CAMERA_POSITION], zoom: 20, near: 0.1, far: 150 }}
      fallback={<div className="fallback">Visualização 3D indisponível. Utilize a lista de setores abaixo.</div>}
    >
      <CameraRig ref={ref} instant={reducedMotion} />
      <LabelProjector anchors={labelAnchors} registry={labelRegistry} />
      <color attach="background" args={[SCENE_PALETTE.background]} />
      <ambientLight intensity={1.7} />
      <directionalLight
        position={[-8, 22, 15]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      <Yard />

      {WAREHOUSES.map((warehouse) => (
        <WarehouseModel
          key={warehouse.id}
          warehouse={warehouse}
          selected={selectedSector === warehouse.id}
          cutaway={cutaway}
          heat={heat ? occupancyLevel(occupancyRatio(warehouse.id, progress)) : null}
          blockedDockIndex={blockedDock?.sector === warehouse.id ? blockedDock.index : null}
          onSelect={onSelectSector}
        />
      ))}

      {trucks.map((truck, index) => (
        <Truck
          key={truck.id}
          id={truck.id}
          offset={index * 1.1}
          speed={truckSpeed}
          running={running}
          active={selectedAsset === truck.id}
          onSelect={onSelectAsset}
        />
      ))}
      {forklifts.map((forklift, index) => (
        <Forklift
          key={forklift.id}
          id={forklift.id}
          origin={FORKLIFT_ORIGINS[index % FORKLIFT_ORIGINS.length]}
          running={running}
          active={selectedAsset === forklift.id}
          onSelect={onSelectAsset}
        />
      ))}

      {balanced && (
        <Line
          points={ALTERNATIVE_ROUTE.map((point) => [...point] as [number, number, number])}
          color={SCENE_PALETTE.route}
          lineWidth={3}
          dashed
          dashSize={0.35}
          gapSize={0.2}
        />
      )}
      <ContactShadows position={[0, -0.1, 0]} opacity={0.22} scale={40} blur={2.5} far={10} />
    </Canvas>
  );
}
