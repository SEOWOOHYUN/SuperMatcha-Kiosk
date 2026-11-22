import test from 'node:test';
import assert from 'node:assert/strict';
import { CartModel } from '../js/cart.js';
import { MenuModel } from '../js/menu.js';
const menus = new MenuModel();
test('option surcharges and quantities determine totals, deletion clears total', () => {
  const cart = new CartModel();
  cart.add(menus.get('M01'), { 온도:'ICE', 당도:'50%', 우유:'오트 밀크' }, 2);
  cart.add(menus.get('K02'), { 크기:'홀' }, 1);
  assert.equal(cart.getTotal(), 37500);
  cart.setQuantity(0, 1);
  assert.equal(cart.getTotal(), 31200);
  cart.remove(1);
  assert.equal(cart.getTotal(), 6300);
  cart.clear();
  assert.equal(cart.getTotal(), 0);
});
test('reject invalid quantity and unsupported options without mutating cart', () => {
  const cart = new CartModel();
  for (const q of [0,-1,1.5,NaN,Infinity,'2']) assert.throws(() => cart.add(menus.get('S01'), {}, q));
  assert.throws(() => cart.add(menus.get('S01'), { 크기:'홀' }, 1));
  assert.throws(() => cart.add(menus.get('M01'), { 온도:'COLD' }, 1));
  assert.equal(cart.items.length, 0);
  cart.add(menus.get('S01'), {}, 10);
  assert.throws(() => cart.setQuantity(0, 0));
  assert.equal(cart.getTotal(), 45000);
});
test('default options are valid and selected objects are copied', () => {
  const cart = new CartModel();
  const selected = { 크기:'홀' };
  cart.add(menus.get('K01'), selected, 1);
  selected.크기 = '조각';
  assert.equal(cart.getTotal(), 24900);
  cart.add(menus.get('M01'), {}, 1);
  assert.equal(cart.getTotal(), 30700);
});

test('quantities above ten and revised sweetness work', () => {
  const cart = new CartModel();
  cart.add(menus.get('M01'), {당도:'70%'}, 11);
  cart.setQuantity(0, 12);
  assert.equal(cart.getTotal(), 5800 * 12);
  assert.deepEqual(menus.get('M01').options.find(o => o.name === '당도').choices, ['50%', '70%', '100%']);
  assert.throws(() => cart.add(menus.get('M01'), {당도:'0%'}));
});
