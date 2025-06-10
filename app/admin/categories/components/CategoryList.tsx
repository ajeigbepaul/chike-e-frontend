'use client';

import { Category } from '../types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2 } from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onOrderUpdate: (categoryId: string, newOrder: number) => void;
  onStatusToggle: (categoryId: string, isActive: boolean) => void;
  isUpdating?: boolean;
}

export default function CategoryList({
  categories,
  onEdit,
  onDelete,
  onOrderUpdate,
  onStatusToggle,
  isUpdating = false,
}: CategoryListProps) {
  const getCategoryPath = (category: Category) => {
    if (!category.ancestors?.length) return category.name;
    return `${category.ancestors.map(a => a.name).join(' > ')} > ${category.name}`;
  };

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div
          key={category._id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex-1">
            <h3 className="font-medium">{getCategoryPath(category)}</h3>
            {/* {category.description && (
              <p className="text-sm text-gray-500 mt-1">{category.description}</p>
            )} */}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Order:</span>
              <Input
                type="number"
                value={category.order}
                onChange={(e) => onOrderUpdate(category._id, parseInt(e.target.value))}
                className="w-20"
                disabled={isUpdating}
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Active:</span>
              <Switch
                checked={category.isActive}
                onCheckedChange={(checked) => onStatusToggle(category._id, checked)}
                disabled={isUpdating}
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(category)}
              disabled={isUpdating}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(category._id)}
              disabled={isUpdating}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
} 