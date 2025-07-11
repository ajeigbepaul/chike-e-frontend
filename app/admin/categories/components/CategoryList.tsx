"use client";

import { Category } from "../types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Pencil, Trash2, Image as ImageIcon, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import categoryService from "@/services/api/category";

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onOrderUpdate: (categoryId: string, newOrder: number) => void;
  onStatusToggle: (categoryId: string, isActive: boolean) => void;
  onEditImage: (category: Category) => void;
  isUpdating?: boolean;
  onImageUpdate?: () => void; // Callback to refresh categories after image update
}

export default function CategoryList({
  categories,
  onEdit,
  onDelete,
  onOrderUpdate,
  onStatusToggle,
  onEditImage,
  isUpdating = false,
  onImageUpdate,
}: CategoryListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const getCategoryPath = (category: Category) => {
    if (!category.ancestors?.length) return category.name;
    return `${category.ancestors.map((a) => a.name).join(" > ")} > ${
      category.name
    }`;
  };

  const handleImageUpload = async (categoryId: string, file: File) => {
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

    setUploadingImage(categoryId);
    try {
      const response = await categoryService.updateCategoryImage(
        categoryId,
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
      setUploadingImage(null);
    }
  };

  const handleImageClick = (categoryId: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("data-category-id", categoryId);
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const categoryId = event.target.getAttribute("data-category-id");

    if (file && categoryId) {
      handleImageUpload(categoryId, file);
    }

    // Reset the input
    event.target.value = "";
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {categories.map((category) => (
        <div
          key={category._id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center space-x-4 flex-1">
            {/* Category image with upload functionality */}
            <div className="relative group">
              {category.image ? (
                <div className="relative">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={48}
                    height={48}
                    className="rounded object-cover border w-12 h-12 cursor-pointer"
                    onClick={() => handleImageClick(category._id)}
                  />
                  {uploadingImage === category._id && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded transition-all duration-200 flex items-center justify-center">
                    <Upload className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              ) : (
                <div
                  className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => handleImageClick(category._id)}
                >
                  <ImageIcon className="h-5 w-5 text-gray-400" />
                </div>
              )}
            </div>
            <h3 className="font-medium">{getCategoryPath(category)}</h3>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Order:</span>
              <Input
                type="number"
                value={category.order}
                onChange={(e) =>
                  onOrderUpdate(category._id, parseInt(e.target.value))
                }
                className="w-20"
                disabled={isUpdating}
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Active:</span>
              <Switch
                checked={category.isActive}
                onCheckedChange={(checked) =>
                  onStatusToggle(category._id, checked)
                }
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
