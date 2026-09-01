export type LoanStatus =
  | 'SUBMITTED'
  | 'NEED_ADDITIONAL_DATA'
  | 'REJECTED_BY_MARKETING'
  | 'REVIEWED'
  | 'APPROVED_BY_BM'
  | 'APPROVED_WITH_DOWNGRADE'
  | 'CANCELLED_BY_CUSTOMER'
  | 'REJECTED_BY_BM'
  | 'DISBURSED';

export interface TierOption {
  tierLevel: number; // 1, 2, atau 3
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
  branchCode: string; // 'JAKARTA'
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
  // 3 Opsi Plafond
  tierOptions: TierOption[];
  requestedTierLevel: number; // Tier yang dipilih nasabah (1, 2, atau 3)
  requestedAmount: number;
  approvedTierLevel?: number; // Tier yang disetujui BM
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
