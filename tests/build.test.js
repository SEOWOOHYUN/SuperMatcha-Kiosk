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

function launchDemo() {
  const source = readFileSync('kiosk.html', 'utf8').match(/<script>([\s\S]*)<\/script>/)[1];
  const listeners = {};
  const values = new Map();
  const controls = {home:{disabled:false}, fail:{checked:false}, title:{focus(){}}, countdown:{textContent:''}};
  const root = {innerHTML:'', querySelector: selector => selector === '.home' ? controls.home : selector === '#fail-payment' ? controls.fail : controls.title};
  const dialog = {innerHTML:'',open:false,addEventListener(){},showModal(){this.open=true;},close(){this.open=false;}};
  const nodes = {'#kiosk':root,'#options':dialog,'#announcer':{},'#countdown':controls.countdown};
  let countdown;
  const document = {querySelector: id => nodes[id],addEventListener: (type,fn) => {listeners[type]=fn;}};
  vm.runInNewContext(source, {document,localStorage:{getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)},setTimeout:fn=>queueMicrotask(fn),setInterval:fn=>{countdown=fn;return 1;},clearInterval:()=>{countdown=null;}});
  return {root,values,controls,tick:()=>countdown?.(),
    click: (action, extra={}) => listeners.click({target:{closest:()=>({dataset:{action,...extra},disabled:false})}}),
    consent: checked=>listeners.change({target:{id:'consent',checked}})};
}
async function fillCart(app) {
  await app.click('start',{type:'포장하기'});
  await app.click('menu',{id:'M01'});
  await app.click('add');
  await app.click('cart');
  await app.click('checkout');
}
test('controller waits for provider and scan, credits once, then clears the order', async () => {
  for (const provider of ['kakao','toss','naver']) {
    const app=launchDemo(); await fillCart(app);
    app.consent(true);
    await app.click('key',{key:'010'});
    for (let i=0;i<8;i++) await app.click('key',{key:'0'});
    await app.click('lookup-rewards'); await app.click('next-payment');
    await app.click('pay',{method:'easy'});
    assert.ok(app.root.innerHTML.includes('사용하실 간편결제'));
    await app.click('provider',{provider});
    assert.ok(app.root.innerHTML.includes('스캔 완료 체험'));
    assert.equal(app.values.size,0);
    const payment=app.click('scan-pay',{method:'easy'});
    await app.click('scan-pay',{method:'easy'});
    await payment;
    const stored=JSON.parse([...app.values.values()][0]);
    assert.deepEqual(stored,{lastOrderNo:1,rewards:{'01000000000':116}});
    assert.ok(app.root.innerHTML.includes('THANK YOU'));
    assert.ok(!app.root.innerHTML.includes('01000000000'));
    for(let i=0;i<10;i++)app.tick();
    assert.ok(app.root.innerHTML.includes('먹고 가기'));
  }
});
test('failed card payment keeps the cart and skipped rewards stay absent after retry', async () => {
  const app=launchDemo(); await fillCart(app); await app.click('skip-rewards');
  app.controls.fail.checked=true;
  await app.click('pay',{method:'card'});
  assert.equal(app.values.size,0);
  assert.ok(app.root.innerHTML.includes('다시 시도'));
  app.controls.fail.checked=false;
  await app.click('pay',{method:'card'});
  assert.deepEqual(JSON.parse([...app.values.values()][0]),{lastOrderNo:1,rewards:{}});
});
