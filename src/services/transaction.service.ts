import api from './api';

export interface TransferPayload {
  receiverEmail: string;
  amount: number;
  description?: string;
}

export interface DepositPayload {
  amount: number;
  description?: string;
}

export interface TransactionParticipant {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
}

export interface LedgerTransaction {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  currency: 'XOF';
  description: string | null;
  status: 'completed' | 'pending' | 'failed';
  transactionKind?: 'transfer' | 'deposit' | string;
  hash: string;
  signature: string;
  createdAt: string;
  sender: TransactionParticipant;
  receiver: TransactionParticipant;
  direction: 'sent' | 'received';
  counterparty: TransactionParticipant;
}

export interface TransferResponse {
  message: string;
  transaction: LedgerTransaction;
  balances: {
    sender: number;
    receiver: number;
  };
  recipient: TransactionParticipant;
}

export interface DepositResponse {
  message: string;
  transaction: LedgerTransaction;
  balances: {
    user: number;
  };
}

export interface TransactionListResponse {
  transactions: LedgerTransaction[];
}

const buildDisplayName = (firstName: string, lastName: string) => `${firstName} ${lastName}`.trim();

const normalizeParticipant = (participant: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}) => ({
  ...participant,
  displayName: buildDisplayName(participant.firstName, participant.lastName),
});

const normalizeTransaction = (transaction: LedgerTransaction): LedgerTransaction => ({
  ...transaction,
  amount: Number(transaction.amount),
  sender: normalizeParticipant(transaction.sender),
  receiver: normalizeParticipant(transaction.receiver),
  counterparty: normalizeParticipant(transaction.counterparty),
});

const TransactionService = {
  async transfer(payload: TransferPayload) {
    const response = await api.post('/transactions/transfer', payload);
    const data = response.data as TransferResponse;
    return {
      ...data,
      transaction: normalizeTransaction(data.transaction),
      recipient: normalizeParticipant(data.recipient),
    };
  },

  async deposit(payload: DepositPayload) {
    const response = await api.post('/transactions/deposit', payload);
    const data = response.data as DepositResponse;
    return {
      ...data,
      transaction: normalizeTransaction(data.transaction),
    };
  },

  async list() {
    const response = await api.get('/transactions');
    const data = response.data as TransactionListResponse;
    return (data.transactions || []).map(normalizeTransaction);
  },

  async getById(id: string) {
    const response = await api.get(`/transactions/${id}`);
    const transaction = (response.data?.transaction || response.data) as LedgerTransaction;
    return normalizeTransaction(transaction);
  },
};

export default TransactionService;
