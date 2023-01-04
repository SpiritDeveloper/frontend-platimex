import { axios } from '../../../lib/axios';

export const getAllTransactions = (): Promise<any> => {
  return axios.get('/transactions/get-transactions', {});
};

export const unassignTransaction = (uuid: string): Promise<any> => {
  return axios.post('/transactions/unassign-agent', {
    id: uuid,
  });
};

export const assignedTransaction = (
  uuid: string,
  name: string,
  area: string
): Promise<any> => {
  return axios.post('/transactions/assign-agent-to-transaction', {
    id: uuid,
    agentName: name,
    assignedArea: area,
  });
};

export const me = (): Promise<any> => {
  return axios.get('/users/me', {});
};
