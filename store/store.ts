import { configureStore } from '@reduxjs/toolkit';
import productFormReducer from '@/store/productSlice';
import cartReducer from '@/store/cartSlice'
export const store = configureStore({
  reducer: {
    productForm: productFormReducer,
    cart: cartReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;