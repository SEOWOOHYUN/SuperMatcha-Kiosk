export const STORAGE_KEY = 'supermatcha_kiosk_v1';
export function readState(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return { lastOrderNo: 0, rewards: {} };
    const state = JSON.parse(raw);
    if (!state || !Number.isSafeInteger(state.lastOrderNo) || state.lastOrderNo < 0 || !state.rewards || typeof state.rewards !== 'object' || Array.isArray(state.rewards)) throw Error();
    for (const [phone, balance] of Object.entries(state.rewards)) {
      if (!/^010\d{8}$/.test(phone) || !Number.isSafeInteger(balance) || balance < 0) throw Error();
    }
    return state;
  } catch { throw new Error('저장된 주문·적립 정보를 읽을 수 없습니다. 직원에게 문의해 주세요.'); }
}
export class OrderModel {
  constructor(storage) { this.storage = storage; }
  complete(total) {
    if (!Number.isSafeInteger(total) || total <= 0) throw new Error('주문 금액을 확인해 주세요.');
    const state = readState(this.storage);
    const orderNo = state.lastOrderNo + 1;
    if (!Number.isSafeInteger(orderNo)) throw new Error('주문번호를 발급할 수 없습니다. 직원에게 문의해 주세요.');
    state.lastOrderNo = orderNo;
    try { this.storage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { throw new Error('주문을 저장하지 못했습니다. 저장 공간을 확인한 후 다시 시도해 주세요.'); }
    return { orderNo, total };
  }
}
