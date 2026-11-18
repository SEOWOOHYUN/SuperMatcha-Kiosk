export class PaymentModel {
  pending = false;
  async pay(method, total, fail = false) {
    if (!['card', 'easy'].includes(method) || !Number.isSafeInteger(total) || total <= 0) throw new Error('결제 수단과 주문 금액을 확인해 주세요.');
    if (this.pending) throw new Error('이미 결제가 진행 중입니다.');
    this.pending = true;
    try {
      // shortcut: simulated authorization only; replace with a server-verified PG flow for real payments.
      await new Promise(resolve => setTimeout(resolve, 1200));
      return !fail;
    } finally { this.pending = false; }
  }
}
