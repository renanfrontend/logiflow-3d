import type { ThreeElements } from '@react-three/fiber';

export type Vec3 = readonly [x: number, y: number, z: number];

type MeshProps = Omit<ThreeElements['mesh'], 'position' | 'args'>;

interface BoxProps extends MeshProps {
  readonly p: Vec3;
  readonly s: Vec3;
  readonly c: string;
  readonly roughness?: number;
}

export function Box({ p, s, c, roughness = 0.65, ...mesh }: BoxProps) {
  return (
    <mesh position={[...p]} castShadow receiveShadow {...mesh}>
      <boxGeometry args={[...s]} />
      <meshStandardMaterial color={c} roughness={roughness} />
    </mesh>
  );
}

export function Wheel({ p }: { readonly p: Vec3 }) {
  return (
    <mesh position={[...p]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.19, 0.19, 0.12, 12]} />
      <meshStandardMaterial color="#253546" />
    </mesh>
  );
}

export function Pallet({ p }: { readonly p: Vec3 }) {
  return (
    <group position={[...p]}>
      <Box p={[0, 0.08, 0]} s={[0.65, 0.12, 0.65]} c="#b58b56" />
      <Box p={[0, 0.38, 0]} s={[0.58, 0.5, 0.58]} c="#bf945e" />
      <Box p={[0, 0.4, 0.3]} s={[0.08, 0.52, 0.01]} c="#ecd3a0" />
    </group>
  );
}

export function Tree({ p }: { readonly p: Vec3 }) {
  return (
    <group position={[...p]}>
      <Box p={[0, 0.4, 0]} s={[0.1, 0.8, 0.1]} c="#89847c" />
      <mesh position={[0, 1, 0]} castShadow>
        <icosahedronGeometry args={[0.52, 1]} />
        <meshStandardMaterial color="#87ba9b" />
      </mesh>
    </group>
  );
}

/** Grade de rodas simétrica: produto cartesiano de offsets X × Z. */
export function WheelSet({ xs, zs, y }: { readonly xs: readonly number[]; readonly zs: readonly number[]; readonly y: number }) {
  return xs.flatMap((x) => zs.map((z) => <Wheel key={`${x}:${z}`} p={[x, y, z]} />));
}
