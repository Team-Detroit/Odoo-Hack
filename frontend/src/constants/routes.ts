export const ROUTES = {
  // Auth
  LOGIN: '/login',
  SIGNUP: '/signup',
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_PAYMENT_METHODS: '/admin/payment-methods',
  ADMIN_FLOORS: '/admin/floors',
  ADMIN_COUPONS: '/admin/coupons',
  ADMIN_PROMOTIONS: '/admin/promotions',
  ADMIN_USERS: '/admin/users',
  ADMIN_SELF_ORDERING: '/admin/self-ordering',
  ADMIN_REPORTS: '/admin/reports',
  
  // POS
  POS: '/pos',
  POS_ORDERS: '/pos/orders',
  POS_ORDERS_DETAIL: '/pos/orders/:id',
  POS_PAYMENTS: '/pos/payments',
  POS_TABLE_VIEW: '/pos/table-view',
  POS_CUSTOMERS: '/pos/customers',
  
  // KDS
  KDS: '/kds',
  
  // Customer Display
  CUSTOMER_DISPLAY: '/customer-display',
  
  // Self Ordering
  SELF_ORDER: '/s/:token',
  QR_MENU: '/qr/:token',
};

export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user';
