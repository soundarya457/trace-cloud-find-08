
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Eye, Trash, X } from 'lucide-react';
import { Item, Category } from '@/types';

interface ItemRowProps {
  item: Item;
  categories: Category[];
  onToggleClaimedStatus: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
}

const ItemRow: React.FC<ItemRowProps> = ({
  item,
  categories,
  onToggleClaimedStatus,
  onDelete
}) => {
  const itemCategory = categories.find(cat => cat.id === item.category);
  
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {item.title}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 rounded-full text-xs uppercase ${
          item.status === 'lost' ? 'bg-red-100 text-red-800' : 
          item.status === 'found' ? 'bg-green-100 text-green-800' : 
          'bg-blue-100 text-blue-800'
        }`}>
          {item.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {itemCategory?.name || 'Unknown'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(item.date).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
        <Button variant="outline" size="sm" className="inline-flex items-center">
          <Eye className="h-3 w-3 mr-1" />
          View
        </Button>
        <Button 
          variant={item.status === 'claimed' ? 'default' : 'secondary'} 
          size="sm"
          onClick={() => onToggleClaimedStatus(item.id, item.status)}
          className="inline-flex items-center"
        >
          {item.status === 'claimed' ? (
            <>
              <X className="h-3 w-3 mr-1" />
              Unclaim
            </>
          ) : (
            <>
              <Check className="h-3 w-3 mr-1" />
              Mark Claimed
            </>
          )}
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => onDelete(item.id)}
          className="inline-flex items-center"
        >
          <Trash className="h-3 w-3 mr-1" />
          Delete
        </Button>
      </td>
    </tr>
  );
};

export default ItemRow;
