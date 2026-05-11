import { create } from 'zustand';
import { mockUser, mockWallet, mockTransactions, mockLogs } from '@/mock/data';

interface AppState {
  wallet: typeof mockWallet | null;
  transactions: typeof mockTransactions;
  logs: typeof mockLogs;
  addTransaction: (tx: any) => void;
  loadData: () => void;
  clearData: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  wallet: mockWallet,
  transactions: mockTransactions,
  logs: mockLogs,
  
  addTransaction: (tx) => {
    set((state) => ({ transactions: [tx, ...state.transactions] }));
  },

  loadData: () => {
    set({ wallet: mockWallet, transactions: mockTransactions, logs: mockLogs });
  },

  clearData: () => {
    set({ wallet: null, transactions: [], logs: [] });
  }
}));
