
import { useState } from 'react';
import { Message } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    setMessages(data || []);
    return data;
  };

  const addMessage = async (messageData: Omit<Message, 'id' | 'date' | 'created_at' | 'is_read'>) => {
    const newMessage = {
      id: uuidv4(),
      date: new Date().toISOString(),
      is_read: false,
      ...messageData,
    };

    const { error } = await supabase
      .from('messages')
      .insert([newMessage]);

    if (error) {
      throw error;
    }

    await fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    setMessages(messages.filter(message => message.id !== id));
  };

  const markMessageAsRead = async (id: string) => {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      throw error;
    }

    setMessages(messages.map(message => 
      message.id === id ? { ...message, is_read: true } : message
    ));
  };

  return {
    messages,
    fetchMessages,
    addMessage,
    deleteMessage,
    markMessageAsRead,
  };
};
