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
export function paymentView(total, orderType, pending, error = '') {
  const cardIcon = '<svg viewBox="0 0 48 40" aria-hidden="true"><rect x="3" y="7" width="42" height="28" rx="4" fill="currentColor"/><path d="M3 15h42" stroke="#03bd5a" stroke-width="5"/><path d="M10 27h9" stroke="#eee" stroke-width="3"/></svg>';
  const phoneIcon = '<svg viewBox="0 0 48 40" aria-hidden="true"><rect x="14" y="2" width="21" height="36" rx="4" fill="currentColor"/><path d="M18 8h13v22H18z" fill="#03bd5a"/><circle cx="24.5" cy="34" r="1.5" fill="#eee"/></svg>';
  return `${header()}<section class="page-content scroll-area">${title('PAYMENT', '결제 수단을 선택해 주세요', orderType)}
    <div class="payment-total total"><span>TOTAL</span><strong>${money(total)}<small>원</small></strong></div>
    <div class="payment-methods">${[['card','CARD','카드 결제',cardIcon],['easy','EASY PAY','간편 결제',phoneIcon]].map(([method,en,ko,icon]) => `<button data-action="pay" data-method="${method}" ${pending ? 'disabled' : ''}>${icon}<span><strong>${en}</strong><small>${ko}</small></span><span class="arrow" aria-hidden="true">↗</span></button>`).join('')}</div>
    <p class="payment-note">실제 청구가 없는 가상 결제입니다.</p><label class="simulate"><input type="checkbox" id="fail-payment" ${pending ? 'disabled' : ''}> 이번 결제 실패 체험</label>
    <div class="feedback ${error ? 'error' : ''}" role="status">${pending ? '<span class="spinner"></span> 결제를 진행하고 있습니다…' : escape(error)}</div></section>
    <footer class="bottom-bar"><div class="actions"><button data-action="back-cart" ${pending ? 'disabled' : ''}>이전</button></div></footer>`;
}
export function completeView(order, orderType, seconds) {
  return `<header class="topbar"><span class="wordmark">SUPER MATCHA</span></header><section class="complete screen"><div><h1 tabindex="-1">THANK YOU</h1><p>주문이 완료되었습니다 · ${orderType}</p></div><div class="order-number"><span>ORDER NO.</span><strong>${order.orderNo}</strong></div>${order.earned ? `<div class="completion-reward"><span>적립이 완료되었습니다</span><strong>+${money(order.earned)}원</strong><small>누적 적립금 ${money(order.balance)}원</small></div>` : ''}<p class="pickup">주문번호가 호출되면 음료를 받아 가세요.<br><span id="countdown">${seconds}</span>초 후 처음 화면으로 돌아갑니다.</p></section><footer class="bottom-bar complete-footer"><div class="actions"><button data-action="finish">확인</button></div></footer>`;
}
export function rewardsView(rewards, total) {
  const formatted = rewards.phone.replace(/^(\d{3})(\d{0,4})(\d{0,4})$/, (_, a, b, c) => a + (b ? '-' + b : '') + (c ? '-' + c : ''));
  return `${header()}<section class="page-content scroll-area">${title('REWARDS', '결제금액의 2%를 적립해 드려요')}
    <div class="consent-panel"><strong>개인정보 수집·이용 동의</strong><p>수집 항목: 휴대전화번호, 적립 금액<br>이용 목적: 적립 내역 조회 및 적립<br>보관: 이 브라우저의 데이터 삭제 시까지<br>동의를 거부해도 적립 없이 주문할 수 있습니다.</p><label><input id="consent" type="checkbox" ${rewards.consent ? 'checked' : ''}> 위 내용에 동의합니다</label></div>
    <label class="sr-only" for="phone">적립할 휴대전화번호</label><input id="phone" class="phone-input" type="tel" inputmode="numeric" autocomplete="off" maxlength="13" placeholder="010-0000-0000" value="${formatted}" ${rewards.consent ? '' : 'disabled'} aria-describedby="phone-help"><p id="phone-help" class="phone-help">010으로 시작하는 11자리 번호</p>
    <div class="keypad">${['1','2','3','4','5','6','7','8','9','010','0','지우기','전체 삭제'].map(key => `<button data-action="key" data-key="${key}" ${rewards.consent && (key !== '010' || !rewards.phone) ? '' : 'disabled'} class="${key === '전체 삭제' ? 'clear-key text-key' : key === '지우기' ? 'text-key' : ''}">${key}</button>`).join('')}</div>
    ${rewards.balance !== null ? `<div class="reward-balance"><span>현재 적립금</span><strong>${money(rewards.balance)}원</strong></div><div class="expected-reward"><span>이번 주문 적립 예정</span><strong>+${money(Math.floor(total / 50))}원</strong></div>` : ''}
    <div class="feedback ${rewards.error ? 'error' : ''}" role="status">${escape(rewards.error)}</div></section>
    <footer class="bottom-bar"><div class="actions"><button data-action="skip-rewards">건너뛰기</button><button class="primary" data-action="${rewards.balance === null ? 'lookup-rewards' : 'next-payment'}" ${rewards.consent ? '' : 'disabled'}>${rewards.balance === null ? '적립 조회' : '다음'}</button></div></footer>`;
}
export function replaceMarkup(container, markup) {
  const active = container.ownerDocument?.activeElement;
  const owned = active && container.contains(active);
  const id = owned ? active.id : '';
  const data = owned ? { ...active.dataset } : null;
  container.innerHTML = markup;
  if (!owned) return;
  const controls = [...container.querySelectorAll('button, input')].filter(control => !control.disabled);
  const match = controls.find(control => id ? control.id === id : data?.action && Object.keys(data).every(key => control.dataset[key] === data[key]));
  const fallback = data?.action?.endsWith('quantity') && controls.find(control => control.dataset.action === data.action && control.dataset.index === data.index);
  (match || fallback)?.focus();
}
