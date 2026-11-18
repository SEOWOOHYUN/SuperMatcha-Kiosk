import test from 'node:test';
import assert from 'node:assert/strict';
import { MenuModel } from '../js/menu.js';

test('each category filters menus without leaking other categories', () => {
  const model = new MenuModel();
  assert.equal(model.categories.length, 6);
  for (const category of model.categories) {
    const items = model.list(category);
    assert.ok(items.length > 0);
    assert.ok(items.every(item => item.category === category));
  }
  assert.equal(model.get('M01').price, 5800);
  assert.equal(model.get('missing'), undefined);
  assert.deepEqual(model.list('missing'), []);
});
