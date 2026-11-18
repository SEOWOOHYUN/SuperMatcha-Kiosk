import { categoryNames } from './menu-data.js';
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
