export function validateEnrollment(phone, consent) {
  if (consent !== true) throw new Error('개인정보 수집·이용에 동의해 주세요.');
  if (!/^010\d{8}$/.test(phone)) throw new Error('010으로 시작하는 전화번호 11자리를 입력해 주세요.');
}
export function rewardAmount(total) {
  if (!Number.isSafeInteger(total) || total <= 0) throw new Error('적립 금액을 확인해 주세요.');
  return Math.floor(total / 50);
}
export class StampModel {
  lookup(state, phone, consent) {
    validateEnrollment(phone, consent);
    return state.rewards[phone] ?? 0;
  }
}
export function editPhone(phone, key) {
  if (key === '전체 삭제') return '';
  if (key === '지우기') return phone.slice(0, -1);
  if (key === '010') return phone || '010';
  return /^\d$/.test(key) ? (phone + key).slice(0, 11) : phone;
}
