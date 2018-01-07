export class Transaction {

  constructor(transaction: Transaction) {
    this.amount = transaction.amount;
    this.type = transaction.type;
    this.createdAt = new Date(transaction.createdAt);
    this.currency = transaction.currency;
  }


  id: string;
  index: string;
  currency: string;
  amount: string;
  fee: string;
  networkFee: string;
  address: string;
  paymentId: string;
  hash: string;
  status: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}
