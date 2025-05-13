
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Message } from '@/types';

interface MessageDetailsDialogProps {
  message: Message | null;
  open: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const MessageDetailsDialog: React.FC<MessageDetailsDialogProps> = ({
  message,
  open,
  onClose,
  onDelete
}) => {
  if (!message) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{message.subject}</DialogTitle>
          <DialogDescription>
            From: {message.name} ({message.email})
            <br />
            Date: {new Date(message.date).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 border-t border-b">
          <p>{message.message}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button 
            variant="destructive" 
            onClick={() => onDelete(message.id)}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDetailsDialog;
