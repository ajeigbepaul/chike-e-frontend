// hooks/useProductForm.ts
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
  setActiveTab,
  setProductId,
  completeStep,
  updateFormData,
  setCategories,
  setAttributeSets,
  setIsSubmitting,
  setCoverImageUrl,
  setAdditionalImageUrls,
  setSpecifications,
  resetForm,
} from '@/store/productSlice';
import { AttributeType, CategoryType, ProductFormData } from '@/types/product';

export const useProductForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Select all relevant state from Redux store
  const {
    activeTab,
    productId,
    progress,
    formData,
    categories,
    attributeSets,
    isSubmitting,
    coverImageUrl,
    additionalImageUrls,
    specifications,
    completedSteps,
  } = useSelector((state: RootState) => state.productForm);

  return {
    // State values
    activeTab,
    productId,
    progress,
    formData,
    categories,
    attributeSets,
    isSubmitting,
    coverImageUrl,
    additionalImageUrls,
    specifications,
    completedSteps,

    // Action dispatchers
    setActiveTab: (tab: string) => dispatch(setActiveTab(tab)),
    setProductId: (id: string | null) => dispatch(setProductId(id)),
    completeStep: (step: string) => dispatch(completeStep(step)),
    updateFormData: (data: Partial<ProductFormData>) => dispatch(updateFormData(data)),
    setCategories: (categories: CategoryType[]) => dispatch(setCategories(categories)),
    setAttributeSets: (attributeSets: AttributeType[]) => dispatch(setAttributeSets(attributeSets)),
    setIsSubmitting: (isSubmitting: boolean) => dispatch(setIsSubmitting(isSubmitting)),
    setCoverImageUrl: (url: string | null) => dispatch(setCoverImageUrl(url)),
    setAdditionalImageUrls: (urls: string[]) => dispatch(setAdditionalImageUrls(urls)),
    setSpecifications: (specs: Array<{ key: string; value: string }>) => 
      dispatch(setSpecifications(specs)),
    resetForm: () => dispatch(resetForm()),

    // Helper function to calculate progress
    getCurrentProgress: () => {
      const completedCount = Object.values(completedSteps).filter(Boolean).length;
      return Math.round((completedCount / Object.keys(completedSteps).length) * 100);
    }
  };
};