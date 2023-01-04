import { getUsers, createUser, updateUser } from '../api/user';

interface newUser {
  uuid: string;
  name: string;
  email: string;
  password: string;
  area: string;
}

export async function Getusers() {
  const users = await getUsers();
  return users.payload;
}

export async function createNewUser(user: newUser) {
  const userRegister = await createUser(user);
  return userRegister.id;
}

export async function updateRegisterUser(update: newUser) {
  const userUpdate = await updateUser(update);
  return userUpdate.payload.id;
}
