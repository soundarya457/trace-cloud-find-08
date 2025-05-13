
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DescriptionFieldProps {
  description: string;
  setDescription: (description: string) => void;
}

const DescriptionField: React.FC<DescriptionFieldProps> = ({ description, setDescription }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        placeholder="Please provide a detailed description of the item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        rows={4}
      />
    </div>
  );
};

export default DescriptionField;
