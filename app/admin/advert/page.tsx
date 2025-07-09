"use client";
import React, { useState } from "react";
import advertService from "@/services/api/advert";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const AdvertPage = () => {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cta, setCta] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      toast.error("Image is required");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subTitle", subTitle);
      formData.append("description", description);
      formData.append("cta", cta);
      formData.append("image", image);
      await advertService.createAdvert(formData);
      toast.success("Advert created successfully");
      setTitle("");
      setSubTitle("");
      setDescription("");
      setCta("");
      setImage(null);
      setPreviewUrl("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create advert");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-lg border-0">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Create New Advert
          </CardTitle>
          <p className="text-gray-500 mt-2 text-sm">
            Fill in the details below to create a new homepage advert banner.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
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
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <label className="block font-medium mb-2 text-gray-700">
                  Image
                </label>
                <div className="w-full flex flex-col items-center">
                  <label
                    htmlFor="advert-image-upload"
                    className="cursor-pointer w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-white hover:border-blue-400 transition"
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Click to upload
                        <br />
                        1200x600px
                      </span>
                    )}
                  </label>
                  <Input
                    id="advert-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required
                  />
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
            <div className="flex justify-end">
              <Button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60 shadow-md"
                disabled={!image || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Create Advert"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvertPage;
