
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import ImageUpload from './ImageUpload';
import StatusField from './form-fields/StatusField';
import CategoryField from './form-fields/CategoryField';
import TitleField from './form-fields/TitleField';
import DescriptionField from './form-fields/DescriptionField';
import LocationDateFields from './form-fields/LocationDateFields';
import ContactEmailField from './form-fields/ContactEmailField';
import FormButtons from './form-fields/FormButtons';

const ItemForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories, addItem } = useData();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'lost' | 'found'>('lost');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (file: File | null, preview: string | undefined) => {
    setImageFile(file);
    setImagePreview(preview);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to post an item",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imagePath = undefined;
      
      // Upload image if exists
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `items/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('items')
          .upload(filePath, imageFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL
        const { data } = supabase.storage
          .from('items')
          .getPublicUrl(filePath);
          
        imagePath = data.publicUrl;
      }

      // Create new item with form values
      await addItem({
        title,
        description,
        category,
        status,
        date: date || new Date().toISOString(),
        location,
        image: imagePath,
        contact_email: contactEmail,
        created_by: user.id,
      });

      // Show success message
      toast({
        title: "Item Posted Successfully",
        description: "Your item has been posted to the lost and found system",
      });

      // Redirect to the items page
      navigate('/lost-found');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to post item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <StatusField status={status} setStatus={setStatus} />
          <CategoryField category={category} setCategory={setCategory} categories={categories} />
        </div>

        <TitleField title={title} setTitle={setTitle} />
        <DescriptionField description={description} setDescription={setDescription} />
        <LocationDateFields 
          location={location} 
          setLocation={setLocation} 
          date={date} 
          setDate={setDate} 
        />
        <ContactEmailField contactEmail={contactEmail} setContactEmail={setContactEmail} />
        <ImageUpload onImageChange={handleImageChange} initialImage={imagePreview} />
      </div>

      <FormButtons isSubmitting={isSubmitting} />
    </form>
  );
};

export default ItemForm;
