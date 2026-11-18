import { MenuModel } from './menu.js';
import { CartModel } from './cart.js';
import { PaymentModel } from './payment.js';
import { OrderModel } from './order.js';
import { startView, menuView, optionsView, cartView, paymentView, completeView } from './view.js';
const menus = new MenuModel();
const cart = new CartModel();
const payment = new PaymentModel();
const storage = { getItem: key => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value) };
const orders = new OrderModel(storage);
let order = null;
let completionTimer;
let paymentError = '';
const root = document.querySelector('#kiosk');
const dialog = document.querySelector('#options');
const announcer = document.querySelector('#announcer');
let screen = 'start';
let category = menus.categories[0];
let orderType = '';
let draft = null;
let lastMenuId = '';
function render() {
  if (screen === 'start') root.innerHTML = startView(menus.get('M01'));
  if (screen === 'menu') root.innerHTML = menuView(menus, category, cart.getCount(), cart.getTotal());
  if (screen === 'cart') root.innerHTML = cartView(cart, orderType);
  if (screen === 'payment') {
    root.innerHTML = paymentView(cart.getTotal(), orderType, payment.pending, paymentError);
    root.querySelector('.home').disabled = payment.pending;
  }
  if (screen === 'complete') root.innerHTML = completeView(order, orderType, 10);
}
function go(next) {
  screen = next;
  render();
  root.querySelector('h1')?.focus();
}
function reset() {
  clearInterval(completionTimer); order = null; paymentError = '';
  cart.clear(); orderType = ''; category = menus.categories[0]; draft = null;
  if (dialog.open) dialog.close();
  go('start');
}
function renderOptions() { dialog.innerHTML = optionsView(draft); }
function closeOptions() {
  dialog.close(); draft = null;
  root.querySelector(`[data-id="${lastMenuId}"]`)?.focus();
}
dialog.addEventListener('cancel', event => { event.preventDefault(); closeOptions(); });
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
    if (action === 'checkout' && cart.items.length) { paymentError = ''; return go('payment'); }
    if (action === 'back-cart') return go('cart');
    if (action === 'pay' && screen === 'payment' && cart.items.length) {
      const fail = root.querySelector('#fail-payment').checked;
      paymentError = '';
      const result = payment.pay(button.dataset.method, cart.getTotal(), fail);
      render();
      try {
        if (!await result) { paymentError = '결제가 완료되지 않았습니다. 다시 시도하거나 다른 수단을 선택해 주세요.'; return render(); }
        order = orders.complete(cart.getTotal());
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
