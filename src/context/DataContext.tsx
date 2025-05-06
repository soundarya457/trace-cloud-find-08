
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, Category, Message, DashboardStats } from '@/types';

interface DataContextProps {
  items: Item[];
  categories: Category[];
  messages: Message[];
  stats: DashboardStats;
  addItem: (item: Omit<Item, 'id'>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  addMessage: (message: Omit<Message, 'id' | 'date' | 'isRead'>) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  markMessageAsRead: (id: string) => void;
  deleteItem: (id: string) => void;
  deleteCategory: (id: string) => void;
  deleteMessage: (id: string) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const initialCategories: Category[] = [
  { id: '1', name: 'Mobile Phones', description: 'Smartphones and cell phones', isActive: true },
  { id: '2', name: 'Keys', description: 'Keys and key chains', isActive: true },
  { id: '3', name: 'ID Cards', description: 'College IDs, government IDs, etc.', isActive: true },
  { id: '4', name: 'Laptops', description: 'Laptops and computers', isActive: true },
  { id: '5', name: 'Books', description: 'Textbooks and notebooks', isActive: true },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or use default values
  const [items, setItems] = useState<Item[]>(() => {
    const savedItems = localStorage.getItem('traceCloudItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem('traceCloudCategories');
    return savedCategories ? JSON.parse(savedCategories) : initialCategories;
  });
  
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('traceCloudMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

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

  // Update localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('traceCloudItems', JSON.stringify(items));
    localStorage.setItem('traceCloudCategories', JSON.stringify(categories));
    localStorage.setItem('traceCloudMessages', JSON.stringify(messages));
  }, [items, categories, messages]);

  // Update stats whenever items, categories, or messages change
  useEffect(() => {
    const lostItems = items.filter(item => item.status === 'lost').length;
    const foundItems = items.filter(item => item.status === 'found').length;
    const claimedItems = items.filter(item => item.status === 'claimed').length;
    const pendingItems = lostItems + foundItems;
    const activeCategories = categories.filter(category => category.isActive).length;
    const inactiveCategories = categories.filter(category => !category.isActive).length;

    setStats({
      totalLostItems: lostItems,
      totalFoundItems: foundItems,
      totalClaimedItems: claimedItems,
      totalPendingItems: pendingItems,
      totalMessages: messages.length,
      activeCategories,
      inactiveCategories,
    });
  }, [items, categories, messages]);

  const addItem = (item: Omit<Item, 'id'>) => {
    const newItem: Item = {
      ...item,
      id: Date.now().toString(),
    };
    setItems(prevItems => [...prevItems, newItem]);
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories(prevCategories => [...prevCategories, newCategory]);
  };

  const addMessage = (message: Omit<Message, 'id' | 'date' | 'isRead'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      isRead: false,
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const updateItem = (id: string, item: Partial<Item>) => {
    setItems(prevItems =>
      prevItems.map(prevItem =>
        prevItem.id === id ? { ...prevItem, ...item } : prevItem
      )
    );
  };

  const updateCategory = (id: string, category: Partial<Category>) => {
    setCategories(prevCategories =>
      prevCategories.map(prevCategory =>
        prevCategory.id === id ? { ...prevCategory, ...category } : prevCategory
      )
    );
  };

  const markMessageAsRead = (id: string) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.id === id ? { ...message, isRead: true } : message
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const deleteCategory = (id: string) => {
    setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
  };

  const deleteMessage = (id: string) => {
    setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
