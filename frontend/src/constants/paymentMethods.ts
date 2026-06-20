export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  UPI: 'upi',
} as const;

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'Cash',
  card: 'Card / Digital',
  upi: 'UPI',
};

export const PAYMENT_METHOD_COLORS: Record<string, string> = {
  cash: 'bg-green-100 text-green-800',
  card: 'bg-blue-100 text-blue-800',
  upi: 'bg-orange-100 text-orange-800',
};
