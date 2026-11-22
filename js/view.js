import { categoryNames } from './menu-data.js';
import { payProviders } from './payment.js';
import { itemPrice } from './cart.js';
export const money = value => value.toLocaleString('ko-KR');
export const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const picture = (menu, className = '') => `<img class="product-photo ${className}" src="${menu.image}" alt="${escape(menu.name)}" referrerpolicy="no-referrer">`;
export const header = () => `<header class="topbar"><span class="wordmark">SUPER MATCHA</span><button class="home" data-action="home">처음으로</button></header>`;
export const title = (en, ko, orderType = '') => `<div class="page-title"><h1 tabindex="-1">${en}</h1>${orderType ? `<span class="badge">${orderType}</span>` : ''}<p>${ko}</p></div>`;
export function startView() {
  return `<section class="start screen"><h1 class="start-logo" aria-label="SUPER MATCHA">SUPER<br>MATCHA</h1>
    <div class="start-bottom"><p>이용 방법을 선택해 주세요</p>
    <div class="actions"><button data-action="start" data-type="먹고 가기">먹고 가기<span>EAT IN</span></button><button data-action="start" data-type="포장하기">포장하기<span>TAKE OUT</span></button></div>
    </div></section>`;
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
    <label class="simulate"><input type="checkbox" id="fail-payment" ${pending ? 'disabled' : ''}> 이번 결제 실패 체험</label>
    <div class="feedback ${error ? 'error' : ''}" role="status">${pending ? '<span class="spinner"></span> 결제를 진행하고 있습니다…' : escape(error)}</div></section>
    <footer class="bottom-bar"><div class="actions"><button data-action="back-cart" ${pending ? 'disabled' : ''}>이전</button></div></footer>`;
}
const receiptIcon = (short = false) => `<svg viewBox="0 0 80 90" aria-hidden="true"><path d="M15 5h50v75l-8-5-8 5-9-5-8 5-8-5-9 5z" fill="#eee" stroke="currentColor" stroke-width="3"/><path d="M26 24h28M26 33h28" stroke="currentColor" stroke-width="3"/>${short ? '<text x="40" y="61" text-anchor="middle" font-size="25" font-weight="900" fill="#111">23</text>' : '<path d="M26 45h28M26 55h18M26 65h28" stroke="currentColor" stroke-width="3"/>'}</svg>`;
export function completeView(order, orderType, seconds) {
  return `<header class="topbar"><span class="wordmark">SUPER MATCHA</span></header><section class="complete screen success-content"><div><span class="result-mark" aria-hidden="true">✓</span><h1 tabindex="-1">결제 완료</h1><p>주문이 완료되었습니다 · ${orderType}</p></div><div class="order-number"><span>ORDER NO. · 주문번호</span><strong>${order.orderNo}</strong></div>${order.earned ? `<div class="completion-reward"><span>적립이 완료되었습니다</span><strong>+${money(order.earned)}원</strong><small>누적 적립금 ${money(order.balance)}원</small></div>` : ''}<p class="pickup">${order.method === '카드 결제' ? '카드를 챙겨 주세요.<br>' : ''}주문번호가 호출되면 음료를 받아 가세요.</p></section><footer class="bottom-bar complete-footer"><p class="receipt-question">어떤 내역을 받으시겠어요?</p><div class="actions receipt-actions"><button data-action="receipt" data-kind="full">${receiptIcon()}<span>영수증 받기</span></button><button data-action="receipt" data-kind="number">${receiptIcon(true)}<span>주문번호만 받기</span></button></div><p class="pickup countdown-note"><span id="countdown">${seconds}</span>초 후 처음 화면으로 돌아갑니다.</p></footer>`;
}
export function receiptView(order, orderType, kind) {
  const full = kind === 'full';
  return `<header class="topbar"><span class="wordmark">SUPER MATCHA</span></header><section class="page-content scroll-area receipt-content">${title(full ? 'RECEIPT' : 'ORDER TICKET', full ? '영수증' : '주문번호표')}<article class="paper-ticket"><span class="wordmark">SUPER MATCHA</span><p>${orderType}</p><span>주문번호</span><strong class="ticket-number">${order.orderNo}</strong>${full ? `<div class="receipt-items">${order.items.map(item => `<div><p>${escape(item.menu.name)} × ${item.quantity}<small>${escape(Object.values(item.selected).join(' · '))}</small></p><strong>${money(itemPrice(item))}원</strong></div>`).join('')}</div><div class="receipt-total"><span>결제 금액</span><strong>${money(order.total)}원</strong></div><p class="receipt-method">${order.method}</p>${order.earned ? `<p>이번 주문 적립 +${money(order.earned)}원</p>` : ''}` : ''}<p class="ticket-thanks">주문번호가 호출되면 음료를 받아 가세요.<br>감사합니다.</p></article></section><footer class="bottom-bar"><p class="pickup countdown-note"><span id="countdown">10</span>초 후 처음 화면으로 돌아갑니다.</p><div class="actions"><button class="primary" data-action="finish">확인</button></div></footer>`;
}
export function cardView(total, pending) {
  return `${header()}<section class="page-content scroll-area scan-content">${title('INSERT CARD', '신용카드를 투입구에 넣어 주세요')}<svg class="card-guide" viewBox="0 0 320 340" role="img" aria-label="IC칩이 보이는 카드의 칩 쪽을 아래 카드 투입구에 넣는 그림"><rect x="30" y="220" width="260" height="100" rx="18" fill="#dce2da" stroke="#111" stroke-width="4"/><rect x="65" y="240" width="190" height="13" rx="6" fill="#111"/><rect x="92" y="35" width="136" height="200" rx="12" fill="#03bd5a" stroke="#111" stroke-width="4"/><text x="111" y="72" font-family="Arial,sans-serif" font-weight="900" font-size="15">CREDIT CARD</text><rect x="138" y="175" width="44" height="34" rx="5" fill="#ead296" stroke="#111" stroke-width="2"/><path d="M152 175v34m16-34v34m-30-23h44m-44 12h44" stroke="#111" stroke-width="1.5"/><path d="M266 117v67m-13-13 13 14 13-14" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><text x="160" y="288" text-anchor="middle" font-size="15" font-weight="bold">IC CARD</text></svg><p class="scan-instruction">IC칩이 위로 보이도록<br>칩이 있는 쪽부터 끝까지 넣어 주세요.</p><p class="payment-note">결제가 끝날 때까지 카드를 빼지 마세요.</p><div class="feedback" role="status">${pending ? '<span class="spinner"></span> 카드를 확인하고 있습니다…' : '카드 삽입을 기다리고 있습니다.'}</div></section><footer class="bottom-bar"><div class="total"><span>TOTAL</span><strong>${money(total)}<small>원</small></strong></div><div class="actions"><button data-action="back-payment" ${pending ? 'disabled' : ''}>이전</button><button class="primary" data-action="card-pay" ${pending ? 'disabled' : ''}>카드 삽입 완료</button></div></footer>`;
}
export function failureView(error, heading = '결제 실패') {
  return `${header()}<section class="page-content failure-content"><span class="result-mark failure-mark" aria-hidden="true">!</span><p class="failure-en">PLEASE TRY AGAIN</p><h1 tabindex="-1">${heading}</h1><p role="alert">${escape(error)}</p><p class="failure-help">담아두신 메뉴는 그대로 유지됩니다.</p></section><footer class="bottom-bar"><div class="actions"><button data-action="back-payment">다른 결제 수단</button><button class="primary" data-action="retry-payment">다시 시도</button></div></footer>`;
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
  if (match || fallback) (match || fallback).focus();
}
export function providersView(total, orderType) {
  return `${header()}<section class="page-content scroll-area">${title('EASY PAY', '사용하실 간편결제를 선택해 주세요', orderType)}
    <div class="payment-total total"><span>TOTAL</span><strong>${money(total)}<small>원</small></strong></div>
    <div class="provider-list">${Object.entries(payProviders).map(([id, provider]) => `<button data-action="provider" data-provider="${id}"><span class="provider-logo ${id}">${provider.label}</span><span>${provider.name}</span><span class="arrow" aria-hidden="true">↗</span></button>`).join('')}</div>
    <p class="payment-note">휴대전화에서 선택한 앱의 결제 바코드를 준비해 주세요.</p></section>
    <footer class="bottom-bar"><div class="actions"><button data-action="back-payment">이전</button></div></footer>`;
}
export function barcodeView(provider, total, pending, error = '') {
  const service = payProviders[provider];
  return `${header()}<section class="page-content scroll-area scan-content">${title('SCAN & PAY', `${service.name} 결제 바코드를 스캔해 주세요`)}
    <span class="provider-logo ${provider}">${service.label}</span>
    <div class="scanner" aria-label="결제 바코드 스캔 안내"><div class="scan-phone"><span class="phone-camera"></span><span class="scan-app">${service.label}</span><svg viewBox="0 0 150 70" role="img" aria-label="예시 바코드"><path fill="currentColor" d="M3 5h3v60H3z M10 5h6v60h-6z M21 5h2v60h-2z M27 5h8v60h-8z M40 5h3v60h-3z M47 5h2v60h-2z M54 5h7v60h-7z M66 5h3v60h-3z M74 5h6v60h-6z M84 5h2v60h-2z M91 5h8v60h-8z M104 5h3v60h-3z M113 5h6v60h-6z M124 5h2v60h-2z M132 5h4v60h-4z M141 5h6v60h-6z"/></svg><span class="scan-demo">DEMO</span></div><span class="scan-line"></span></div>
    <p class="scan-instruction">휴대전화의 화면 밝기를 높이고<br>결제 바코드를 리더기에 대 주세요.</p>
    <div class="feedback ${error ? 'error' : ''}" role="status">${pending ? '<span class="spinner"></span> 바코드를 확인하고 있습니다…' : escape(error) || '바코드 스캔 대기 중'}</div>
    <p class="payment-note">체험 화면입니다. 아래 버튼으로 스캔 완료를 체험할 수 있습니다.</p></section>
    <footer class="bottom-bar"><div class="total"><span>TOTAL</span><strong>${money(total)}<small>원</small></strong></div><div class="actions"><button data-action="back-providers" ${pending ? 'disabled' : ''}>이전</button><button class="primary" data-action="scan-pay" data-method="easy" ${pending ? 'disabled' : ''}>스캔 완료 체험</button></div></footer>`;
}
