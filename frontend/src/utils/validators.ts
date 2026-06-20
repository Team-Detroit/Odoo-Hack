export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

export const validateUpiId = (upiId: string): boolean => {
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/;
  return upiRegex.test(upiId);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 number
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
};

export const validateCouponCode = (code: string): boolean => {
  // Alphanumeric, 3-20 characters
  const codeRegex = /^[A-Z0-9]{3,20}$/;
  return codeRegex.test(code);
};

export const validateTableNumber = (tableNum: number): boolean => {
  return tableNum > 0 && tableNum <= 999;
};

export const validateNumberOfSeats = (seats: number): boolean => {
  return seats > 0 && seats <= 50;
};
