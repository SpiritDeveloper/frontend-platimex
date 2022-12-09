import { axios } from '../../../lib/axios';

export const loginWithEmailAndPassword = (data: any): Promise<any> => {
  return axios.post('/users/sigIn', data);
};

export const getUser = (): Promise<any> => {
  return axios.get('/auth/me');
};

export const registerWithEmailAndPassword = (data: any): Promise<any> => {
  return axios.post('/auth/register', data);
};
