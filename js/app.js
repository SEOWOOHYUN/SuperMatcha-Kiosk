import { MenuModel } from './menu.js';
import { CartModel } from './cart.js';
import { startView, menuView, optionsView, cartView } from './view.js';
const menus = new MenuModel();
const cart = new CartModel();
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
}
function go(next) {
  screen = next;
  render();
  root.querySelector('h1')?.focus();
}
function reset() {
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
document.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button || button.disabled) return;
  const { action, id, index, delta } = button.dataset;
  try {
    if (action === 'home') return reset();
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
    if (action === 'cart' && cart.items.length) return go('cart');
    if (action === 'back-menu') return go('menu');
    if (action === 'cart-quantity') { cart.setQuantity(Number(index), cart.items[index].quantity + Number(delta)); render(); }
    if (action === 'remove') { cart.remove(Number(index)); render(); }
  } catch (error) { announcer.textContent = error.message; }
});
render();
