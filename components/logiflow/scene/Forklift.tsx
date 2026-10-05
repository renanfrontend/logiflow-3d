import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useCursor } from '@react-three/drei';
import type { Group } from 'three';
import type { FleetAssetId } from '@/lib/logiflow/domain/types';
import { Box, Pallet, WheelSet, type Vec3 } from './primitives';
import { MAX_FRAME_DELTA } from './Truck';

interface ForkliftProps {
  readonly id: FleetAssetId;
  readonly origin: Vec3;
  readonly running: boolean;
  readonly active: boolean;
  readonly onSelect: (id: FleetAssetId) => void;
}

const SWING = 1.1;
const FREQUENCY = 0.35;

export function Forklift({ id, origin, running, active, onSelect }: ForkliftProps) {
  const ref = useRef<Group>(null);
  const t = useRef(0);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame((_, delta) => {
    if (running) t.current += Math.min(delta, MAX_FRAME_DELTA);
    if (ref.current) ref.current.position.x = origin[0] + Math.sin(t.current * FREQUENCY) * SWING;
  });

  return (
    <group
      ref={ref}
      position={[...origin]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <Box p={[0, 0.36, 0]} s={[0.8, 0.45, 0.6]} c={active || hovered ? '#fa9f38' : '#f3be49'} />
      <Box p={[-0.08, 0.84, 0]} s={[0.55, 0.08, 0.68]} c="#33495b" />
      {[-0.3, 0.23].flatMap((x) => [-0.28, 0.28].map((z) => <Box key={`${x}:${z}`} p={[x, 0.63, z]} s={[0.04, 0.4, 0.04]} c="#435766" />))}
      <Box p={[0.48, 0.63, 0]} s={[0.08, 1.15, 0.52]} c="#455767" />
      {[-0.23, 0.23].map((z) => (
        <Box key={z} p={[0.8, 0.14, z]} s={[0.6, 0.06, 0.08]} c="#617484" />
      ))}
      <Pallet p={[0.78, 0.17, 0]} />
      <WheelSet xs={[-0.27, 0.27]} zs={[-0.34, 0.34]} y={0.13} />
      {active && (
        <Html center position={[0, 1.55, 0]}>
          <span className="vehicle-label">{id}</span>
        </Html>
      )}
    </group>
  );
}
