import type { OccupancyLevel } from '@/lib/logiflow/domain/inventory';

export const SCENE_PALETTE = {
  background: '#e6edf7',
  slab: '#c0cbdc',
  floor: '#e1e8ef',
  road: '#aabace',
  laneMark: '#f7faff',
  selection: '#5489f0',
  plinth: '#c5cedb',
  wall: '#f3f6fa',
  blockedDock: '#c75b50',
  dock: '#7b8b9f',
  route: '#368ed3',
} as const;

export const HEAT_COLORS: Readonly<Record<OccupancyLevel, string>> = {
  low: '#7fc6ac',
  moderate: '#d8cf7c',
  high: '#efb459',
};
