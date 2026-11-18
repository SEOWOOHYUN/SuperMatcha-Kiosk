import { MenuModel } from './menu.js';
import { startView, menuView } from './view.js';
const menus = new MenuModel();
const root = document.querySelector('#kiosk');
let screen = 'start';
let category = menus.categories[0];
let orderType = '';
function render() {
  root.innerHTML = screen === 'start' ? startView(menus.get('M01')) : menuView(menus, category);
}
root.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  if (button.dataset.action === 'home') { screen = 'start'; orderType = ''; }
  if (button.dataset.action === 'start') { screen = 'menu'; orderType = button.dataset.type; }
  if (button.dataset.action === 'category') category = button.dataset.category;
  render();
});
render();
