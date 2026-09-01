export type UserRole = 'SUPERADMIN' | 'MARKETING' | 'BRANCH_MANAGER' | 'BACKOFFICE';

export type LoanStatus =
  | 'SUBMITTED'
  | 'NEED_ADDITIONAL_DATA'
  | 'REJECTED_BY_MARKETING'
  | 'REVIEWED'
  | 'APPROVED_BY_BM'
  | 'APPROVED_WITH_DOWNGRADE'
  | 'CANCELLED_BY_CUSTOMER'
  | 'REJECTED_BY_BM'
  | 'DISBURSEMENT_PROCESS'
  | 'DISBURSED';

export interface TierOption {
  tierLevel: number;
  amount: number;
}

export interface DocumentItem {
  id: number;
  documentType: string;
  documentName: string;
  documentUrl: string;
  uploadedAt: string;
}

export interface LoanApplicationItem {
  id: number;
  loanApplicationNo: string;
  branchCode: string;
  branchName: string;
  customerName: string;
  customerNik: string;
  occupation: string;
  monthlyIncome: number;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  productName: string;
  tenorMonths: number;
  tierOptions: TierOption[];
  requestedTierLevel: number;
  requestedAmount: number;
  approvedTierLevel?: number;
  approvedAmount?: number;
  statusCode: LoanStatus;
  statusName: string;
  createdAt: string;
  marketingNotes?: string;
  marketingReviewerName?: string;
  bmNotes?: string;
  downgradeReason?: string;
  disbursementRefNo?: string;
  documents: DocumentItem[];
}
