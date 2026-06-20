export interface SignupDto {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'EMPLOYEE';
}
