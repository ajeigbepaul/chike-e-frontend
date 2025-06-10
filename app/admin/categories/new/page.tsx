'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Category } from '../types';
import categoryService, { CreateCategoryData } from '@/services/api/category';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';

export default function NewCategoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for category selection path
  const [selectionPath, setSelectionPath] = useState<{id: string, name: string}[]>([]);
  
  // State for new category input
  const [newCategoryName, setNewCategoryName] = useState('');

  // Fetch all categories
  const { data: categories = [] } = useQuery<Category[]>(
    {
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoryService.getAllCategories();
      if (!response.success) throw new Error(response.message);
      return response.data || [];
    },
  });

  // Get top-level categories
  const mainCategories = categories.filter(cat => !cat.parent);

  // Get subcategories for a parent
  const getSubcategories = (parentId: string | null) => {
    return categories.filter(cat => cat.parent === parentId);
  };

  // Get current level categories based on selection path
  const getCurrentLevelCategories = () => {
    if (selectionPath.length === 0) return mainCategories;
    const lastSelected = selectionPath[selectionPath.length - 1];
    return getSubcategories(lastSelected.id);
  };

  // Handle category selection
  const handleSelectCategory = (categoryId: string) => {
    const selected = categories.find(cat => cat._id === categoryId);
    if (selected) {
      setSelectionPath([...selectionPath, {id: selected._id, name: selected.name}]);
    }
  };

  // Handle going back in the hierarchy
  const navigateBack = (level: number) => {
    setSelectionPath(selectionPath.slice(0, level));
  };

  // Mutation for creating new category
  const createCategoryMutation = useMutation({
    mutationFn: async (data: CreateCategoryData) => {
      const response = await categoryService.createCategory(data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'Success', description: 'Category created successfully!' });
      router.push('/admin/categories');
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast({ title: 'Validation', description: 'Please enter a category name', variant: 'destructive' });
      return;
    }

    const parentId = selectionPath.length > 0 ? selectionPath[selectionPath.length - 1].id : undefined;
    const order = getSubcategories(parentId || null).length;

    createCategoryMutation.mutate({
      name: newCategoryName,
      parent: parentId,
      order,
      isActive: true
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Add New Category</h1>
          <p className="text-muted-foreground">
            {selectionPath.length === 0 
              ? "Select a main category or add a new one" 
              : "Select a subcategory or add a new one"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Breadcrumb navigation */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => navigateBack(0)}
              className={selectionPath.length === 0 ? 'font-bold' : ''}
            >
              Main Categories
            </Button>
            
            {selectionPath.map((category, index) => (
              <React.Fragment key={category.id}>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => navigateBack(index + 1)}
                  className={index === selectionPath.length - 1 ? 'font-bold' : ''}
                >
                  {category.name}
                </Button>
              </React.Fragment>
            ))}
          </div>

          {/* Current level category selection */}
          <div className="space-y-4">
            <Label>Select Existing Category</Label>
            <Select
              onValueChange={handleSelectCategory}
              value=""
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${selectionPath.length === 0 ? 'main' : 'sub'} category`} />
              </SelectTrigger>
              <SelectContent>
                {getCurrentLevelCategories().map(category => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Or add new category */}
          <div className="space-y-4">
            <Label>Add New Category</Label>
            <div className="flex gap-2">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder={`Enter new ${selectionPath.length === 0 ? 'main' : 'sub'} category name`}
              />
              <Button type="submit" disabled={createCategoryMutation.isPending}>
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/admin/categories')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}