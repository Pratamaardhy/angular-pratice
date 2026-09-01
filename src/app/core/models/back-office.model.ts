import { DocumentItem } from './marketing.model';

export type BackOfficeActionType = 'VERIFY_ACCOUNT' | 'CORRECT_ACCOUNT' | 'DISBURSE';

export interface BackOfficeLoanItem {
  id: number;
  loanApplicationNo: string;
  customerName: string;
  customerNik: string;
  productName: string;
  amount: number;
  tenorMonths: number;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  statusCode: 'APPROVED_BY_BM' | 'NEED_ACCOUNT_CORRECTION' | 'DISBURSEMENT_PROCESS';
  statusName: string;
  bmApprovalNotes: string;
  bmApprovedAt: string;
  createdAt: string;
  documents: DocumentItem[];
}
