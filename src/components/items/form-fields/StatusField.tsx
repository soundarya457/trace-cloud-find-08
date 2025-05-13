
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface StatusFieldProps {
  status: 'lost' | 'found';
  setStatus: (status: 'lost' | 'found') => void;
}

const StatusField: React.FC<StatusFieldProps> = ({ status, setStatus }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="status">Item Status</Label>
      <RadioGroup
        id="status"
        value={status}
        onValueChange={(value) => setStatus(value as 'lost' | 'found')}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="lost" id="lost" />
          <Label htmlFor="lost">Lost</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="found" id="found" />
          <Label htmlFor="found">Found</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default StatusField;
