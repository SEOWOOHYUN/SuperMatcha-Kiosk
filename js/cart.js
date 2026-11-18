function validateQuantity(quantity) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw new Error('수량은 1~10개로 선택해 주세요.');
}
export function itemPrice(item) {
  return (item.menu.price + item.menu.options.reduce((sum, option) => sum + (option.extraPrice?.[item.selected[option.name]] ?? 0), 0)) * item.quantity;
}
export class CartModel {
  items = [];
  add(menu, selected = {}, quantity = 1) {
    validateQuantity(quantity);
    if (!menu || !Number.isSafeInteger(menu.price) || menu.price < 0) throw new Error('메뉴를 확인해 주세요.');
    if (Object.keys(selected).some(key => !menu.options.some(o => o.name === key))) throw new Error('선택할 수 없는 옵션입니다.');
    const choices = {};
    for (const option of menu.options) {
      const value = selected[option.name] ?? option.choices[0];
      if (!option.choices.includes(value)) throw new Error('옵션을 다시 선택해 주세요.');
      choices[option.name] = value;
    }
    this.items.push({ menu, selected: choices, quantity });
  }
  setQuantity(index, quantity) {
    validateQuantity(quantity);
    if (!this.items[index]) throw new Error('장바구니 항목을 찾을 수 없습니다.');
    this.items[index].quantity = quantity;
  }
  remove(index) { if (Number.isInteger(index) && index >= 0) this.items.splice(index, 1); }
  clear() { this.items = []; }
  getTotal() { return this.items.reduce((total, item) => total + itemPrice(item), 0); }
  getCount() { return this.items.reduce((count, item) => count + item.quantity, 0); }
}
