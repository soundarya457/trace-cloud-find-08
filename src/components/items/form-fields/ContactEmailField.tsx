
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ContactEmailFieldProps {
  contactEmail: string;
  setContactEmail: (contactEmail: string) => void;
}

const ContactEmailField: React.FC<ContactEmailFieldProps> = ({ contactEmail, setContactEmail }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="contactEmail">Contact Email</Label>
      <Input
        id="contactEmail"
        type="email"
        placeholder="Your email address for contact"
        value={contactEmail}
        onChange={(e) => setContactEmail(e.target.value)}
        required
      />
    </div>
  );
};

export default ContactEmailField;
