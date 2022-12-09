export type AuthUser = {
  token: string;
};

export type UserResponse = {
  success: boolean;
  message: string;
  payload: AuthUser;
};

export type State = {
  email: string;
  password: string;
  showPassword: boolean;
};

export type LoginCredentialsDTO = {
  email: string;
  password: string;
};

export type RegisterCredentialsDTO = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
