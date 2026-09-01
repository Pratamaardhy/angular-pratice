export type BmActionType = 'APPROVE' | 'REJECT';

export interface BmLoanItem {
  id: number;
  loanApplicationNo: string;
  customerName: string;
  customerNik: string;
  productName: string;
  amount: number;
  tenorMonths: number;
  statusCode: 'REVIEWED';
  statusName: string;
  marketingNotes: string;
  marketingReviewerName: string;
  monthlyIncome: number;
  occupation: string;
  createdAt: string;
}
