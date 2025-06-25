"use client"
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { updateFormData, setCompletedStep } from '@/store/productSlice';
import { useQuery } from '@tanstack/react-query';
import categoryService from '@/services/api/category';
import brandService from '@/services/api/brand';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const priceUnits = [
  'm2', 'm3', 'piece', 'kg', 'unit', 'set', 'box', 'roll', 'liter', 'gallon',
  'meter', 'cm', 'mm', 'feet', 'inch'
];

export default function BasicDetailsForm() {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.productForm.formData);

  // Fetch categories
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoryService.getAllCategories();
      if (!response.success) throw new Error(response.message);
      return response.data || [];
    },
  });

  // Fetch brands
  const { data: brandsResponse } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await brandService.getAllBrands();
      if (!response.success) throw new Error(response.message);
      return response.data || [];
    },
  });

  // Check if form is complete
  useEffect(() => {
    const isComplete = Boolean(
      formData.name &&
      formData.description &&
      formData.price > 0 &&
      formData.quantity > 0 &&
      formData.category &&
      formData.priceUnit
    );

    dispatch(setCompletedStep({ step: 'details', completed: isComplete }));
  }, [formData, dispatch]);

  const handleInputChange = (field: string, value: string | number) => {
    dispatch(updateFormData({ [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter product name"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter product description"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="summary">Summary (Optional)</Label>
          <Textarea
            id="summary"
            value={formData.summary || ''}
            onChange={(e) => handleInputChange('summary', e.target.value)}
            placeholder="Enter product summary"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
              placeholder="Enter price"
              min={0}
            />
          </div>

          <div>
            <Label htmlFor="priceUnit">Price Unit</Label>
            <Select
              value={formData.priceUnit}
              onValueChange={(value) => handleInputChange('priceUnit', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {priceUnits.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
            placeholder="Enter quantity"
            min={0}
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleInputChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoriesResponse?.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="brand">Brand</Label>
          <Select
            value={formData.brand || ''}
            onValueChange={(value) => handleInputChange('brand', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brandsResponse?.map((brand) => (
                <SelectItem key={brand._id} value={brand._id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="serialNumber">Serial Number (Optional)</Label>
          <Input
            id="serialNumber"
            value={formData.serialNumber || ''}
            onChange={(e) => handleInputChange('serialNumber', e.target.value)}
            placeholder="Enter serial number"
          />
        </div>
      </div>
    </div>
  );
} 