import test from 'node:test';
import assert from 'node:assert/strict';
import { PaymentModel } from '../js/payment.js';
import { OrderModel } from '../js/order.js';
const memory = () => { let value = null; return { getItem: () => value, setItem: (_key, next) => { value = next; } }; };
test('payment rejects empty/invalid totals and unknown methods', async () => {
  const payment = new PaymentModel();
  for (const total of [0, -1, 0.5, NaN, Infinity]) await assert.rejects(payment.pay('card', total));
  await assert.rejects(payment.pay('cash', 5800));
});
test('payment blocks double submission and supports explicit failure then retry', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const payment = new PaymentModel();
  const first = payment.pay('card', 5800, true);
  await assert.rejects(payment.pay('easy', 5800));
  t.mock.timers.tick(1500);
  assert.equal(await first, false);
  const retry = payment.pay('easy', 5800);
  t.mock.timers.tick(1500);
  assert.equal(await retry, true);
  assert.equal(payment.pending, false);
});
test('order numbers survive model reload and storage failure never reports success', () => {
  const storage = memory();
  assert.equal(new OrderModel(storage).complete(5800).orderNo, 1);
  assert.equal(new OrderModel(storage).complete(5800).orderNo, 2);
  const blocked = {getItem: () => null, setItem: () => {throw Error('quota');}};
  assert.throws(() => new OrderModel(blocked).complete(5800));
  assert.throws(() => new OrderModel(storage).complete(0));
});
test('corrupt persisted state is reported, never overwritten', () => {
  let written = false;
  for (const value of ['{bad', 'null', '{"lastOrderNo":-1,"rewards":{}}', '{"lastOrderNo":1,"rewards":{"01012345678":-1}}']) {
    const storage = {getItem: () => value, setItem: () => {written = true;}};
    assert.throws(() => new OrderModel(storage).complete(5800));
  }
  assert.equal(written, false);
});
