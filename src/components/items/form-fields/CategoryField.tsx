
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/types';

interface CategoryFieldProps {
  category: string;
  setCategory: (category: string) => void;
  categories: Category[];
}

const CategoryField: React.FC<CategoryFieldProps> = ({ category, setCategory, categories }) => {
  // Get only active categories
  const activeCategories = categories.filter(cat => cat.is_active);
  
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Category</Label>
      <Select
        value={category}
        onValueChange={setCategory}
        required
      >
        <SelectTrigger id="category">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            {activeCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategoryField;
