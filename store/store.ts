import { configureStore } from '@reduxjs/toolkit';
import productFormReducer from '@/store/productSlice';

export const store = configureStore({
  reducer: {
    productForm: productFormReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;