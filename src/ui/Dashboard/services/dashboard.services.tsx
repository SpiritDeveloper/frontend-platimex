import {
  getAllTransactions,
  unassignTransaction,
  assignedTransaction,
  me,
} from '../api/dashboard';

export async function getTransactions() {
  const transactions = await getAllTransactions();
  return transactions;
}

export async function unassign(uuid: string) {
  const response = await unassignTransaction(uuid);
  return response.success;
}

export async function assigned(uuid: string, name: string, area: string) {
  const response = await assignedTransaction(uuid, name, area);
  return response.success;
}

export async function who_i_am() {
  const response = await me();
  return response.payload;
}
