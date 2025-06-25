import { configureStore } from '@reduxjs/toolkit';
import productFormReducer from '@/store/productSlice';
import cartReducer from '@/store/cartSlice'
import checkoutReducer from '@/store/checkoutSlice';

export const store = configureStore({
  reducer: {
    productForm: productFormReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;