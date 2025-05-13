
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash } from 'lucide-react';
import { Message } from '@/types';

interface MessageCardProps {
  message: Message;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, onView, onDelete }) => {
  return (
    <Card key={message.id}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <span>{message.subject}</span>
            {!message.isRead && (
              <span className="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>
            )}
            {message.subject.includes('Feedback:') && (
              <Badge className="ml-2 bg-purple text-white">Feedback</Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {new Date(message.date).toLocaleDateString()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-1">From: {message.name} ({message.email})</p>
        <p className="text-sm line-clamp-2">{message.message}</p>
        <div className="flex space-x-2 mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onView(message.id)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onDelete(message.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
