"use client";

import { useEffect, useRef, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { X, Loader2 } from "lucide-react";
import { RefreshCw } from 'lucide-react';
import { toast } from "react-hot-toast";
import { useProductForm } from "@/hooks/useProductForm";
import { CategorySelector } from "./CategorySelector";
import { ProductFormData, CategoryType, AttributeType, Dimensions, Weight } from "@/types/product";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import categoryService from "@/services/api/category";
import { createProduct, updateProduct } from "@/services/api/products";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import brandService from "@/services/api/brand";

const STEPS = [
  { id: 'details', label: 'Basic Details', required: ['name', 'description', 'price', 'category', 'imageCover', 'quantity', 'priceUnit'] },
  { id: 'dimensions', label: 'Dimensions & Weight', required: [] },
  { id: 'attributes', label: 'Attributes', required: [] },
  { id: 'variants', label: 'Variants', required: [] },
  { id: 'bulk', label: 'Bulk Options', required: [] },
];

export function ProductForm({
  product,
  categories: initialCategories,
  attributeSets,
}: {
  product?: ProductFormData;
  categories: CategoryType[];
  attributeSets: AttributeType[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();
  const {
    activeTab,
    productId,
    progress,
    formData,
    categories,
    isSubmitting,
    coverImageUrl,
    additionalImageUrls,
    specifications,
    setActiveTab,
    setProductId,
    completeStep,
    updateFormData,
    setCategories,
    setIsSubmitting,
    setCoverImageUrl,
    setAdditionalImageUrls,
    setSpecifications,
    resetForm,
  } = useProductForm();
  const [isRefreshingCategories, setIsRefreshingCategories] = useState(false);
  const [preservedCategory, setPreservedCategory] = useState<string | null>(null);
  // const [isRefreshingCategories, setIsRefreshingCategories] = useState(false);
  // Fetch categories if not provided
  const { data: fetchedCategories = [],refetch: refetchCategories ,isLoading: isCategoriesLoading,
    isError: isCategoriesError, } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoryService.getAllCategories();
      if (!response.success) throw new Error(response.message);
      return response.data || [];
    },
    enabled: initialCategories.length === 0, // Only fetch if no initial categories provided
    initialData: initialCategories,
  });

  const { data: brandsResponse, isLoading: isBrandsLoading, isError: isBrandsError } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await brandService.getAllBrands();
      if (!response.success) throw new Error(response.message);
      return response.data || [];
    },
  });

  const handleRefreshCategories = async () => {
    try {
      setIsRefreshingCategories(true);
      await refetchCategories();
    } finally {
      setIsRefreshingCategories(false);
    }
  };
  // Initialize form data
  useEffect(() => {
    if (product) {
      const formattedProduct = {
        ...product,
        variants: product.variants?.map(variant => ({
          ...variant,
          attributes: variant.attributes || []
        })) || [],
        specifications: product.specifications?.map(spec => ({
          key: spec.key || '',
          value: spec.value || ''
        })) || []
      };
      updateFormData(formattedProduct);
      setProductId(product._id || null);
      setCoverImageUrl(product.imageCover || null);
      setAdditionalImageUrls(product.images || []);
      setSpecifications(formattedProduct.specifications);
      STEPS.forEach(step => completeStep(step.id));
    } else {
      // Initialize with empty arrays for new products
      setSpecifications([]);
    }
    if (initialCategories.length) {
      setCategories(initialCategories);
    } else if (fetchedCategories.length) {
      setCategories(fetchedCategories);
    }
  }, [product, initialCategories, fetchedCategories]);

  // Add mutation for product creation/update
  const productMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = productId 
        ? await updateProduct(productId, formData)
        : await createProduct(formData);
      
      if (!response?.data?.product) {
        throw new Error('Failed to create product');
      }
      return response.data.product;
    },
    onSuccess: (data) => {
      if (data?._id) {
        setProductId(data._id);
        completeStep(activeTab);
        updateFormData({
          ...data,
          category: typeof data.category === 'object' ? data.category._id : data.category,
          brand: typeof data.brand === 'object' ? data.brand._id : data.brand,
        });
        
        if (progress === 100) {
          // Preserve the current category before reset
  setPreservedCategory(formData.category || null);
          // const currentCategory = formData.category; // Save current category
          toast.success('Product created successfully! Ready for next product.');
          setTimeout(() => {
            resetForm();
            if (formRef.current) {
              const fileInputs = formRef.current.querySelectorAll('input[type="file"]');
              fileInputs.forEach(input => (input as HTMLInputElement).value = '');
            }
            setActiveTab('details');
             // Restore the category after reset if it exists
    if (preservedCategory) {
      updateFormData({ category: preservedCategory });
    }
          }, 1000);
        } else {
          toast.success('Product saved successfully');
          const currentIndex = STEPS.findIndex(step => step.id === activeTab);
          if (currentIndex < STEPS.length - 1) {
            setActiveTab(STEPS[currentIndex + 1].id);
          }
        }
        queryClient.invalidateQueries({ queryKey: ['products'] });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save product');
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleTabChange = (newTab: string) => {
    const currentIndex = STEPS.findIndex(step => step.id === activeTab);
    const newIndex = STEPS.findIndex(step => step.id === newTab);

    if (newIndex < currentIndex) {
      setActiveTab(newTab);
      return;
    }

    if (formRef.current) {
      const currentStep = STEPS.find(step => step.id === activeTab);
      if (currentStep?.required) {
        const missingFields = currentStep.required.filter(field => {
          const element = formRef.current?.elements.namedItem(field);
          if (!element) return false;
          
          const value = 'value' in element ? element.value : 
                       'files' in element && element.files ? (element.files as FileList).length > 0 : 
                       'checked' in element ? element.checked : 
                       false;
          
          return !value || (typeof value === 'string' && value.trim() === '');
        });

        if (missingFields.length > 0) {
          toast.error(`Please complete: ${missingFields.join(', ')} before proceeding`);
          return;
        }
      }
    }
    
    setActiveTab(newTab);
  };

  // Handle progress changes
  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        resetForm();
        if (formRef.current) {
          const fileInputs = formRef.current.querySelectorAll('input[type="file"]');
          fileInputs.forEach(input => (input as HTMLInputElement).value = '');
        }
        setActiveTab('details');
        toast.success('Product created successfully! Ready for next product.');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [progress, resetForm]);

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   try {
  //     const form = e.currentTarget;
  //     const formData = new FormData(form);

  //     // If we have a productId, we're updating an existing product
  //     if (productId) {
  //       // Only validate the current step's required fields
  //       const currentStep = STEPS.find(step => step.id === activeTab);
  //       if (currentStep?.required) {
  //         const missingFields = currentStep.required.filter(field => {
  //           const value = formData.get(field);
  //           return !value || (typeof value === 'string' && value.trim() === '');
  //         });

  //         if (missingFields.length > 0) {
  //           toast.error(`Please complete: ${missingFields.join(', ')} before proceeding`);
  //           setIsSubmitting(false);
  //           return;
  //         }
  //       }
  //     } else {
  //       // For new product, validate all required fields from first step
  //       const firstStep = STEPS[0];
  //       const missingFields = firstStep.required.filter(field => {
  //         const value = formData.get(field);
  //         return !value || (typeof value === 'string' && value.trim() === '');
  //       });

  //       if (missingFields.length > 0) {
  //         toast.error(`Please complete: ${missingFields.join(', ')} before proceeding`);
  //         setIsSubmitting(false);
  //         return;
  //       }
  //     }

  //     // Convert boolean values
  //     const isBulkValue = formData.get('isBulk');
  //     if (isBulkValue !== null) {
  //       formData.set('isBulk', String(isBulkValue === 'true' || isBulkValue === 'on'));
  //     }

  //     // Add dimensions and weight
  //     const dimensions = {
  //       length: Number(formData.get('length')) || 0,
  //       width: Number(formData.get('width')) || 0,
  //       height: Number(formData.get('height')) || 0,
  //       unit: formData.get('dimensionUnit') || 'm',
  //       weight: Number(formData.get('weightValue')) || 0,
  //       weightUnit: formData.get('weightUnit') || 'kg'
  //     };
  //     formData.set('dimensions', JSON.stringify(dimensions));

  //     // Add variants directly from form state
  //     const variants = (formData as any).variants?.map((variant: { attributes: Array<{ name: string; value: string }>; price: number; quantity: number }) => ({
  //       attributes: variant.attributes.map((attr: { name: string; value: string }) => ({
  //         name: attr.name,
  //         value: attr.value
  //       })),
  //       price: Number(variant.price) || 0,
  //       quantity: Number(variant.quantity) || 0
  //     }));
  //     if (variants?.length) {
  //       formData.set('variants', JSON.stringify(variants));
  //     }

  //     // Add colors and sizes arrays from form state
  //     if ((formData as any).colors?.length) {
  //       formData.set('colors', (formData as any).colors);
  //     }
  //     if ((formData as any).sizes?.length) {
  //       formData.set('sizes', (formData as any).sizes);
  //     }

  //     // Add specifications
  //     if (specifications.length) {
  //       const specs = specifications.map(spec => ({
  //         key: spec.key,
  //         value: spec.value
  //       }));
  //       formData.set('specifications', JSON.stringify(specs));
  //     }

  //     // Submit the form
  //     productMutation.mutate(formData);
  //   } catch (error) {
  //     console.error('Form submission error:', error);
  //     toast.error('Failed to prepare form data');
  //     setIsSubmitting(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const submissionFormData = new FormData();
  
      // Add basic fields from component state
      submissionFormData.append('name', formData.name || '');
      submissionFormData.append('description', formData.description || '');
      submissionFormData.append('summary', formData.summary || '');
      submissionFormData.append('price', String(formData.price || 0));
      submissionFormData.append('quantity', String(formData.quantity || 0));
      submissionFormData.append('priceUnit', formData.priceUnit || 'piece');
      if (formData.serialNumber) {
        submissionFormData.append('serialNumber', formData.serialNumber);
      }
      submissionFormData.append('category', formData.category || '');
      submissionFormData.append('brand', formData.brand || '');
  
    // Handle dimensions with guaranteed values
    const dimensions = {
      length: formData.dimensions?.length ?? 0,
      width: formData.dimensions?.width ?? 0,
      height: formData.dimensions?.height ?? 0,
      unit: formData.dimensions?.unit ?? 'm'
    };

    const weight = {
      value: formData.weight?.value ?? 0,
      unit: formData.weight?.unit ?? 'kg'
    };

/// Add dimensions as separate fields
submissionFormData.append('dimensions[length]', String(dimensions.length));
submissionFormData.append('dimensions[width]', String(dimensions.width));
submissionFormData.append('dimensions[height]', String(dimensions.height));
submissionFormData.append('dimensions[unit]', dimensions.unit);

// Add weight as separate fields
submissionFormData.append('weight[value]', String(weight.value));
submissionFormData.append('weight[unit]', weight.unit);

  
      // Add cover image
      if (formRef.current) {
        const coverImageInput = formRef.current.querySelector('input[name="imageCover"]') as HTMLInputElement;
        if (coverImageInput?.files?.[0]) {
          submissionFormData.append('imageCover', coverImageInput.files[0]);
        } else if (coverImageUrl && !coverImageUrl.startsWith('blob:')) {
          // If editing and image wasn't changed, send the URL
          submissionFormData.append('imageCoverUrl', coverImageUrl);
        }
      }
  
      // Add additional images
      if (formRef.current) {
        const imagesInput = formRef.current.querySelector('input[name="images"]') as HTMLInputElement;
        if (imagesInput?.files) {
          Array.from(imagesInput.files).forEach(file => {
            submissionFormData.append('images', file);
          });
        }
      }
      // Add existing images if editing
      additionalImageUrls.forEach(url => {
        if (!url.startsWith('blob:')) {
          submissionFormData.append('existingImages', url);
        }
      });
  
      // Add colors
      if (formData.colors) {
        formData.colors.forEach((color, index) => {
          if (color.trim()) {
            submissionFormData.append(`colors[${index}]`, color.trim());
          }
        });
      }
  
      // Add sizes
      if (formData.sizes) {
        formData.sizes.forEach((size, index) => {
          if (size.trim()) {
            submissionFormData.append(`sizes[${index}]`, size.trim());
          }
        });
      }
  
      // Add features
      if (formData.features) {
        formData.features.forEach((feature, index) => {
          if (feature.trim()) {
            submissionFormData.append(`features[${index}]`, feature.trim());
          }
        });
      }
  
      // Add specifications
      specifications.forEach((spec, index) => {
        if (spec.key.trim() && spec.value.trim()) {
          submissionFormData.append(`specifications[${index}][key]`, spec.key);
          submissionFormData.append(`specifications[${index}][value]`, spec.value);
        }
      });
  
      // Add variants
      if (formData.variants) {
        formData.variants.forEach((variant, variantIndex) => {
          submissionFormData.append(`variants[${variantIndex}][price]`, String(variant.price || 0));
          submissionFormData.append(`variants[${variantIndex}][quantity]`, String(variant.quantity || 0));
          
          variant.attributes.forEach((attr, attrIndex) => {
            if (attr.name.trim() && attr.value.trim()) {
              submissionFormData.append(`variants[${variantIndex}][attributes][${attrIndex}][name]`, attr.name);
              submissionFormData.append(`variants[${variantIndex}][attributes][${attrIndex}][value]`, attr.value);
            }
          });
        });
      }
  
      // Add bulk options
      submissionFormData.append('isBulk', String(formData.isBulk || false));
      submissionFormData.append('minBulkQuantity', String(formData.minBulkQuantity || 10));
      submissionFormData.append('bulkDiscountPercentage', String(formData.bulkDiscountPercentage || 0));
  
      // Submit the form
      productMutation.mutate(submissionFormData);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to prepare form data');
      setIsSubmitting(false);
    }
  };
  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = specifications.map((spec, i) => {
      if (i === index) {
        return { ...spec, [field]: value };
      }
      return spec;
    });
    setSpecifications(newSpecs);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {productId ? 'Edit Product' : 'Create New Product'}
          </h2>
          <span className="text-sm text-muted-foreground">{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-6">
          {STEPS.map((step) => (
            <TabsTrigger key={step.id} value={step.id}>
              {step.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium">Product Name *</label>
                  <Input
                    name="name"
                    placeholder="Enter product name"
                    defaultValue={formData.name}
                    required
                    onChange={(e) => updateFormData({ name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea
                    name="description"
                    placeholder="Enter product description"
                    defaultValue={formData.description}
                    required
                    onChange={(e) => updateFormData({ description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Summary</label>
                  <Textarea
                    name="summary"
                    placeholder="Enter product summary"
                    defaultValue={formData.summary}
                    onChange={(e) => updateFormData({ summary: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Price *</label>
                  <Input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    defaultValue={formData.price}
                    required
                    onChange={(e) => updateFormData({ price: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Quantity *</label>
                  <Input
                    type="number"
                    name="quantity"
                    min="0"
                    defaultValue={formData.quantity || 0}
                    required
                    onChange={(e) => updateFormData({ quantity: Number(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Price Unit *</label>
                  <select
                    name="priceUnit"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue={formData.priceUnit || 'piece'}
                    required
                    onChange={(e) => updateFormData({ priceUnit: e.target.value || 'piece' })}
                  >
                    <option value="m2">Square Meter (m²)</option>
                    <option value="m3">Cubic Meter (m³)</option>
                    <option value="piece">Piece</option>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="unit">Unit</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Serial Number</label>
                  <Input
                    name="serialNumber"
                    placeholder="Enter product serial number"
                    defaultValue={formData.serialNumber || ''}
                    onChange={(e) => updateFormData({ serialNumber: e.target.value })}
                  />
                </div>

                <div>
                <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium">Category *</label>
        {isCategoriesError && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshCategories}
            disabled={isRefreshingCategories}
            className="text-xs p-1 h-6"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshingCategories ? 'animate-spin' : ''}`} />
            Refresh Categories
          </Button>
        )}
      </div>
                  {/* <label className="text-sm font-medium">Category *</label> */}
                  {isCategoriesLoading || isRefreshingCategories ? (
        <div className="flex items-center justify-center h-10 rounded-md border border-input bg-background px-3 py-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2 text-sm">Loading categories...</span>
        </div>
      ) : (
        <>
          <CategorySelector
            categories={initialCategories.length > 0 ? initialCategories : fetchedCategories}
            value={formData.category ? [formData.category] : []}
            onChange={(selectedCategories) => {
              updateFormData({ category: selectedCategories[0] || '' });
            }}
            key={formData.category || 'empty'} // Force re-render
          />
          <input
            type="hidden"
            name="category"
            value={formData.category || ''}
            required
          />
        </>
      )}
                </div>

                <div>
                  <label className="text-sm font-medium">Brand</label>
                  {isBrandsLoading ? (
                    <div className="flex items-center h-10">Loading brands...</div>
                  ) : isBrandsError ? (
                    <div className="text-red-500 text-sm">Failed to load brands</div>
                  ) : (
                    <select
                      name="brand"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={formData.brand || ''}
                      onChange={e => updateFormData({ brand: e.target.value })}
                    >
                      <option value="">Select brand</option>
                      {brandsResponse?.map((brand) => (
                        <option key={brand._id} value={brand._id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Cover Image *</label>
                  <Input
                    type="file"
                    name="imageCover"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setCoverImageUrl(url);
                      }
                    }}
                    required={!coverImageUrl}
                  />
                  {coverImageUrl && (
                    <div className="relative w-14 h-14 mt-2">
                      <img
                        src={coverImageUrl}
                        alt="Cover preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImageUrl(null);
                          if (formRef.current) {
                            const input = formRef.current.querySelector('input[name="imageCover"]') as HTMLInputElement;
                            if (input) input.value = '';
                          }
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Additional Images (Max 4)</label>
                  <Input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (additionalImageUrls.length + files.length > 4) {
                        toast.error('Maximum 4 additional images allowed');
                        return;
                      }
                      const urls = files.map(file => URL.createObjectURL(file));
                      setAdditionalImageUrls([...additionalImageUrls, ...urls]);
                    }}
                  />
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {additionalImageUrls.map((url, index) => (
                      <div key={index} className="relative w-full aspect-square">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setAdditionalImageUrls(additionalImageUrls.filter((_, i) => i !== index));
                            if (formRef.current) {
                              const input = formRef.current.querySelector('input[name="images"]') as HTMLInputElement;
                              if (input) input.value = '';
                            }
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dimensions Tab */}
        <TabsContent value="dimensions" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Length</label>
                    <Input
                      type="number"
                      name="length"
                      min="0"
                      step="0.01"
                      defaultValue={formData.dimensions?.length}
                      onChange={(e) => updateFormData({ 
                        dimensions: { 
                          length: Number(e.target.value),
                          width: formData.dimensions?.width || 0,
                          height: formData.dimensions?.height || 0,
                          unit: formData.dimensions?.unit || 'm'
                        } 
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Width</label>
                    <Input
                      type="number"
                      name="width"
                      min="0"
                      step="0.01"
                      defaultValue={formData.dimensions?.width}
                      onChange={(e) => updateFormData({ 
                        dimensions: { 
                          length: formData.dimensions?.length || 0,
                          width: Number(e.target.value),
                          height: formData.dimensions?.height || 0,
                          unit: formData.dimensions?.unit || 'm'
                        } 
                      })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Height</label>
                    <Input
                      type="number"
                      name="height"
                      min="0"
                      step="0.01"
                      defaultValue={formData.dimensions?.height}
                      onChange={(e) => updateFormData({ 
                        dimensions: { 
                          length: formData.dimensions?.length || 0,
                          width: formData.dimensions?.width || 0,
                          height: Number(e.target.value),
                          unit: formData.dimensions?.unit || 'm'
                        } 
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Dimension Unit</label>
                    <select
                      name="dimensionUnit"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      defaultValue={formData.dimensions?.unit || 'm'}
                      onChange={(e) => updateFormData({ 
                        dimensions: { 
                          length: formData.dimensions?.length || 0,
                          width: formData.dimensions?.width || 0,
                          height: formData.dimensions?.height || 0,
                          unit: e.target.value
                        } 
                      })}
                    >
                      <option value="m">Meter (m)</option>
                      <option value="cm">Centimeter (cm)</option>
                      <option value="mm">Millimeter (mm)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Weight</label>
                    <Input
                      type="number"
                      name="weightValue"
                      min="0"
                      step="0.01"
                      defaultValue={formData.weight?.value}
                      onChange={(e) => updateFormData({ 
                        weight: { 
                          value: Number(e.target.value),
                          unit: formData.weight?.unit || 'kg'
                        } 
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Weight Unit</label>
                    <select
                      name="weightUnit"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      defaultValue={formData.weight?.unit || 'kg'}
                      onChange={(e) => updateFormData({ 
                        weight: { 
                          value: formData.weight?.value || 0,
                          unit: e.target.value
                        } 
                      })}
                    >
                      <option value="kg">Kilogram (kg)</option>
                      <option value="g">Gram (g)</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attributes Tab */}
        <TabsContent value="attributes" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium">Colors</label>
                  <div className="space-y-2">
                    {formData.colors?.map((color, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={color}
                          onChange={(e) => {
                            const newColors = [...(formData.colors || [])];
                            newColors[index] = e.target.value;
                            updateFormData({ colors: newColors });
                          }}
                          placeholder="Enter color"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            const newColors = formData.colors?.filter((_, i) => i !== index) || [];
                            updateFormData({ colors: newColors });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newColors = [...(formData.colors || []), ''];
                        updateFormData({ colors: newColors });
                      }}
                    >
                      Add Color
                    </Button>
                    <input
                      type="hidden"
                      name="colors"
                      value={formData.colors?.join(',')}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Sizes</label>
                  <div className="space-y-2">
                    {formData.sizes?.map((size, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={size}
                          onChange={(e) => {
                            const newSizes = [...(formData.sizes || [])];
                            newSizes[index] = e.target.value;
                            updateFormData({ sizes: newSizes });
                          }}
                          placeholder="Enter size"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            const newSizes = formData.sizes?.filter((_, i) => i !== index) || [];
                            updateFormData({ sizes: newSizes });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newSizes = [...(formData.sizes || []), ''];
                        updateFormData({ sizes: newSizes });
                      }}
                    >
                      Add Size
                    </Button>
                    <input
                      type="hidden"
                      name="sizes"
                      value={formData.sizes?.join(',')}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Features</label>
                  <Input
                    name="features"
                    placeholder="Enter features (comma-separated)"
                    defaultValue={formData.features?.join(', ')}
                    onChange={(e) => updateFormData({ features: e.target.value.split(',').map(f => f.trim()) })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Specifications</label>
                  <div className="space-y-2">
                    {specifications.map((spec, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Key"
                          value={spec.key}
                          onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                        />
                        <Input
                          placeholder="Value"
                          value={spec.value}
                          onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeSpecification(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSpecification}
                    >
                      Add Specification
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variants Tab */}
        <TabsContent value="variants" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Product Variants</label>
                  <div className="space-y-4">
                    {formData.variants?.map((variant, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="text-sm font-medium">Price</label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={variant.price}
                              onChange={(e) => {
                                const newVariants = [...(formData.variants || [])];
                                newVariants[index] = {
                                  ...newVariants[index],
                                  price: Number(e.target.value)
                                };
                                updateFormData({ variants: newVariants });
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Quantity</label>
                            <Input
                              type="number"
                              min="0"
                              value={variant.quantity}
                              onChange={(e) => {
                                const newVariants = [...(formData.variants || [])];
                                newVariants[index] = {
                                  ...newVariants[index],
                                  quantity: Number(e.target.value)
                                };
                                updateFormData({ variants: newVariants });
                              }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Attributes</label>
                          {variant.attributes.map((attr, attrIndex) => (
                            <div key={attrIndex} className="flex gap-2">
                              <Input
                                placeholder="Name"
                                value={attr.name}
                                onChange={(e) => {
                                  const newVariants = [...(formData.variants || [])];
                                  const newAttributes = [...newVariants[index].attributes];
                                  newAttributes[attrIndex] = {
                                    ...newAttributes[attrIndex],
                                    name: e.target.value
                                  };
                                  newVariants[index] = {
                                    ...newVariants[index],
                                    attributes: newAttributes
                                  };
                                  updateFormData({ variants: newVariants });
                                }}
                              />
                              <Input
                                placeholder="Value"
                                value={attr.value}
                                onChange={(e) => {
                                  const newVariants = [...(formData.variants || [])];
                                  const newAttributes = [...newVariants[index].attributes];
                                  newAttributes[attrIndex] = {
                                    ...newAttributes[attrIndex],
                                    value: e.target.value
                                  };
                                  newVariants[index] = {
                                    ...newVariants[index],
                                    attributes: newAttributes
                                  };
                                  updateFormData({ variants: newVariants });
                                }}
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                  const newVariants = [...(formData.variants || [])];
                                  const newAttributes = newVariants[index].attributes.filter((_, i) => i !== attrIndex);
                                  newVariants[index] = {
                                    ...newVariants[index],
                                    attributes: newAttributes
                                  };
                                  updateFormData({ variants: newVariants });
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const newVariants = [...(formData.variants || [])];
                              const newAttributes = [...newVariants[index].attributes, { name: '', value: '' }];
                              newVariants[index] = {
                                ...newVariants[index],
                                attributes: newAttributes
                              };
                              updateFormData({ variants: newVariants });
                            }}
                          >
                            Add Attribute
                          </Button>
                          <input
                            type="hidden"
                            name="variants"
                            value={JSON.stringify(formData.variants || [])}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          className="mt-4"
                          onClick={() => {
                            const newVariants = formData.variants?.filter((_, i) => i !== index) || [];
                            updateFormData({ variants: newVariants });
                          }}
                        >
                          Remove Variant
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newVariants = [...(formData.variants || [])];
                        newVariants.push({
                          attributes: [{ name: '', value: '' }],
                          price: 0,
                          quantity: 0
                        });
                        updateFormData({ variants: newVariants });
                      }}
                    >
                      Add Variant
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Options Tab */}
        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium">Bulk Options</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isBulk"
                      id="isBulk"
                      defaultChecked={formData.isBulk}
                      onChange={(e) => {
                        const formData = new FormData(formRef.current!);
                        formData.set('isBulk', e.target.checked.toString());
                        updateFormData({ isBulk: e.target.checked });
                      }}
                    />
                    <label htmlFor="isBulk">Enable bulk pricing</label>
                  </div>
                </div>
             
                <div>
                  <label className="text-sm font-medium">Minimum Bulk Quantity</label>
                  <Input
                    type="number"
                    name="minBulkQuantity"
                    min="2"
                    defaultValue={formData.minBulkQuantity || 10}
                    onChange={(e) => updateFormData({ minBulkQuantity: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Bulk Discount Percentage</label>
                  <Input
                    type="number"
                    name="bulkDiscountPercentage"
                    min="0"
                    max="100"
                    step="0.01"
                    defaultValue={formData.bulkDiscountPercentage || 0}
                    onChange={(e) => updateFormData({ bulkDiscountPercentage: Number(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <div className="space-x-4">
          {activeTab !== 'details' && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const currentIndex = STEPS.findIndex(step => step.id === activeTab);
                setActiveTab(STEPS[currentIndex - 1].id);
              }}
            >
              Previous
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isSubmitting 
              ? 'Saving...' 
              : productId 
                ? 'Update Product' 
                : 'Create Product'}
          </Button>
        </div>
      </div>
    </form>
  );
}