// hooks/useProductForm.ts
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  setActiveTab,
  setProductId,
  setCompletedStep,
  updateFormData,
  setCategories,
  setAttributeSets,
  setIsSubmitting,
  setCoverImageUrl,
  setAdditionalImageUrls,
  addSpecification,
  removeSpecification,
  updateSpecification,
  setSpecifications,
  resetForm,
  completeStep,
} from "@/store/productSlice";
import { AttributeType, CategoryType, ProductFormData } from "@/types/product";

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
  } = useSelector(
    (state: RootState) =>
      state.productForm as {
        activeTab: string;
        productId: string | null;
        progress: number;
        formData: ProductFormData;
        categories: CategoryType[];
        attributeSets: AttributeType[];
        isSubmitting: boolean;
        coverImageUrl: string | null;
        additionalImageUrls: string[];
        specifications: Array<{ key: string; value: string }>;
        completedSteps: Record<string, boolean>;
      }
  );

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
    setCompletedStep: (step: { step: string; completed: boolean }) =>
      dispatch(setCompletedStep(step)),
    updateFormData: (data: Partial<ProductFormData>) =>
      dispatch(updateFormData(data)),
    setCategories: (categories: CategoryType[]) =>
      dispatch(setCategories(categories)),
    setAttributeSets: (attributeSets: AttributeType[]) =>
      dispatch(setAttributeSets(attributeSets)),
    setIsSubmitting: (isSubmitting: boolean) =>
      dispatch(setIsSubmitting(isSubmitting)),
    setCoverImageUrl: (url: string | null) => dispatch(setCoverImageUrl(url)),
    setAdditionalImageUrls: (urls: string[]) =>
      dispatch(setAdditionalImageUrls(urls)),
    addSpecification: (spec: { key: string; value: string }) =>
      dispatch(addSpecification(spec)),
    removeSpecification: (index: number) =>
      dispatch(removeSpecification(index)),
    updateSpecification: (
      index: number,
      spec: { key: string; value: string }
    ) => dispatch(updateSpecification({ index, spec })),
    setSpecifications: (specs: Array<{ key: string; value: string }>) =>
      dispatch(setSpecifications(specs)),
    resetForm: () => dispatch(resetForm()),
    completeStep: (step: string) => dispatch(completeStep(step)),
    setAccessories: (
      accessories: Array<{ name: string; products: string[] }>
    ) => dispatch({ type: "product/setAccessories", payload: accessories }),

    // Helper function to calculate progress
    getCurrentProgress: () => {
      const completedCount =
        Object.values(completedSteps).filter(Boolean).length;
      return Math.round(
        (completedCount / Object.keys(completedSteps).length) * 100
      );
    },
  };
};
