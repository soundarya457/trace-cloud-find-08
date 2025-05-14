
import React, { createContext, useContext } from 'react';
import { Category, Item, Message, DashboardStats } from '@/types';
import { TablesUpdate } from '@/integrations/supabase/types';
import { useDataFetching } from '@/hooks/useDataFetching';

interface DataContextValue {
  categories: Category[];
  items: Item[];
  messages: Message[];
  stats: DashboardStats;
  loading: boolean;
  addCategory: (category: Omit<Category, "id" | "created_at">) => Promise<void>;
  updateCategory: (id: string, updates: TablesUpdate<'categories'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addItem: (item: Omit<Item, "id" | "created_at">) => Promise<void>;
  updateItem: (id: string, updates: TablesUpdate<'items'>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addMessage: (message: Omit<Message, "id" | "date" | "created_at" | "is_read">) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  markMessageAsRead: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const data = useDataFetching();

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
