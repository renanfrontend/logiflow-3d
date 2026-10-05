import { useState } from 'react';
import { useCursor } from '@react-three/drei';
import type { OccupancyLevel } from '@/lib/logiflow/domain/inventory';
import type { SectorId, Warehouse } from '@/lib/logiflow/domain/types';
import { HEAT_COLORS, SCENE_PALETTE } from './palette';
import { Box, Pallet } from './primitives';

interface WarehouseModelProps {
  readonly warehouse: Warehouse;
  readonly selected: boolean;
  readonly cutaway: boolean;
  /** Nível de ocupação quando a camada de calor está ativa. */
  readonly heat: OccupancyLevel | null;
  readonly blockedDockIndex: number | null;
  readonly onSelect: (id: SectorId) => void;
}

const DOCK_XS = [-1.8, 0, 1.8] as const;

function Interior() {
  return (
    <>
      <Box p={[0, 1.45, -2]} s={[5.8, 2.5, 0.12]} c="#e3eaf2" />
      <Box p={[-2.85, 1.45, 0]} s={[0.12, 2.5, 4]} c="#dee6ee" />
      {DOCK_XS.flatMap((x) =>
        [-0.85, 0.65].map((z) => (
          <group key={`${x}:${z}`}>
            <Box p={[x, 1, z]} s={[1.25, 0.1, 0.75]} c="#f0ac4e" />
            <Box p={[x, 0.33, z]} s={[1.25, 0.1, 0.75]} c="#f0ac4e" />
            {[-0.55, 0.55].map((dx) => (
              <Box key={dx} p={[x + dx, 0.8, z]} s={[0.07, 1.5, 0.8]} c="#698bc1" />
            ))}
            <Pallet p={[x, 0.4, z]} />
            <Pallet p={[x, 1.1, z]} />
          </group>
        )),
      )}
    </>
  );
}

function Shell({ heat }: { readonly heat: OccupancyLevel | null }) {
  return (
    <>
      <Box p={[0, 1.5, 0]} s={[5.8, 2.7, 4.2]} c={heat ? HEAT_COLORS[heat] : SCENE_PALETTE.wall} />
      <Box p={[0, 2.93, 0]} s={[6.15, 0.2, 4.5]} c="#e0e8f2" />
      {DOCK_XS.flatMap((x) => [-1, 0.3, 1.5].map((z) => <Box key={`${x}:${z}`} p={[x, 3.05, z]} s={[1.2, 0.08, 0.75]} c="#82a4cd" />))}
      {[-2, -0.6, 0.8, 2.1].map((x) => (
        <Box key={x} p={[x, 1.8, -2.12]} s={[0.65, 0.5, 0.05]} c="#91b6d7" />
      ))}
    </>
  );
}

/** Altura do rótulo acima do piso — menor no corte, pois a cobertura é ocultada. */
export const labelHeight = (cutaway: boolean): number => (cutaway ? 3.1 : 3.65);

export function WarehouseModel({ warehouse, selected, cutaway, heat, blockedDockIndex, onSelect }: WarehouseModelProps) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const [x, z] = warehouse.position;

  return (
    <group
      position={[x, 0, z]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(warehouse.id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <Box p={[0, 0.16, 0]} s={[6.4, 0.3, 4.8]} c={selected ? SCENE_PALETTE.selection : hovered ? '#9db7e6' : SCENE_PALETTE.plinth} />
      {cutaway ? <Interior /> : <Shell heat={heat} />}
      <Box p={[0, 2.18, 2.12]} s={[5.85, 0.19, 0.08]} c="#5187ec" />
      {DOCK_XS.map((dockX, index) => (
        <group key={dockX}>
          <Box p={[dockX, 0.87, 2.15]} s={[1.15, 1.4, 0.1]} c={blockedDockIndex === index ? SCENE_PALETTE.blockedDock : SCENE_PALETTE.dock} />
          {[0, 1, 2, 3, 4].map((k) => (
            <Box key={k} p={[dockX, 0.36 + k * 0.22, 2.22]} s={[1.12, 0.025, 0.025]} c="#a8b6c7" />
          ))}
          <Box p={[dockX, 0.18, 2.65]} s={[1.35, 0.25, 0.9]} c="#becad9" />
          {[-0.67, 0.67].map((dx) => (
            <Box key={dx} p={[dockX + dx, 0.43, 2.7]} s={[0.08, 0.6, 0.08]} c="#e6b340" />
          ))}
        </group>
      ))}
    </group>
  );
}
