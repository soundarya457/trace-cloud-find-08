
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Category, Item, Message, DashboardStats } from '@/types';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

interface DataContextValue {
  categories: Category[];
  items: Item[];
  messages: Message[];
  stats: DashboardStats;
  loading: boolean;
  addCategory: (category: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, updates: TablesUpdate<'categories'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addItem: (item: Omit<Item, "id">) => Promise<void>;
  updateItem: (id: string, updates: TablesUpdate<'items'>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addMessage: (message: Omit<Message, "id" | "date" | "is_read">) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  markMessageAsRead: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Calculate dashboard stats based on current data
  const stats: DashboardStats = {
    totalLostItems: items.filter(item => item.status === 'lost').length,
    totalFoundItems: items.filter(item => item.status === 'found').length,
    totalClaimedItems: items.filter(item => item.status === 'claimed').length,
    totalPendingItems: items.filter(item => ['lost', 'found'].includes(item.status)).length,
    totalMessages: messages.length,
    activeCategories: categories.filter(cat => cat.is_active).length,
    inactiveCategories: categories.filter(cat => !cat.is_active).length,
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('created_at', { ascending: false });

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        const { data: itemsData, error: itemsError } = await supabase
          .from('items')
          .select('*')
          .order('created_at', { ascending: false });

        if (itemsError) throw itemsError;
        setItems(itemsData || []);

        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (messagesError) throw messagesError;
        setMessages(messagesData || []);

      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addCategory = async (category: Omit<Category, "id">) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: category.name,
          description: category.description,
          is_active: category.is_active
        }])
        .select('*')
        .single();

      if (error) throw error;
      setCategories(prev => [...prev, data as Category]);
    } catch (error: any) {
      console.error('Error adding category:', error.message);
    }
  };

  const updateCategory = async (id: string, updates: TablesUpdate<'categories'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      setCategories(prev => prev.map(cat => (cat.id === id ? { ...cat, ...data } : cat)));
    } catch (error: any) {
      console.error('Error updating category:', error.message);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (error: any) {
      console.error('Error deleting category:', error.message);
    }
  };

  const addItem = async (item: Omit<Item, "id">) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .insert([{
          title: item.title,
          description: item.description,
          category: item.category,
          status: item.status,
          date: item.date,
          location: item.location,
          image: item.image,
          contact_email: item.contact_email,
          created_by: item.created_by,
        }])
        .select('*')
        .single();

      if (error) throw error;
      setItems(prev => [...prev, data as Item]);
    } catch (error: any) {
      console.error('Error adding item:', error.message);
    }
  };

  const updateItem = async (id: string, updates: TablesUpdate<'items'>) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      setItems(prev => prev.map(item => (item.id === id ? { ...item, ...data } : item)));
    } catch (error: any) {
      console.error('Error updating item:', error.message);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error: any) {
      console.error('Error deleting item:', error.message);
    }
  };

  const addMessage = async (message: Omit<Message, "id" | "date" | "is_read">) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          name: message.name,
          email: message.email,
          subject: message.subject,
          message: message.message,
        }])
        .select('*')
        .single();

      if (error) throw error;
      
      setMessages(prev => [...prev, data as Message]);
      
      return;
    } catch (error: any) {
      console.error('Error adding message:', error.message);
      throw error;
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessages(prev => prev.filter(message => message.id !== id));
    } catch (error: any) {
      console.error('Error deleting message:', error.message);
    }
  };

  const markMessageAsRead = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      setMessages(prev => prev.map(message => (message.id === id ? { ...message, ...data } : message)));
    } catch (error: any) {
      console.error('Error marking message as read:', error.message);
    }
  };

  const value: DataContextValue = {
    categories,
    items,
    messages,
    stats,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    addItem,
    updateItem,
    deleteItem,
    addMessage,
    deleteMessage,
    markMessageAsRead,
  };

  return (
    <DataContext.Provider value={value}>
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
