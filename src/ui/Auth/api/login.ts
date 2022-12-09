import { axios } from '../../../lib/axios';

import {
  UserResponse,
  AuthUser,
  LoginCredentialsDTO,
  RegisterCredentialsDTO,
} from '../types';

export const loginWithEmailAndPassword = (
  data: LoginCredentialsDTO
): Promise<UserResponse> => {
  return axios.post('/users/sigIn', data);
};

export const getUser = (): Promise<AuthUser> => {
  return axios.get('/auth/me');
};

export const registerWithEmailAndPassword = (
  data: RegisterCredentialsDTO
): Promise<UserResponse> => {
  return axios.post('/auth/register', data);
};
