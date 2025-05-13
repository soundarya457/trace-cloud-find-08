
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface LocationDateFieldsProps {
  location: string;
  setLocation: (location: string) => void;
  date: string;
  setDate: (date: string) => void;
}

const LocationDateFields: React.FC<LocationDateFieldsProps> = ({ 
  location, setLocation, date, setDate 
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="Where the item was lost or found"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
    </div>
  );
};

export default LocationDateFields;
