import test from 'node:test';
import assert from 'node:assert/strict';
import { StampModel, rewardAmount } from '../js/stamp.js';
import { OrderModel, readState } from '../js/order.js';
const memory = () => { let value = null; return { getItem: () => value, setItem: (_key, next) => { value = next; } }; };
test('2 percent rounds down to whole won', () => {
  assert.equal(rewardAmount(5800), 116);
  assert.equal(rewardAmount(18200), 364);
  assert.equal(rewardAmount(99), 1);
  assert.throws(() => rewardAmount(-1));
});
test('only consented valid phones can look up balances', () => {
  const stamps = new StampModel();
  const state = { rewards: {'01012345678': 116} };
  assert.equal(stamps.lookup(state, '01012345678', true), 116);
  assert.equal(stamps.lookup(state, '01000000000', true), 0);
  assert.throws(() => stamps.lookup(state, '01012345678', false));
  for (const phone of ['', '0101234', '01112345678', '010123456789', '<script>']) assert.throws(() => stamps.lookup(state, phone, true));
});
test('completion adds 2 percent cumulatively while skip does not create any phone record', () => {
  const storage = memory();
  const orders = new OrderModel(storage);
  const enrollment = {phone:'01012345678', consent:true};
  const first = orders.complete(5800, enrollment);
  assert.equal(first.earned, 116);
  assert.equal(first.balance, 116);
  assert.equal(orders.complete(18200, enrollment).balance, 480);
  assert.equal(orders.complete(5000).earned, 0);
  assert.deepEqual(readState(storage), {lastOrderNo:3, rewards:{'01012345678':480}});
});
test('consent rejection and failed storage do not issue order or partial credit', () => {
  const storage = memory();
  const orders = new OrderModel(storage);
  assert.throws(() => orders.complete(5800, {phone:'01012345678',consent:false}));
  assert.equal(storage.getItem(), null);
  orders.complete(5800, {phone:'01012345678',consent:true});
  const saved = storage.getItem();
  storage.setItem = () => { throw Error('quota'); };
  assert.throws(() => orders.complete(5800, {phone:'01012345678',consent:true}));
  assert.equal(storage.getItem(), saved);
});
test('phone keypad inserts 010 once and enforces an eleven-digit maximum', async () => {
  const { editPhone } = await import('../js/stamp.js');
  assert.equal(editPhone('', '010'), '010');
  assert.equal(editPhone('010', '010'), '010');
  assert.equal(editPhone('01012345678', '9'), '01012345678');
  assert.equal(editPhone('010', '지우기'), '01');
  assert.equal(editPhone('01012345678', '전체 삭제'), '');
  assert.equal(editPhone('010', '<'), '010');
});
