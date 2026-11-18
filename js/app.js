import { MenuModel } from './menu.js';
import { CartModel } from './cart.js';
import { PaymentModel } from './payment.js';
import { StampModel, editPhone } from './stamp.js';
import { OrderModel, readState } from './order.js';
import { startView, menuView, optionsView, cartView, paymentView, completeView, rewardsView, replaceMarkup } from './view.js';
const menus = new MenuModel();
const cart = new CartModel();
const payment = new PaymentModel();
const storage = { getItem: key => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value) };
const orders = new OrderModel(storage);
let order = null;
let completionTimer;
let paymentError = '';
const stamps = new StampModel();
let enrollment = null;
let rewards = {phone:'', consent:false, balance:null, error:''};
function clearRewards() { enrollment = null; rewards = {phone:'', consent:false, balance:null, error:''}; }
const root = document.querySelector('#kiosk');
const dialog = document.querySelector('#options');
const announcer = document.querySelector('#announcer');
let screen = 'start';
let category = menus.categories[0];
let orderType = '';
let draft = null;
let lastMenuId = '';
function render() {
  if (screen === 'start') replaceMarkup(root, startView());
  if (screen === 'menu') replaceMarkup(root, menuView(menus, category, cart.getCount(), cart.getTotal()));
  if (screen === 'cart') replaceMarkup(root, cartView(cart, orderType));
  if (screen === 'rewards') replaceMarkup(root, rewardsView(rewards, cart.getTotal()));
  if (screen === 'payment') {
    replaceMarkup(root, paymentView(cart.getTotal(), orderType, payment.pending, paymentError));
    root.querySelector('.home').disabled = payment.pending;
  }
  if (screen === 'complete') replaceMarkup(root, completeView(order, orderType, 10));
}
function go(next) {
  screen = next;
  render();
  root.querySelector('h1')?.focus();
}
function reset() {
  clearRewards();
  clearInterval(completionTimer); order = null; paymentError = '';
  cart.clear(); orderType = ''; category = menus.categories[0]; draft = null;
  if (dialog.open) dialog.close();
  go('start');
}
function renderOptions() { replaceMarkup(dialog, optionsView(draft)); }
function closeOptions() {
  dialog.close(); draft = null;
  root.querySelector(`[data-id="${lastMenuId}"]`)?.focus();
}
dialog.addEventListener('cancel', event => { event.preventDefault(); closeOptions(); });
document.addEventListener('change', event => {
  if (event.target.id === 'consent') {
    rewards.consent = event.target.checked;
    rewards.phone = ''; rewards.balance = null; rewards.error = ''; enrollment = null; render();
  }
});
document.addEventListener('input', event => {
  if (event.target.id === 'phone' && rewards.consent) {
    rewards.phone = event.target.value.replace(/\D/g, '').slice(0, 11);
    rewards.balance = null; rewards.error = ''; enrollment = null; render();
    const input = root.querySelector('#phone'); input.focus(); input.setSelectionRange(input.value.length, input.value.length);
  }
});
document.addEventListener('click', async event => {
  const button = event.target.closest('button[data-action]');
  if (!button || button.disabled || payment.pending) return;
  const { action, id, index, delta } = button.dataset;
  try {
    if (action === 'home' || action === 'finish') return reset();
    if (action === 'start') { orderType = button.dataset.type; return go('menu'); }
    if (action === 'category') { category = button.dataset.category; render(); return; }
    if (action === 'menu') {
      const menu = menus.get(id); lastMenuId = id;
      draft = { menu, quantity: 1, selected: Object.fromEntries(menu.options.map(o => [o.name, o.choices[0]])) };
      renderOptions(); dialog.showModal(); return;
    }
    if (action === 'option') { draft.selected[button.dataset.option] = button.dataset.value; renderOptions(); return; }
    if (action === 'option-quantity') { draft.quantity = Math.max(1, Math.min(10, draft.quantity + Number(delta))); renderOptions(); return; }
    if (action === 'close-options') return closeOptions();
    if (action === 'add') {
      cart.add(draft.menu, draft.selected, draft.quantity);
      announcer.textContent = `${draft.menu.name} ${draft.quantity}개를 담았습니다.`;
      render(); closeOptions(); return;
    }
    if (action === 'checkout' && cart.items.length) { clearRewards(); paymentError = ''; return go('rewards'); }
    if (action === 'key' && rewards.consent) {
      const key = button.dataset.key;
      rewards.phone = editPhone(rewards.phone, key);
      rewards.balance = null; rewards.error = ''; enrollment = null; render(); return;
    }
    if (action === 'lookup-rewards') {
      try { rewards.balance = stamps.lookup(readState(storage), rewards.phone, rewards.consent); rewards.error = ''; }
      catch (error) { rewards.error = error.message; }
      render(); return;
    }
    if (action === 'skip-rewards') { clearRewards(); return go('payment'); }
    if (action === 'next-payment' && rewards.consent && rewards.balance !== null) {
      enrollment = {phone:rewards.phone, consent:true}; return go('payment');
    }
    if (action === 'back-cart') { clearRewards(); return go('cart'); }
    if (action === 'pay' && screen === 'payment' && cart.items.length) {
      const fail = root.querySelector('#fail-payment').checked;
      paymentError = '';
      const result = payment.pay(button.dataset.method, cart.getTotal(), fail);
      render();
      try {
        if (!await result) { paymentError = '결제가 완료되지 않았습니다. 다시 시도하거나 다른 수단을 선택해 주세요.'; return render(); }
        order = orders.complete(cart.getTotal(), enrollment);
        clearRewards();
        cart.clear();
        go('complete');
        let seconds = 10;
        completionTimer = setInterval(() => {
          seconds -= 1;
          if (seconds <= 0) return reset();
          document.querySelector('#countdown').textContent = seconds;
        }, 1000);
      } catch (error) { paymentError = error.message; render(); }
      return;
    }
    if (action === 'cart' && cart.items.length) return go('cart');
    if (action === 'back-menu') return go('menu');
    if (action === 'cart-quantity') { cart.setQuantity(Number(index), cart.items[index].quantity + Number(delta)); render(); }
    if (action === 'remove') { cart.remove(Number(index)); render(); }
  } catch (error) { announcer.textContent = error.message; }
});
render();
