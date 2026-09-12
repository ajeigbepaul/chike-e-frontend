"use client";

import React, { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Advert } from "@/services/api/advert";

interface AdvertFormProps {
  /** Pass an advert to edit it; omit to create a new one. */
  initialData?: Advert;
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

const AdvertForm = ({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
}: AdvertFormProps) => {
  const isEdit = Boolean(initialData?._id);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [subTitle, setSubTitle] = useState(initialData?.subTitle ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [cta, setCta] = useState(initialData?.cta ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    initialData?.image ?? ""
  );

  const inputId = `advert-image-upload-${initialData?._id ?? "new"}`;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // On create an image is mandatory; on edit, keeping the existing one is fine.
    if (!isEdit && !image) {
      toast.error("Image is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("cta", cta);
    // Only send a file when one was picked, so the backend leaves the
    // existing image untouched on a text-only edit.
    if (image) formData.append("image", image);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Title
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Advert title"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              SubTitle
            </label>
            <Input
              type="text"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              placeholder="Short catchy subtitle"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              CTA (Call to Action)
            </label>
            <Input
              type="text"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              placeholder="e.g. Shop Now, Learn More"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <label className="block font-medium mb-2 text-gray-700">Image</label>
          <div className="w-full flex flex-col items-center">
            <label
              htmlFor={inputId}
              className="cursor-pointer w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-white hover:border-blue-400 transition overflow-hidden"
            >
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Advert preview"
                  width={160}
                  height={160}
                  unoptimized
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-gray-400 text-sm text-center">
                  Click to upload
                  <br />
                  1200x600px
                </span>
              )}
            </label>
            <Input
              id={inputId}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {isEdit && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Leave as-is to keep the current image
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block font-medium mb-1 text-gray-700">
          Description
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the advert..."
          rows={4}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          disabled={isSubmitting || (!isEdit && !image)}
        >
          {isSubmitting
            ? isEdit
              ? "Saving..."
              : "Creating..."
            : isEdit
              ? "Save Changes"
              : "Create Advert"}
        </Button>
      </div>
    </form>
  );
};

export default AdvertForm;
