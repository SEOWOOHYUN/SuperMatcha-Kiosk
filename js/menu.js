import { categories, menus } from './menu-data.js';
export class MenuModel {
  categories = categories;
  list(category) { return menus.filter(menu => menu.category === category); }
  get(id) { return menus.find(menu => menu.id === id); }
}
