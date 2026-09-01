export type MarketingActionType = 'APPROVE' | 'REJECT' | 'REQUEST_ADDITIONAL_DATA';

export interface DocumentItem {
  id: number;
  documentType: 'KTP' | 'NPWP' | 'SLIP_GAJI' | 'FOTO_USAHA';
  documentName: string;
  documentUrl: string;
  uploadedAt: string;
}

export interface MarketingLoanItem {
  id: number;
  loanApplicationNo: string;
  customerName: string;
  customerNik: string;
  birthPlace: string;
  birthDate: string;
  gender: 'L' | 'P';
  maritalStatus: 'Belum Menikah' | 'Menikah' | 'Cerai';
  occupation: string;
  monthlyIncome: number;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  productName: string;
  amount: number;
  tenorMonths: number;
  statusCode: 'SUBMITTED' | 'IN_REVIEW' | 'NEED_ADDITIONAL_DATA';
  statusName: string;
  createdAt: string;
  documents: DocumentItem[];
  notes?: string;
}
