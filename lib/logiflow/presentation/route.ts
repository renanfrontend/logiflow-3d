export interface RoutePose {
  readonly x: number;
  readonly z: number;
  /** Rotação no eixo Y, em radianos. */
  readonly heading: number;
}

/** Retângulo do anel viário em unidades de mundo. */
export const YARD_LOOP = { minX: -11, maxX: 11, minZ: -8, maxZ: 9 } as const;

const SEGMENTS = 4;

/**
 * Converte o parâmetro `t` (1 unidade = 1 segmento) em pose no anel viário.
 * Função pura: facilita testes e mantém o `useFrame` sem alocações de lógica.
 */
export function poseOnLoop(t: number): RoutePose {
  const { minX, maxX, minZ, maxZ } = YARD_LOOP;
  const width = maxX - minX;
  const depth = maxZ - minZ;
  const u = ((t % SEGMENTS) + SEGMENTS) % SEGMENTS;
  const segment = Math.floor(u);
  const k = u - segment;

  switch (segment) {
    case 0:
      return { x: minX + width * k, z: minZ, heading: 0 };
    case 1:
      return { x: maxX, z: minZ + depth * k, heading: -Math.PI / 2 };
    case 2:
      return { x: maxX - width * k, z: maxZ, heading: Math.PI };
    default:
      return { x: minX, z: maxZ - depth * k, heading: Math.PI / 2 };
  }
}
