import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
test('standalone build starts the actual app without module loading or a server', () => {
  execFileSync(process.execPath, ['build.js']);
  const html = readFileSync('kiosk.html', 'utf8');
  const source = html.match(/<script>([\s\S]*)<\/script>/)[1];
  const nodes = {'#kiosk':{innerHTML:''}, '#options':{addEventListener(){}}, '#announcer':{}};
  const document = {querySelector: id => nodes[id], addEventListener(){}};
  vm.runInNewContext(source, {document});
  assert.ok(nodes['#kiosk'].innerHTML.includes('먹고 가기'));
  assert.ok(nodes['#kiosk'].innerHTML.includes('포장하기'));
});
