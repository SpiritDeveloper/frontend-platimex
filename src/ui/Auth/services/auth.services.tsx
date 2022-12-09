import {
  loginWithEmailAndPassword,
  getUser,
  registerWithEmailAndPassword,
} from '../api/login';

import {
  UserResponse,
  LoginCredentialsDTO,
  RegisterCredentialsDTO,
} from '../types';

import storage from '../../../utils/storage';

async function handleUserResponse(data: UserResponse): Promise<boolean> {
  const { success, payload } = data;
  if (success) {
    storage.setToken(payload.token);
  }
  return success;
}

export async function loadUser() {
  if (await storage.getToken()) {
    const data = await getUser();
    return data;
  }
  return null;
}

export async function login(data: LoginCredentialsDTO) {
  const response = await loginWithEmailAndPassword(data);
  const user = await handleUserResponse(response);
  return user;
}

export async function register(data: RegisterCredentialsDTO) {
  const response = await registerWithEmailAndPassword(data);
  const user = await handleUserResponse(response);
  return user;
}

export async function logout() {
  storage.clearToken();
  window.location.assign(window.location.origin as unknown as string);
}
