
import React from 'react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Info } from 'lucide-react';
import ItemRow from './ItemRow';

const ItemsTab: React.FC = () => {
  const { items, categories, updateItem, deleteItem } = useData();
  const { toast } = useToast();

  const handleToggleItemClaimedStatus = (id: string, currentStatus: string) => {
    updateItem(id, { status: currentStatus === 'claimed' ? (items.find(i => i.id === id)?.status === 'lost' ? 'lost' : 'found') : 'claimed' });
    
    toast({
      title: "Item Status Updated",
      description: `Item has been marked as ${currentStatus === 'claimed' ? 'active' : 'claimed'}.`,
    });
  };

  const handleDeleteItem = (id: string) => {
    deleteItem(id);
    
    toast({
      title: "Item Deleted",
      description: "The item has been deleted.",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Manage Items</h2>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <Info className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No items yet</h3>
          <p className="mt-2 text-muted-foreground">
            Items posted by users will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  categories={categories}
                  onToggleClaimedStatus={handleToggleItemClaimedStatus}
                  onDelete={handleDeleteItem}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ItemsTab;
