
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/context/DataContext';
import CategoryCard from './CategoryCard';
import AddCategoryDialog from './AddCategoryDialog';

const CategoriesTab: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();
  const { toast } = useToast();
  
  // State for category dialog
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryStatus, setNewCategoryStatus] = useState('active');

  const handleAddCategory = () => {
    addCategory({
      name: newCategoryName,
      description: newCategoryDescription,
      is_active: newCategoryStatus === 'active',
    });

    toast({
      title: "Category Added",
      description: `${newCategoryName} has been added to categories.`,
    });

    setNewCategoryName('');
    setNewCategoryDescription('');
    setNewCategoryStatus('active');
    setIsAddCategoryOpen(false);
  };

  const handleToggleCategoryStatus = (id: string, currentStatus: boolean) => {
    updateCategory(id, { is_active: !currentStatus });
    
    toast({
      title: "Category Updated",
      description: `Category status has been toggled to ${!currentStatus ? 'active' : 'inactive'}.`,
    });
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
    
    toast({
      title: "Category Deleted",
      description: "The category has been deleted.",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Categories</h2>
        <Button onClick={() => setIsAddCategoryOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onToggleStatus={handleToggleCategoryStatus}
            onDelete={handleDeleteCategory}
          />
        ))}
      </div>

      <AddCategoryDialog
        open={isAddCategoryOpen}
        onOpenChange={setIsAddCategoryOpen}
        categoryName={newCategoryName}
        onCategoryNameChange={setNewCategoryName}
        categoryDescription={newCategoryDescription}
        onCategoryDescriptionChange={setNewCategoryDescription}
        categoryStatus={newCategoryStatus}
        onCategoryStatusChange={setNewCategoryStatus}
        onSave={handleAddCategory}
      />
    </div>
  );
};

export default CategoriesTab;
