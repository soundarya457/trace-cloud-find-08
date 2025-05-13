
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TitleFieldProps {
  title: string;
  setTitle: (title: string) => void;
}

const TitleField: React.FC<TitleFieldProps> = ({ title, setTitle }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="title">Item Title</Label>
      <Input
        id="title"
        placeholder="E.g., Blue Backpack, iPhone 13, Student ID"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
    </div>
  );
};

export default TitleField;
