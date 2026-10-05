import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { canBalance, compareBalancing, computeFlowMetrics } from './capacity.ts';
import { WAREHOUSES } from './fixtures.ts';
import { TOTAL_CAPACITY, occupancyLevel, occupancyRatio, stockFor, totalStock } from './inventory.ts';
import { evaluateAdvance } from './shipment.ts';

describe('computeFlowMetrics', () => {
  test('baseline atende a demanda sem fila', () => {
    assert.deepEqual(computeFlowMetrics('normal', false), {
      demand: 120,
      capacity: 144,
      throughput: 120,
      queue: 0,
      sla: 100,
      wait: 0,
    });
  });

  test('balanceamento no pico zera a fila sem processar acima da demanda', () => {
    assert.equal(computeFlowMetrics('peak', false).queue, 24);
    const after = computeFlowMetrics('peak', true);
    assert.equal(after.queue, 0);
    assert.equal(after.throughput, 168);
    assert.equal(after.sla, 100);
  });

  test('doca alternativa melhora, mas não elimina falsamente o gargalo', () => {
    const before = computeFlowMetrics('blocked', false);
    const after = computeFlowMetrics('blocked', true);
    assert.equal(before.wait, 40);
    assert.equal(after.queue, 12);
    assert.equal(after.sla, 90);
    assert.ok(after.wait < before.wait);
  });
});

describe('compareBalancing', () => {
  test('retorna o delta do cenário bloqueado', () => {
    assert.deepEqual(compareBalancing('blocked'), {
      demand: 0,
      capacity: 36,
      throughput: 36,
      queue: -36,
      sla: 30,
      wait: -33,
    });
  });

  test('cenário normal não admite balanceamento', () => {
    assert.equal(canBalance('normal'), false);
    assert.equal(canBalance('peak'), true);
  });
});

describe('inventory', () => {
  test('capacidade total é derivada dos armazéns', () => {
    assert.equal(TOTAL_CAPACITY, 3960);
  });

  test('estoque só é debitado quando a carga sai do armazém', () => {
    assert.equal(stockFor('C', { 'LF-2048': 2 }), 528);
    assert.equal(stockFor('C', { 'LF-2048': 3 }), 504);
    assert.equal(stockFor('C', { 'LF-2048': 4 }), 504);
  });

  test('estoque total soma todos os setores', () => {
    const initial = WAREHOUSES.reduce((sum, warehouse) => sum + warehouse.stock, 0);
    assert.equal(totalStock({}), initial);
    assert.equal(totalStock({ 'LF-2050': 3 }), initial - 32);
  });

  test('nível de ocupação usa limiares explícitos', () => {
    assert.equal(occupancyLevel(occupancyRatio('A', {})), 'moderate');
    assert.equal(occupancyLevel(occupancyRatio('B', {})), 'high');
    assert.equal(occupancyLevel(occupancyRatio('C', {})), 'low');
  });
});

describe('evaluateAdvance', () => {
  test('bloqueia a saída da doca C sem balanceamento', () => {
    const result = evaluateAdvance('LF-2048', { progress: { 'LF-2048': 2 }, scenario: 'blocked', balanced: false });
    assert.deepEqual(result, { ok: false, reason: 'dock-blocked' });
  });

  test('libera a saída com rota alternativa e sinaliza a baixa de estoque', () => {
    const result = evaluateAdvance('LF-2048', { progress: { 'LF-2048': 2 }, scenario: 'blocked', balanced: true });
    assert.deepEqual(result, { ok: true, next: 3, leftWarehouse: true });
  });

  test('não avança carga entregue', () => {
    const result = evaluateAdvance('LF-2049', { progress: { 'LF-2049': 4 }, scenario: 'normal', balanced: false });
    assert.deepEqual(result, { ok: false, reason: 'delivered' });
  });
});
