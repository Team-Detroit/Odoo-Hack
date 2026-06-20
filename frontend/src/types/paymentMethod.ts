export type PaymentMethodType = 'cash' | 'card' | 'upi';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  isEnabled: boolean;
  upiId?: string; // for UPI method
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePaymentMethodRequest {
  type: PaymentMethodType;
  isEnabled: boolean;
  upiId?: string;
}
