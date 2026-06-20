export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  employee: 'Employee / Cashier',
};

export const ROLE_DESCRIPTIONS: Record<string, string> = {
  admin: 'Full access to configuration and reports',
  employee: 'POS terminal access only',
};
