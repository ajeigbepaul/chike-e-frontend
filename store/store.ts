import { configureStore } from '@reduxjs/toolkit';
import productFormReducer from '@/store/productSlice';
import cartReducer from '@/store/cartSlice'
import checkoutReducer from '@/store/checkoutSlice';
import wishlistReducer from '@/store/wishlistSlice';

export const store = configureStore({
  reducer: {
    productForm: productFormReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    wishlist: wishlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;