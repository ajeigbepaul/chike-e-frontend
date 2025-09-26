"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download } from "lucide-react";
import { CategoryForm } from "./components/CategoryForm";
import CategoryTree from "./components/CategoryTree";
import { useToast } from "@/components/ui/use-toast";
import { Category } from "./types";
import categoryService, { CreateCategoryData } from "@/services/api/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

function buildCategoryTree(categories: Category[]): Category[] {
  const map: { [key: string]: Category & { subcategories: Category[] } } = {};
  const roots: Category[] = [];

  // Initialize map and subcategories
  categories.forEach((cat) => {
    map[cat._id] = { ...cat, subcategories: [] };
  });
  console.log("Map after initialization:", map);

  // Build the tree
  categories.forEach((cat) => {
    if (cat.parent && map[cat.parent]) {
      // Ensure the parent's subcategories array is initialized
      if (!map[cat.parent].subcategories) {
        map[cat.parent].subcategories = [];
      }
      map[cat.parent].subcategories.push(map[cat._id]);
    } else {
      roots.push(map[cat._id]);
    }
  });

  console.log("Built category tree (roots):", roots);
  return roots;
}

export default function CategoriesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoryService.getAllCategories();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data || [];
    },
  });
  console.log("Fetched categories (flat):", categories);

  const createCategoryMutation = useMutation({
    mutationFn: (formData: CreateCategoryData) =>
      categoryService.createCategory(formData),
    onSuccess: (response) => {
      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        setIsFormOpen(false);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (data: {
      _id: string;
      data: Partial<Omit<Category, "image">>;
    }) => categoryService.updateCategory({ _id: data._id, ...data.data }),
    onSuccess: (response) => {
      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        setIsFormOpen(false);
        setSelectedCategory(null);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: string) =>
      categoryService.deleteCategory(categoryId),
    onSuccess: (response) => {
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Category deleted successfully!",
        });
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete category.",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description:
          error.message || "An unexpected error occurred during deletion.",
        variant: "destructive",
      });
    },
  });

  const exportCategoriesMutation = useMutation({
    mutationFn: () => categoryService.exportCategories(),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = "categories.csv";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast({
          title: "Success",
          description: "Categories exported successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const importCategoriesMutation = useMutation({
    mutationFn: (file: File) => categoryService.importCategories(file),
    onSuccess: (response) => {
      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({
      categoryId,
      newOrder,
    }: {
      categoryId: string;
      newOrder: number;
    }) => categoryService.updateCategoryOrder(categoryId, newOrder),
    onSuccess: (response) => {
      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({
      categoryId,
      isActive,
    }: {
      categoryId: string;
      isActive: boolean;
    }) => categoryService.toggleCategoryStatus(categoryId, isActive),
    onSuccess: (response) => {
      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete);
      setCategoryToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleFormSubmit = (formData: Partial<Category>) => {
    if (selectedCategory) {
      updateCategoryMutation.mutate({
        _id: selectedCategory._id,
        data: formData,
      });
    } else {
      createCategoryMutation.mutate(formData as CreateCategoryData);
    }
  };

  const handleExport = () => {
    exportCategoriesMutation.mutate();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    importCategoriesMutation.mutate(file);
  };

  const handleOrderUpdate = (categoryId: string, newOrder: number) => {
    updateOrderMutation.mutate({ categoryId, newOrder });
  };

  const handleStatusToggle = (categoryId: string, isActive: boolean) => {
    toggleStatusMutation.mutate({ categoryId, isActive });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="flex space-x-2">
          {/* <Button
            variant="outline"
            onClick={handleExport}
            disabled={exportCategoriesMutation.isPending}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <label htmlFor="import-categories">
            <Button
              variant="outline"
              asChild
              disabled={importCategoriesMutation.isPending}
            >
              <div>
                <Upload className="mr-2 h-4 w-4" />
                Import
              </div>
            </Button>
            <input
              id="import-categories"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImport}
            />
          </label> */}
          <Button
            onClick={() => router.push("/admin/categories/new")}
            disabled={createCategoryMutation.isPending}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Category Edit/Create Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            initialData={selectedCategory}
            categories={categories}
            onSubmit={handleFormSubmit}
            isEdit={!!selectedCategory}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedCategory(null);
            }}
            isSubmitting={
              createCategoryMutation.isPending ||
              updateCategoryMutation.isPending
            }
          />
        </DialogContent>
      </Dialog>

      <div className="mt-6">
        <CategoryTree
          categories={buildCategoryTree(categories)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onOrderUpdate={handleOrderUpdate}
          onStatusToggle={handleStatusToggle}
          isUpdating={
            updateOrderMutation.isPending ||
            toggleStatusMutation.isPending ||
            deleteCategoryMutation.isPending
          }
          onImageUpdate={() =>
            queryClient.invalidateQueries({ queryKey: ["categories"] })
          }
        />
      </div>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this
              category and all of its subcategories from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              disabled={deleteCategoryMutation.isPending}
              className="cursor-pointer"
            >
              Cancel
            </DialogClose>
            <DialogClose
              onClick={confirmDelete}
              disabled={deleteCategoryMutation.isPending}
              className="bg-blue-400 hover:bg-blue-600 p-2 rounded-md text-white cursor-pointer"
            >
              Continue
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
