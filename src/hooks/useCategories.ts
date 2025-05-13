
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types';
import { TablesUpdate } from '@/integrations/supabase/types';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: Omit<Category, "id" | "created_at">) => {
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

  return {
    categories,
    loading,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  };
};
