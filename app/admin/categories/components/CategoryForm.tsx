"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useState, useRef } from "react";

interface CategoryFormData {
  name: string;
  isActive: boolean;
  order: number;
  parent?: string;
  level?: number;
}

interface CategoryFormProps {
  initialData?: CategoryFormData | null;
  categories: { _id: string; name: string }[];
  onSubmit: SubmitHandler<CategoryFormData>;
  isEdit: boolean;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  isActive: z.boolean(),
  order: z.number().min(0),
});

type FormData = z.infer<typeof formSchema>;

export function CategoryForm({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isSubmitting,
  isEdit,
}: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    isActive: initialData?.isActive ?? true,
    order: initialData?.order || 0,
    parent: initialData?.parent || "",
    level: initialData?.level,
    image: undefined as File | undefined,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine if this is a main category (no parent or level === 1)
  const isMainCategory = !formData.parent;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" && "checked" in e.target
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: undefined }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Category Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      {/* Parent Category dropdown */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Parent Category
        </label>
        <select
          name="parent"
          value={formData.parent || ""}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">None (Main Category)</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Order</label>
        <input
          type="number"
          name="order"
          value={formData.order}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          id="isActive"
        />
        <label htmlFor="isActive" className="text-sm">
          Active
        </label>
      </div>
      {/* Image upload (main categories only) */}
      {isMainCategory && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Category Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
          {imagePreview && (
            <div className="mt-2 relative w-24 h-24">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded border"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                title="Remove image"
              >
                &times;
              </button>
            </div>
          )}
        </div>
      )}
      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isEdit ? "Update" : "Add"} Category
        </button>
        <button
          type="button"
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
