
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (message: Omit<Message, "id" | "date" | "is_read" | "created_at">) => {
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

  return {
    messages,
    loading,
    fetchMessages,
    addMessage,
    deleteMessage,
    markMessageAsRead
  };
};
