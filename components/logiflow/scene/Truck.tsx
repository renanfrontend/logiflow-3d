import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useCursor } from '@react-three/drei';
import type { Group } from 'three';
import type { FleetAssetId } from '@/lib/logiflow/domain/types';
import { poseOnLoop } from '@/lib/logiflow/presentation/route';
import { Box, WheelSet } from './primitives';

/** Limite do delta por frame — evita "saltos" ao voltar de uma aba inativa. */
export const MAX_FRAME_DELTA = 0.05;

interface TruckProps {
  readonly id: FleetAssetId;
  readonly offset: number;
  readonly speed: number;
  readonly running: boolean;
  readonly active: boolean;
  readonly onSelect: (id: FleetAssetId) => void;
}

export function Truck({ id, offset, speed, running, active, onSelect }: TruckProps) {
  const ref = useRef<Group>(null);
  const t = useRef(offset);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame((_, delta) => {
    if (running) t.current += Math.min(delta, MAX_FRAME_DELTA) * speed;
    const pose = poseOnLoop(t.current);
    ref.current?.position.set(pose.x, 0.34, pose.z);
    if (ref.current) ref.current.rotation.y = pose.heading;
  });

  return (
    <group
      ref={ref}
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
      <Box p={[0, 0.39, 0]} s={[1.6, 0.95, 0.82]} c={active || hovered ? '#91b9ff' : '#fbfcff'} />
      <Box p={[0, 0.08, 0]} s={[2.7, 0.12, 0.85]} c="#344355" />
      <Box p={[1.16, 0.26, 0]} s={[0.66, 0.7, 0.82]} c="#4e80e5" />
      <Box p={[1.25, 0.42, 0]} s={[0.45, 0.25, 0.84]} c="#b5e0ed" />
      <Box p={[1.49, 0.12, 0]} s={[0.04, 0.12, 0.7]} c="#e8f2fc" />
      <WheelSet xs={[-0.53, 0.43, 1.2]} zs={[-0.45, 0.45]} y={-0.07} />
      {active && (
        <Html center position={[0, 1.4, 0]}>
          <span className="vehicle-label">{id}</span>
        </Html>
      )}
    </group>
  );
}
