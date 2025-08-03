import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductFormData, CategoryType, AttributeType, Brand } from '@/types/product';

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
  brands: Brand[];
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
    brand: '',
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
  brands: [],
  attributeSets: [],
  isSubmitting: false,
  coverImageUrl: null,
  additionalImageUrls: [],
  specifications: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setProductId: (state, action: PayloadAction<string | null>) => {
      state.productId = action.payload;
    },
    updateFormData: (state, action: PayloadAction<Partial<ProductFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setAccessories: (state, action: PayloadAction<Array<{ _id: string; name: string; products: string[] }>>) => {
      // Convert the simple format to the Product format for the state
      state.formData.accessories = action.payload.map(acc => ({
        _id: acc._id,
        name: acc.name,
        products: acc.products.map(productId => ({ _id: productId } as any))
      }));
    },
    setCategories: (state, action: PayloadAction<CategoryType[]>) => {
      state.categories = action.payload;
    },
    setBrands: (state, action: PayloadAction<Brand[]>) => {
      state.brands = action.payload;
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
    addSpecification: (state, action: PayloadAction<{ key: string; value: string }>) => {
      state.specifications.push(action.payload);
    },
    removeSpecification: (state, action: PayloadAction<number>) => {
      state.specifications.splice(action.payload, 1);
    },
    updateSpecification: (state, action: PayloadAction<{ index: number; spec: { key: string; value: string } }>) => {
      state.specifications[action.payload.index] = action.payload.spec;
    },
    setSpecifications: (state, action: PayloadAction<Array<{ key: string; value: string }>>) => {
      state.specifications = action.payload;
    },
    completeStep: (state, action: PayloadAction<string>) => {
      state.completedSteps[action.payload] = true;
      // Calculate progress
      const totalSteps = Object.keys(state.completedSteps).length;
      const completedSteps = Object.values(state.completedSteps).filter(Boolean).length;
      state.progress = Math.round((completedSteps / totalSteps) * 100);
    },
    resetForm: (state) => {
      return { ...initialState };
    },
    setCompletedStep: (state, action: PayloadAction<{ step: string; completed: boolean }>) => {
      state.completedSteps[action.payload.step] = action.payload.completed;
      // Calculate progress
      const totalSteps = Object.keys(state.completedSteps).length;
      const completedSteps = Object.values(state.completedSteps).filter(Boolean).length;
      state.progress = Math.round((completedSteps / totalSteps) * 100);
    },
  },
});

export const {
  setActiveTab,
  setProductId,
  updateFormData,
  setCategories,
  setBrands,
  setAttributeSets,
  setIsSubmitting,
  setCoverImageUrl,
  setAdditionalImageUrls,
  addSpecification,
  removeSpecification,
  updateSpecification,
  setSpecifications,
  completeStep,
  resetForm,
  setCompletedStep,
  setAccessories,
} = productSlice.actions;

export default productSlice.reducer;