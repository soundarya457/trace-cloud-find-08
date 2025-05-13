
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  onToggleStatus, 
  onDelete 
}) => {
  return (
    <Card key={category.id}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>{category.name}</span>
          <span className={`px-2 py-1 rounded-full text-xs uppercase ${
            category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {category.isActive ? 'Active' : 'Inactive'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onToggleStatus(category.id, category.isActive)}
          >
            {category.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onDelete(category.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
