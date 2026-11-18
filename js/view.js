import { categoryNames } from './menu-data.js';
import { itemPrice } from './cart.js';
export const money = value => value.toLocaleString('ko-KR');
export const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const picture = (menu, className = '') => `<img class="product-photo ${className}" src="${menu.image}" alt="${escape(menu.name)}" referrerpolicy="no-referrer">`;
export const header = () => `<header class="topbar"><span class="wordmark">SUPER MATCHA</span><button class="home" data-action="home">처음으로</button></header>`;
export const title = (en, ko, orderType = '') => `<div class="page-title"><h1 tabindex="-1">${en}</h1>${orderType ? `<span class="badge">${orderType}</span>` : ''}<p>${ko}</p></div>`;
export function startView(menu) {
  return `<section class="start screen"><div class="start-logo" aria-label="SUPER MATCHA">SUPER<br>MATCHA</div>
    <div class="hero-photo">${picture(menu)}</div><div class="start-bottom"><p>이용 방법을 선택해 주세요</p>
    <div class="actions"><button data-action="start" data-type="먹고 가기">먹고 가기<span>EAT IN</span></button><button data-action="start" data-type="포장하기">포장하기<span>TAKE OUT</span></button></div>
    <small class="demo-label">UI DEMO · 실제 결제가 발생하지 않습니다</small></div></section>`;
}
export function menuView(model, category, count = 0, total = 0) {
  return `${header()}<nav class="categories" aria-label="메뉴 카테고리">${model.categories.map(c => `<button data-action="category" data-category="${c}" aria-pressed="${c === category}">${c}</button>`).join('')}</nav>
    <section class="menu-content scroll-area">${title(category, categoryNames[model.categories.indexOf(category)])}
    <div class="menu-grid">${model.list(category).map(m => `<button class="menu-card" data-action="menu" data-id="${m.id}"><div class="photo-wrap"><div class="tags">${m.tags.map(t => `<span>${t}</span>`).join('')}</div>${picture(m)}</div><span class="menu-en">${m.nameEn}</span><span class="menu-ko">${m.name}</span><span class="price">${money(m.price)}<small>원</small></span></button>`).join('')}</div></section>
    <footer class="cart-summary"><p>담은 메뉴 <strong>${count}</strong>개 · <strong>${money(total)}</strong>원</p><button class="primary" data-action="cart" ${count ? '' : 'disabled'}>장바구니 <span aria-hidden="true">↗</span></button></footer>`;
}
const quantityControl = (quantity, action, index = '') => `<div class="quantity" aria-label="수량 선택"><button data-action="${action}" data-index="${index}" data-delta="-1" aria-label="수량 줄이기" ${quantity <= 1 ? 'disabled' : ''}>−</button><output>${quantity}</output><button data-action="${action}" data-index="${index}" data-delta="1" aria-label="수량 늘리기" ${quantity >= 10 ? 'disabled' : ''}>+</button></div>`;
export function optionsView(item) {
  const m = item.menu;
  return `<div class="option-content"><div class="option-heading">${picture(m)}<div><h2 id="option-title">${m.nameEn}</h2><p>${m.name}</p><strong class="price">${money(m.price)}<small>원</small></strong></div></div>
    ${m.options.map(o => `<fieldset><legend><span>${o.label}</span> ${o.name}</legend><div class="option-choices">${o.choices.map(c => `<button data-action="option" data-option="${o.name}" data-value="${c}" aria-pressed="${item.selected[o.name] === c}">${c}${o.extraPrice?.[c] ? `<small>+${money(o.extraPrice[c])}원</small>` : ''}</button>`).join('')}</div></fieldset>`).join('')}
    ${m.options.length ? '' : '<p class="option-note">옵션 없이 즐기는 메뉴입니다.<br>원하시는 수량을 선택해 주세요.</p>'}
    <fieldset><legend><span>QUANTITY</span> 수량 <small>최대 10개</small></legend>${quantityControl(item.quantity, 'option-quantity')}</fieldset></div>
    <footer class="bottom-bar"><div class="total"><span>TOTAL <small>선택 금액</small></span><strong>${money(itemPrice(item))}<small>원</small></strong></div><div class="actions"><button data-action="close-options">취소</button><button class="primary" data-action="add">담기</button></div></footer>`;
}
export function cartView(cart, orderType) {
  return `${header()}<section class="page-content scroll-area">${title('MY ORDER', '장바구니', orderType)}<div class="cart-list">${cart.items.length ? cart.items.map((item, i) => `<article class="cart-item">${picture(item.menu)}<div class="cart-detail"><h2>${item.menu.nameEn}</h2><p>${item.menu.name}</p><small>${Object.values(item.selected).join(' · ') || '기본'}</small>${quantityControl(item.quantity, 'cart-quantity', i)}</div><div class="line-price"><button class="delete" data-action="remove" data-index="${i}" aria-label="${item.menu.name} 삭제">삭제</button><strong>${money(itemPrice(item))}<small>원</small></strong></div></article>`).join('') : '<div class="empty"><span>YOUR NEXT<br>GREEN MOMENT.</span><p>장바구니가 비어 있어요.<br>좋아하는 메뉴를 담아 주세요.</p></div>'}</div></section>
    <footer class="bottom-bar"><div class="total"><span>TOTAL <small>총 주문 금액</small></span><strong>${money(cart.getTotal())}<small>원</small></strong></div><div class="actions"><button data-action="back-menu">메뉴 추가</button><button class="primary" data-action="checkout" ${cart.items.length ? '' : 'disabled'}>결제하기</button></div></footer>`;
}
