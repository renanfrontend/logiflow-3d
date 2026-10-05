import { useEffect, useImperativeHandle, useRef, type ComponentRef, type Ref } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';

export const INITIAL_CAMERA_POSITION = [24, 24, 29] as const;

const HOME = new Vector3(...INITIAL_CAMERA_POSITION);
const ORIGIN = new Vector3(0, 0, 0);
/** Proporção do mundo visível — ajusta o zoom ortográfico ao container. */
const FIT = { width: 39, height: 28 } as const;
const EASING = 7;
const EPSILON = 0.01;

export interface CameraRigHandle {
  reset(): void;
}

interface CameraRigProps {
  readonly ref?: Ref<CameraRigHandle>;
  readonly instant: boolean;
}

const fitZoom = (width: number, height: number): number => Math.min(width / FIT.width, height / FIT.height);

export function CameraRig({ ref, instant }: CameraRigProps) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const resetting = useRef(false);
  const get = useThree((state) => state.get);
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);

  useEffect(() => {
    const { camera } = get();
    camera.zoom = fitZoom(width, height);
    camera.updateProjectionMatrix();
  }, [get, width, height]);

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        resetting.current = true;
        get().invalidate();
      },
    }),
    [get],
  );

  useFrame((state, delta) => {
    const orbit = controls.current;
    if (!resetting.current || !orbit) return;

    const { camera, size } = state;
    const targetZoom = fitZoom(size.width, size.height);
    const k = instant ? 1 : 1 - Math.exp(-delta * EASING);

    camera.position.lerp(HOME, k);
    orbit.target.lerp(ORIGIN, k);
    camera.zoom += (targetZoom - camera.zoom) * k;

    const settled = camera.position.distanceTo(HOME) < EPSILON && Math.abs(camera.zoom - targetZoom) < EPSILON;
    if (settled) {
      camera.position.copy(HOME);
      orbit.target.copy(ORIGIN);
      camera.zoom = targetZoom;
      resetting.current = false;
    }

    camera.updateProjectionMatrix();
    orbit.update();
    if (!settled) state.invalidate();
  });

  return <OrbitControls ref={controls} makeDefault target={[0, 0, 0]} minZoom={5} maxZoom={45} maxPolarAngle={Math.PI / 2.5} enablePan={false} />;
}
