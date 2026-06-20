export interface CreateUserRequest {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'employee';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'admin' | 'employee';
  password?: string;
}
