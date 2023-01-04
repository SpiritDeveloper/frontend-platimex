import { axios } from '../../../lib/axios';

interface newUser {
  uuid: string;
  name: string;
  email: string;
  password: string;
  area: string;
}

export const createUser = (user: newUser): Promise<any> => {
  return axios.post('/users/create', {
    email: user.email,
    password: user.password,
    profile_picture: '',
    region: user.area,
    name: user.name,
    position: '952c7333-8a57-4797-89c3-60f6d5743348',
  });
};

export const updateUser = (user: newUser): Promise<any> => {
  return axios.put('/users/update', {
    id: user.uuid,
    email: user.email,
    password: user.password,
    name: user.name,
  });
};

export const getUsers = (): Promise<any> => {
  return axios.get('/users/getAll', {});
};
