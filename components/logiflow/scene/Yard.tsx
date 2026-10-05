import { memo } from 'react';
import { Instance, Instances } from '@react-three/drei';
import { SCENE_PALETTE } from './palette';
import { Box, Pallet, Tree, type Vec3 } from './primitives';

const HORIZONTAL_ROADS_Z = [-8, 9] as const;
const VERTICAL_ROADS_X = [-11, 11] as const;

/** ~50 marcações de faixa em uma única draw call. */
const LANE_MARKS: readonly { readonly position: Vec3; readonly scale: Vec3 }[] = [
  ...HORIZONTAL_ROADS_Z.flatMap((z) =>
    Array.from({ length: 15 }, (_, i) => ({ position: [-10.5 + i * 1.5, 0.07, z] as const, scale: [0.65, 0.025, 0.07] as const })),
  ),
  ...VERTICAL_ROADS_X.flatMap((x) =>
    Array.from({ length: 10 }, (_, i) => ({ position: [x, 0.075, -6.7 + i * 1.5] as const, scale: [0.07, 0.025, 0.65] as const })),
  ),
];

const TREES: readonly Vec3[] = [
  ...Array.from({ length: 11 }, (_, i) => [-13.1, 0, -9 + i * 1.8] as const),
  ...[-8, -5, 4, 7, 10].map((x) => [x, 0, -10.6] as const),
];

function LaneMarks() {
  return (
    <Instances limit={LANE_MARKS.length} receiveShadow>
      <boxGeometry />
      <meshStandardMaterial color={SCENE_PALETTE.laneMark} roughness={0.65} />
      {LANE_MARKS.map((mark, index) => (
        <Instance key={index} position={[...mark.position]} scale={[...mark.scale]} />
      ))}
    </Instances>
  );
}

/** Pátio estático — memoizado para não reconciliar a cada mudança de estado da página. */
export const Yard = memo(function Yard() {
  return (
    <>
      <Box p={[0, -0.52, 0]} s={[29, 0.8, 24]} c={SCENE_PALETTE.slab} />
      <Box p={[0, -0.08, 0]} s={[28, 0.12, 23]} c={SCENE_PALETTE.floor} />
      {HORIZONTAL_ROADS_Z.map((z) => (
        <Box key={z} p={[0, 0.015, z]} s={[25, 0.07, 2.7]} c={SCENE_PALETTE.road} />
      ))}
      {VERTICAL_ROADS_X.map((x) => (
        <Box key={x} p={[x, 0.02, 0.5]} s={[2.7, 0.08, 19.7]} c={SCENE_PALETTE.road} />
      ))}
      <Box p={[0, 0.02, 0.8]} s={[20, 0.08, 2.4]} c="#b9c5d5" />
      <LaneMarks />

      {TREES.map((p) => (
        <Tree key={p.join(':')} p={p} />
      ))}

      {Array.from({ length: 6 }, (_, i) => (
        <group key={i} position={[7 + (i % 2) * 1.3, 0, 3 + Math.floor(i / 2) * 1.25]}>
          <Pallet p={[0, 0, 0]} />
          <Pallet p={[0, 0.65, 0]} />
        </group>
      ))}

      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-7 + i * 1.1, 1.1, 5]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 2.2, 18]} />
          <meshStandardMaterial color="#d4e0ec" metalness={0.25} roughness={0.5} />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => (
        <Box key={i} p={[-6 + i * 0.9, 0.5, 7]} s={[0.7, 1, 1.2]} c={i % 2 ? '#6ba99a' : '#6c94c9'} />
      ))}
    </>
  );
});
