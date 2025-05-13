
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface FormButtonsProps {
  isSubmitting: boolean;
}

const FormButtons: React.FC<FormButtonsProps> = ({ isSubmitting }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-end space-x-4">
      <Button type="button" variant="outline" onClick={() => navigate(-1)}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Posting...' : 'Post Item'}
      </Button>
    </div>
  );
};

export default FormButtons;
