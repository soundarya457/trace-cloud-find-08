
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, Category, Message, DashboardStats } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface DataContextProps {
  items: Item[];
  categories: Category[];
  messages: Message[];
  stats: DashboardStats;
  addItem: (item: Omit<Item, 'id'>) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  addMessage: (message: Omit<Message, 'id' | 'date' | 'isRead'>) => Promise<void>;
  updateItem: (id: string, item: Partial<Item>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  markMessageAsRead: (id: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Calculate dashboard stats
  const [stats, setStats] = useState<DashboardStats>({
    totalLostItems: 0,
    totalFoundItems: 0,
    totalClaimedItems: 0,
    totalPendingItems: 0,
    totalMessages: 0,
    activeCategories: 0,
    inactiveCategories: 0,
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) throw categoriesError;
      
      const formattedCategories: Category[] = categoriesData.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        isActive: cat.is_active
      }));
      
      setCategories(formattedCategories);

      // Fetch items
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*');

      if (itemsError) throw itemsError;

      const formattedItems: Item[] = itemsData.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        status: item.status as 'lost' | 'found' | 'claimed',
        date: item.date,
        location: item.location,
        image: item.image,
        contactEmail: item.contact_email,
        createdBy: item.created_by
      }));

      setItems(formattedItems);

      // Fetch messages if user is admin
      if (user?.role === 'admin') {
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*');

        if (messagesError) throw messagesError;
        
        const formattedMessages: Message[] = messagesData.map(msg => ({
          id: msg.id,
          name: msg.name,
          email: msg.email,
          subject: msg.subject,
          message: msg.message,
          date: msg.date,
          isRead: msg.is_read
        }));
        
        setMessages(formattedMessages);
      }

      // Update stats
      updateStats(formattedItems, formattedCategories, user?.role === 'admin' ? messagesData || [] : []);
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update stats whenever data changes
  const updateStats = (
    currentItems: Item[], 
    currentCategories: Category[], 
    currentMessages: Message[]
  ) => {
    const lostItems = currentItems.filter(item => item.status === 'lost').length;
    const foundItems = currentItems.filter(item => item.status === 'found').length;
    const claimedItems = currentItems.filter(item => item.status === 'claimed').length;
    const pendingItems = lostItems + foundItems;
    const activeCategories = currentCategories.filter(category => category.isActive).length;
    const inactiveCategories = currentCategories.filter(category => !category.isActive).length;

    setStats({
      totalLostItems: lostItems,
      totalFoundItems: foundItems,
      totalClaimedItems: claimedItems,
      totalPendingItems: pendingItems,
      totalMessages: currentMessages.length,
      activeCategories,
      inactiveCategories,
    });
  };

  // Fetch data when auth state changes
  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setItems([]);
      setCategories([]);
      setMessages([]);
      setIsLoading(false);
    }
  }, [user]);

  const addItem = async (item: Omit<Item, 'id'>) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const newItem = {
        title: item.title,
        description: item.description,
        category: item.category,
        status: item.status,
        date: item.date || new Date().toISOString(),
        location: item.location,
        image: item.image,
        contact_email: item.contactEmail,
        created_by: user.id
      };

      const { data, error } = await supabase
        .from('items')
        .insert(newItem)
        .select()
        .single();

      if (error) throw error;

      const formattedItem: Item = {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        status: data.status,
        date: data.date,
        location: data.location,
        image: data.image,
        contactEmail: data.contact_email,
        createdBy: data.created_by
      };

      setItems(prevItems => [...prevItems, formattedItem]);
      updateStats([...items, formattedItem], categories, messages);
    } catch (error: any) {
      console.error('Error adding item:', error.message);
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      if (!user || user.role !== 'admin') throw new Error('Unauthorized');

      const newCategory = {
        name: category.name,
        description: category.description,
        is_active: category.isActive
      };

      const { data, error } = await supabase
        .from('categories')
        .insert(newCategory)
        .select()
        .single();

      if (error) throw error;

      const formattedCategory: Category = {
        id: data.id,
        name: data.name,
        description: data.description,
        isActive: data.is_active
      };

      setCategories(prevCategories => [...prevCategories, formattedCategory]);
      updateStats(items, [...categories, formattedCategory], messages);
    } catch (error: any) {
      console.error('Error adding category:', error.message);
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addMessage = async (message: Omit<Message, 'id' | 'date' | 'isRead'>) => {
    try {
      const newMessage = {
        name: message.name,
        email: message.email,
        subject: message.subject,
        message: message.message,
        date: new Date().toISOString(),
        is_read: false
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select()
        .single();

      if (error) throw error;

      if (user?.role === 'admin') {
        const formattedMessage: Message = {
          id: data.id,
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          date: data.date,
          isRead: data.is_read
        };

        setMessages(prevMessages => [...prevMessages, formattedMessage]);
        updateStats(items, categories, [...messages, formattedMessage]);
      }
    } catch (error: any) {
      console.error('Error adding message:', error.message);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateItem = async (id: string, itemUpdate: Partial<Item>) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const updates: any = {};
      if (itemUpdate.title) updates.title = itemUpdate.title;
      if (itemUpdate.description) updates.description = itemUpdate.description;
      if (itemUpdate.category) updates.category = itemUpdate.category;
      if (itemUpdate.status) updates.status = itemUpdate.status;
      if (itemUpdate.date) updates.date = itemUpdate.date;
      if (itemUpdate.location) updates.location = itemUpdate.location;
      if (itemUpdate.image !== undefined) updates.image = itemUpdate.image;
      if (itemUpdate.contactEmail) updates.contact_email = itemUpdate.contactEmail;

      const { error } = await supabase
        .from('items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, ...itemUpdate } : item
        )
      );
      
      updateStats(
        items.map(item => (item.id === id ? { ...item, ...itemUpdate } : item)),
        categories,
        messages
      );
    } catch (error: any) {
      console.error('Error updating item:', error.message);
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCategory = async (id: string, categoryUpdate: Partial<Category>) => {
    try {
      if (!user || user.role !== 'admin') throw new Error('Unauthorized');

      const updates: any = {};
      if (categoryUpdate.name) updates.name = categoryUpdate.name;
      if (categoryUpdate.description) updates.description = categoryUpdate.description;
      if (categoryUpdate.isActive !== undefined) updates.is_active = categoryUpdate.isActive;

      const { error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setCategories(prevCategories =>
        prevCategories.map(category =>
          category.id === id ? { ...category, ...categoryUpdate } : category
        )
      );
      
      updateStats(
        items,
        categories.map(category => (category.id === id ? { ...category, ...categoryUpdate } : category)),
        messages
      );
    } catch (error: any) {
      console.error('Error updating category:', error.message);
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const markMessageAsRead = async (id: string) => {
    try {
      if (!user || user.role !== 'admin') throw new Error('Unauthorized');

      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      setMessages(prevMessages =>
        prevMessages.map(message =>
          message.id === id ? { ...message, isRead: true } : message
        )
      );
    } catch (error: any) {
      console.error('Error marking message as read:', error.message);
      toast({
        title: "Error",
        description: "Failed to update message. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      updateStats(updatedItems, categories, messages);
    } catch (error: any) {
      console.error('Error deleting item:', error.message);
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      if (!user || user.role !== 'admin') throw new Error('Unauthorized');

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const updatedCategories = categories.filter(category => category.id !== id);
      setCategories(updatedCategories);
      updateStats(items, updatedCategories, messages);
    } catch (error: any) {
      console.error('Error deleting category:', error.message);
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      if (!user || user.role !== 'admin') throw new Error('Unauthorized');

      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const updatedMessages = messages.filter(message => message.id !== id);
      setMessages(updatedMessages);
      updateStats(items, categories, updatedMessages);
    } catch (error: any) {
      console.error('Error deleting message:', error.message);
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const refreshData = async () => {
    await fetchData();
  };

  return (
    <DataContext.Provider
      value={{
        items,
        categories,
        messages,
        stats,
        addItem,
        addCategory,
        addMessage,
        updateItem,
        updateCategory,
        markMessageAsRead,
        deleteItem,
        deleteCategory,
        deleteMessage,
        refreshData,
        isLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
