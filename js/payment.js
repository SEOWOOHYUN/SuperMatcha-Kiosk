export const payProviders = { kakao: {name:'카카오페이', label:'kakao pay'}, toss: {name:'토스페이', label:'toss pay'}, naver: {name:'네이버페이', label:'N pay'} };
export class PaymentModel {
  pending = false;
  async pay(method, total, fail = false, provider = '') {
    if (!['card', 'easy'].includes(method) || !Number.isSafeInteger(total) || total <= 0) throw new Error('결제 수단과 주문 금액을 확인해 주세요.');
    if (method === 'easy' && !Object.hasOwn(payProviders, provider)) throw new Error('간편결제 서비스를 선택해 주세요.');
    if (this.pending) throw new Error('이미 결제가 진행 중입니다.');
    this.pending = true;
    try {
      // shortcut: simulated authorization only; replace with a server-verified PG flow for real payments.
      await new Promise(resolve => setTimeout(resolve, 1200));
      return !fail;
    } finally { this.pending = false; }
  }
}
