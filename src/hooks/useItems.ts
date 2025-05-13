
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Item } from '@/types';
import { TablesUpdate } from '@/integrations/supabase/types';

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure the status type matches our Item type
      const typedItems = data?.map(item => ({
        ...item,
        status: item.status as "lost" | "found" | "claimed"
      })) || [];
      
      setItems(typedItems);
    } catch (error: any) {
      console.error('Error fetching items:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<Item, "id" | "created_at">) => {
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
      
      // Ensure the status type matches our Item type
      const typedItem = {
        ...data,
        status: data.status as "lost" | "found" | "claimed"
      };
      
      setItems(prev => [...prev, typedItem]);
    } catch (error: any) {
      console.error('Error adding item:', error.message);
      throw error;
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
      
      // Ensure the status type matches our Item type
      const typedItem = {
        ...data,
        status: data.status as "lost" | "found" | "claimed"
      };
      
      setItems(prev => prev.map(item => (item.id === id ? typedItem : item)));
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

  return {
    items,
    loading,
    fetchItems,
    addItem,
    updateItem,
    deleteItem
  };
};
