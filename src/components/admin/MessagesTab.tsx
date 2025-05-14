
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { MessageSquare } from 'lucide-react';
import MessageCard from './MessageCard';
import MessageDetailsDialog from './MessageDetailsDialog';
import { Badge } from '@/components/ui/badge';

const MessagesTab: React.FC = () => {
  const { messages, deleteMessage, markMessageAsRead } = useData();
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const handleViewMessage = (id: string) => {
    setSelectedMessage(id);
    markMessageAsRead(id);
  };

  const handleCloseMessageView = () => {
    setSelectedMessage(null);
  };

  const handleDeleteMessage = (id: string) => {
    deleteMessage(id);
    setSelectedMessage(null);
    
    toast({
      title: "Message Deleted",
      description: "The message has been deleted.",
    });
  };

  // Count unread messages
  const unreadCount = messages.filter(message => !message.is_read).length;
  // Count feedback messages
  const feedbackCount = messages.filter(message => message.subject.includes('Feedback:')).length;

  const messageDetails = selectedMessage ? messages.find(message => message.id === selectedMessage) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">User Messages & Feedback</h2>
        <div className="flex space-x-3">
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-blue-500 text-white">
              {unreadCount} Unread
            </Badge>
          )}
          {feedbackCount > 0 && (
            <Badge variant="secondary" className="bg-purple text-white">
              {feedbackCount} Feedback
            </Badge>
          )}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No messages yet</h3>
          <p className="mt-2 text-muted-foreground">
            Messages from users will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onView={handleViewMessage}
              onDelete={handleDeleteMessage}
            />
          ))}
        </div>
      )}

      <MessageDetailsDialog
        message={messageDetails}
        open={!!selectedMessage}
        onClose={handleCloseMessageView}
        onDelete={handleDeleteMessage}
      />
    </div>
  );
};

export default MessagesTab;
