import type { RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { Vec3 } from './primitives';

export interface LabelAnchor {
  readonly id: string;
  readonly position: Vec3;
}

export type LabelRegistry = RefObject<Map<string, HTMLElement>>;

interface LabelProjectorProps {
  readonly anchors: readonly LabelAnchor[];
  readonly registry: LabelRegistry;
}

const scratch = new Vector3();

/**
 * Projeta âncoras 3D em elementos DOM que vivem na árvore React principal.
 * Substitui o `<Html>` do drei nos rótulos fixos: sem roots React extras
 * (que perdiam um rótulo por condição de corrida no mount) e sem re-render
 * por frame — só `transform` via ref.
 */
export function LabelProjector({ anchors, registry }: LabelProjectorProps) {
  useFrame(({ camera, size }) => {
    for (const anchor of anchors) {
      const element = registry.current.get(anchor.id);
      if (!element) continue;

      scratch.set(anchor.position[0], anchor.position[1], anchor.position[2]).project(camera);
      const x = ((scratch.x + 1) / 2) * size.width;
      const y = ((1 - scratch.y) / 2) * size.height;
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      element.style.visibility = scratch.z > 1 ? 'hidden' : 'visible';
    }
  });

  return null;
}
