import { Category } from '../types';
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface CategoryTreeProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onOrderUpdate: (categoryId: string, newOrder: number) => void;
  onStatusToggle: (categoryId: string, isActive: boolean) => void;
  isUpdating?: boolean;
}

interface TreeNodeProps {
  category: Category;
  level: number;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onOrderUpdate: (categoryId: string, newOrder: number) => void;
  onStatusToggle: (categoryId: string, isActive: boolean) => void;
  isUpdating?: boolean;
}

const TreeNode = ({ 
  category, 
  level, 
  onEdit, 
  onDelete, 
  onOrderUpdate, 
  onStatusToggle,
  isUpdating
}: TreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [orderValue, setOrderValue] = useState(category.order.toString());

  const handleOrderSubmit = () => {
    const newOrder = parseInt(orderValue);
    if (!isNaN(newOrder)) {
      onOrderUpdate(category._id, newOrder);
    }
    setIsEditingOrder(false);
  };

  return (
    <div className="ml-4">
      <div className="flex items-center space-x-2 py-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-muted rounded"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {isExpanded ? (
          <FolderOpen className="h-4 w-4 text-blue-500" />
        ) : (
          <Folder className="h-4 w-4 text-blue-500" />
        )}
        <span className="font-medium">{category.name}</span>
        <div className="flex items-center space-x-2 ml-auto">
          {isEditingOrder ? (
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={orderValue}
                onChange={(e) => setOrderValue(e.target.value)}
                className="w-20"
                min="0"
              />
              <Button
                size="sm"
                onClick={handleOrderSubmit}
                disabled={isUpdating}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditingOrder(false);
                  setOrderValue(category.order.toString());
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <span className="text-sm text-muted-foreground">
                Order: {category.order}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditingOrder(true)}
                disabled={isUpdating}
              >
                Edit Order
              </Button>
            </>
          )}
          <Switch
            checked={category.isActive}
            onCheckedChange={(checked) => onStatusToggle(category._id, checked)}
            disabled={isUpdating}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(category)}
            disabled={isUpdating}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(category._id)}
            disabled={isUpdating}
          >
            Delete
          </Button>
        </div>
      </div>
      
      {isExpanded && category.subcategories && category.subcategories.length > 0 && (
        <div className="ml-4">
          {category.subcategories.map((subcategory) => (
            <TreeNode
              key={subcategory._id}
              category={subcategory}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onOrderUpdate={onOrderUpdate}
              onStatusToggle={onStatusToggle}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CategoryTree({
  categories,
  onEdit,
  onDelete,
  onOrderUpdate,
  onStatusToggle,
  isUpdating
}: CategoryTreeProps) {
  // Get top-level categories
  const topLevelCategories = categories.filter(cat => !cat.parent);

  return (
    <div className="space-y-2">
      {topLevelCategories.map((category) => (
        <TreeNode
          key={category._id}
          category={category}
          level={0}
          onEdit={onEdit}
          onDelete={onDelete}
          onOrderUpdate={onOrderUpdate}
          onStatusToggle={onStatusToggle}
          isUpdating={isUpdating}
        />
      ))}
    </div>
  );
}

function buildCategoryTree(categories: Category[]): Category[] {
  const map: { [key: string]: Category & { subcategories: Category[] } } = {};
  const roots: Category[] = [];

  // Initialize map and subcategories
  categories.forEach(cat => {
    map[cat._id] = { ...cat, subcategories: [] };
  });

  // Build the tree
  categories.forEach(cat => {
    if (cat.parent && map[cat.parent]) {
      map[cat.parent].subcategories.push(map[cat._id]);
    } else {
      roots.push(map[cat._id]);
    }
  });

  return roots;
} 