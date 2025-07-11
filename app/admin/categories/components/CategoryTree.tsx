"use client";
import { Category } from "../types";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Image as ImageIcon,
  Upload,
  Pencil,
} from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { toast } from "react-hot-toast";
import categoryService from "@/services/api/category";
import chikeLogo from "@/public/chikelogo.png";
interface CategoryTreeProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onOrderUpdate: (categoryId: string, newOrder: number) => void;
  onStatusToggle: (categoryId: string, isActive: boolean) => void;
  isUpdating?: boolean;
  onImageUpdate?: () => void; // Callback to refresh categories after image update
}

interface TreeNodeProps {
  category: Category;
  level: number;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onOrderUpdate: (categoryId: string, newOrder: number) => void;
  onStatusToggle: (categoryId: string, isActive: boolean) => void;
  isUpdating?: boolean;
  onImageUpdate?: () => void;
}

const TreeNode = ({
  category,
  level,
  onEdit,
  onDelete,
  onOrderUpdate,
  onStatusToggle,
  isUpdating,
  onImageUpdate,
}: TreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [orderValue, setOrderValue] = useState(category.order.toString());
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOrderSubmit = () => {
    const newOrder = parseInt(orderValue);
    if (!isNaN(newOrder)) {
      onOrderUpdate(category._id, newOrder);
    }
    setIsEditingOrder(false);
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      const response = await categoryService.updateCategoryImage(
        category._id,
        file
      );
      if (response.success) {
        toast.success("Category image updated successfully");
        onImageUpdate?.(); // Refresh the categories list
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update category image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // Reset the input
    event.target.value = "";
  };

  return (
    <div className="ml-4">
      {/* Hidden file input for this node */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
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

        {/* Category image with upload functionality (only for main categories) */}
        {category.level === 1 && (
          <div className="relative group h-10 w-10">
            <Image
              src={
                category.image ? category.image : chikeLogo
              }
              alt={category.name}
              width={50}
              height={50}
              style={{ objectFit: "contain" }}
              className="rounded object-cover border w-full h-full"
            />
            {/* Update icon button (top-right corner) */}
            <button
              type="button"
              onClick={handleImageClick}
              className="absolute top-0 right-0 bg-opacity-80 p-1 shadow hover:bg-opacity-100 transition z-20"
              title="Update Category Image"
            >
              <Pencil className="h-3 w-3 text-blue-600" />
            </button>
            {uploadingImage && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
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

      {isExpanded &&
        category.subcategories &&
        category.subcategories.length > 0 && (
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
                onImageUpdate={onImageUpdate}
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
  isUpdating,
  onImageUpdate,
}: CategoryTreeProps) {
  // Get top-level categories
  const categoryTree = buildCategoryTree(categories);

  return (
    <div className="space-y-2">
      {categoryTree.map((category) => (
        <TreeNode
          key={category._id}
          category={category}
          level={0}
          onEdit={onEdit}
          onDelete={onDelete}
          onOrderUpdate={onOrderUpdate}
          onStatusToggle={onStatusToggle}
          isUpdating={isUpdating}
          onImageUpdate={onImageUpdate}
        />
      ))}
    </div>
  );
}

function buildCategoryTree(categories: Category[]): Category[] {
  const map: { [key: string]: Category & { subcategories: Category[] } } = {};
  const roots: (Category & { subcategories: Category[] })[] = [];

  // Initialize map and subcategories
  categories.forEach((cat) => {
    map[cat._id] = {
      ...cat,
      subcategories: cat.subcategories || [],
    };
  });

  // Build the tree
  categories.forEach((cat) => {
    if (cat.parent && map[cat.parent]) {
      map[cat.parent].subcategories.push(map[cat._id]);
    } else {
      roots.push(map[cat._id]);
    }
  });

  // Sort root categories by order
  roots.sort((a, b) => a.order - b.order);

  // Recursively sort subcategories
  function sortSubcategories(
    category: Category & { subcategories: Category[] }
  ) {
    category.subcategories.sort((a, b) => a.order - b.order);
    category.subcategories.forEach((sub) =>
      sortSubcategories(sub as Category & { subcategories: Category[] })
    );
  }

  roots.forEach(sortSubcategories);

  return roots;
}
