import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductFormData, CategoryType, AttributeType } from '@/types/product';

const STEPS = [
  { id: 'details', label: 'Basic Details' },
  { id: 'dimensions', label: 'Dimensions & Weight' },
  { id: 'attributes', label: 'Attributes' },
  { id: 'variants', label: 'Variants' },
  { id: 'bulk', label: 'Bulk Options' },
];

interface ProductFormState {
  activeTab: string;
  productId: string | null;
  progress: number;
  completedSteps: Record<string, boolean>;
  formData: ProductFormData;
  categories: CategoryType[];
  attributeSets: AttributeType[];
  isSubmitting: boolean;
  coverImageUrl: string | null;
  additionalImageUrls: string[];
  specifications: Array<{ key: string; value: string }>;
}

const initialState: ProductFormState = {
  activeTab: 'details',
  productId: null,
  progress: 0,
  completedSteps: STEPS.reduce((acc, step) => ({ ...acc, [step.id]: false }), {}),
  formData: {
    name: '',
    description: '',
    summary: '',
    price: 0,
    quantity: 0,
    priceUnit: 'piece',
    serialNumber: '',
    category: '',
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      unit: 'm',
    },
    weight: {
      value: 0,
      unit: 'kg',
    },
    colors: [],
    sizes: [],
    features: [],
    isBulk: false,
    minBulkQuantity: 10,
    bulkDiscountPercentage: 0,
    variants: [],
    images: [],
    imageCover: ''
  },
  categories: [],
  attributeSets: [],
  isSubmitting: false,
  coverImageUrl: null,
  additionalImageUrls: [],
  specifications: [],
};

const productSlice = createSlice({
  name: 'productForm',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setProductId: (state, action: PayloadAction<string | null>) => {
      state.productId = action.payload;
    },
    completeStep: (state, action: PayloadAction<string>) => {
      state.completedSteps[action.payload] = true;
      // Recalculate progress whenever a step is completed
      const completedCount = Object.values(state.completedSteps).filter(Boolean).length;
      state.progress = Math.round((completedCount / STEPS.length) * 100);
    },
    updateFormData: (state, action: PayloadAction<Partial<ProductFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setCategories: (state, action: PayloadAction<CategoryType[]>) => {
      state.categories = action.payload;
    },
    setAttributeSets: (state, action: PayloadAction<AttributeType[]>) => {
      state.attributeSets = action.payload;
    },
    setIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setCoverImageUrl: (state, action: PayloadAction<string | null>) => {
      state.coverImageUrl = action.payload;
    },
    setAdditionalImageUrls: (state, action: PayloadAction<string[]>) => {
      state.additionalImageUrls = action.payload;
    },
    setSpecifications: (
      state,
      action: PayloadAction<Array<{ key: string; value: string }>>
    ) => {
      state.specifications = action.payload;
    },
    resetForm: () => initialState,
  },
});

export const {
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
} = productSlice.actions;

export default productSlice.reducer;