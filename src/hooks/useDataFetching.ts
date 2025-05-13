
import { useState, useEffect } from 'react';
import { useCategories } from './useCategories';
import { useItems } from './useItems';
import { useMessages } from './useMessages';
import { useStatsCalculator } from './useStatsCalculator';

export const useDataFetching = () => {
  const [loading, setLoading] = useState(true);
  const { 
    categories, 
    fetchCategories, 
    addCategory, 
    updateCategory, 
    deleteCategory 
  } = useCategories();
  
  const { 
    items, 
    fetchItems, 
    addItem, 
    updateItem, 
    deleteItem 
  } = useItems();
  
  const { 
    messages, 
    fetchMessages, 
    addMessage, 
    deleteMessage, 
    markMessageAsRead 
  } = useMessages();

  const stats = useStatsCalculator(items, categories, messages);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchCategories(),
          fetchItems(),
          fetchMessages()
        ]);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return {
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
};
