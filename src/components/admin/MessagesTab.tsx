
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { MessageSquare } from 'lucide-react';
import MessageCard from './MessageCard';
import MessageDetailsDialog from './MessageDetailsDialog';

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

  const messageDetails = selectedMessage ? messages.find(message => message.id === selectedMessage) : null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">User Messages & Feedback</h2>

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
              onDelete={deleteMessage}
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
