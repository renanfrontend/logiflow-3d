import {test} from 'node:test';
import assert from 'node:assert/strict';
import {metrics} from './simulation.ts';
test('baseline meets demand without queue',()=>{assert.deepEqual(metrics('normal',false),{demand:120,capacity:144,throughput:120,queue:0,sla:100,wait:0})});
test('peak balance clears queue and cannot process more than demand',()=>{assert.equal(metrics('peak',false).queue,24);const after=metrics('peak',true);assert.equal(after.queue,0);assert.equal(after.throughput,168);assert.equal(after.sla,100)});
test('blocked-dock alternative improves but does not falsely eliminate bottleneck',()=>{const before=metrics('blocked',false),after=metrics('blocked',true);assert.equal(before.wait,40);assert.equal(after.queue,12);assert.equal(after.sla,90);assert.ok(after.wait<before.wait)});
