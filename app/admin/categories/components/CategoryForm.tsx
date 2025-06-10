'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Category } from '../types';
import { ChevronRight, Folder } from 'lucide-react';

interface CategoryFormProps {
  initialData?: Partial<Category> | null;
  onSubmit: (data: Partial<Category>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CategoryFormProps) {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: initialData?.name || '',
    isActive: initialData?.isActive ?? true,
    order: initialData?.order || 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        isActive: initialData.isActive ?? true,
        order: initialData.order || 0,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || !isNaN(Number(value))) {
      setFormData({ ...formData, order: value === '' ? 0 : Number(value) });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="order">Display Order</Label>
          <Input
            id="order"
            type="number"
            min="0"
            value={formData.order || 0}
            onChange={handleOrderChange}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {initialData ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
} 