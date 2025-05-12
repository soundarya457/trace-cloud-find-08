
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ImageUploadProps {
  onImageChange: (file: File | null, preview: string | undefined) => void;
  initialImage?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageChange, initialImage }) => {
  const [image, setImage] = useState<string | undefined>(initialImage);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        setImage(preview);
        onImageChange(file, preview);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(undefined);
      onImageChange(null, undefined);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image">Image (Optional)</Label>
      <Input
        id="image"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      {image && (
        <div className="mt-2">
          <img
            src={image}
            alt="Item Preview"
            className="max-h-40 rounded-md object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
