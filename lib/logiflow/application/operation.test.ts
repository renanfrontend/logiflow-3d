import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { formatNotice, formatSigned } from '../presentation/notice.ts';
import { poseOnLoop } from '../presentation/route.ts';
import {
  initialOperationState,
  operationReducer,
  selectBalancingDelta,
  selectIsRunning,
  type OperationAction,
  type OperationState,
} from './operation.ts';

const run = (actions: readonly OperationAction[], from: OperationState = initialOperationState): OperationState =>
  actions.reduce(operationReducer, from);

describe('operationReducer', () => {
  test('fluxo completo de expedição com doca bloqueada', () => {
    const blocked = run([
      { type: 'scenario/change', scenario: 'blocked' },
      { type: 'shipment/advance' },
      { type: 'shipment/advance' },
      { type: 'shipment/advance' },
    ]);
    assert.equal(blocked.progress['LF-2048'], 2);
    assert.equal(blocked.notice.kind, 'dock-blocked');

    const released = run([{ type: 'scenario/balance' }, { type: 'shipment/advance' }], blocked);
    assert.equal(released.progress['LF-2048'], 3);
    assert.deepEqual(released.notice, { kind: 'stage-advanced', shipment: 'LF-2048', stage: 3, leftWarehouse: true });
  });

  test('trocar de cenário desfaz o balanceamento', () => {
    const state = run([
      { type: 'scenario/change', scenario: 'peak' },
      { type: 'scenario/balance' },
      { type: 'scenario/change', scenario: 'blocked' },
    ]);
    assert.equal(state.balanced, false);
    assert.equal(selectBalancingDelta(state), null);
  });

  test('balanceamento é ignorado no cenário normal', () => {
    const state = run([{ type: 'scenario/balance' }]);
    assert.equal(state, initialOperationState);
  });

  test('selecionar setor limpa o ativo selecionado', () => {
    const state = run([{ type: 'asset/select', asset: 'TRK-02' }, { type: 'sector/select', sector: 'A' }]);
    assert.equal(state.selectedAsset, null);
    assert.equal(state.selectedSector, 'A');
  });

  test('reset preserva a escolha explícita de movimento', () => {
    const state = run([
      { type: 'motion/set', running: false },
      { type: 'layer/toggle', layer: 'heat' },
      { type: 'shipment/advance' },
      { type: 'simulation/reset' },
    ]);
    assert.equal(state.running, false);
    assert.equal(state.layers.heat, false);
    assert.deepEqual(state.progress, {});
    assert.equal(state.notice.kind, 'reset');
  });

  test('movimento segue prefers-reduced-motion até uma escolha explícita', () => {
    assert.equal(selectIsRunning(initialOperationState, true), false);
    assert.equal(selectIsRunning(initialOperationState, false), true);
    assert.equal(selectIsRunning(run([{ type: 'motion/set', running: true }]), true), true);
  });
});

describe('presentation', () => {
  test('mensagens derivadas dos eventos', () => {
    assert.equal(
      formatNotice({ kind: 'stage-advanced', shipment: 'LF-2050', stage: 3, leftWarehouse: true }),
      'LF-2050: Em trânsito. Estoque atualizado após a saída.',
    );
    assert.equal(formatSigned(36), '+36');
    assert.equal(formatSigned(-24), '−24');
  });

  test('rota dos caminhões é contínua e periódica', () => {
    assert.deepEqual(poseOnLoop(0), { x: -11, z: -8, heading: 0 });
    assert.deepEqual(poseOnLoop(4), poseOnLoop(0));
    assert.deepEqual(poseOnLoop(-1), poseOnLoop(3));
    const end = poseOnLoop(0.9999);
    assert.ok(Math.abs(end.x - 11) < 0.01);
  });
});
