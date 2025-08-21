import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  moq?: number; // Minimum Order Quantity
  category?: string; // Added for promotion/coupon compatibility
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// VAT rate constant (7%)
const VAT_RATE = 0.07;

// Utility functions for cart calculations
export const calculateItemTotal = (price: number, quantity: number) =>
  price * quantity;

export const calculateSubtotal = (items: CartItem[]) =>
  items.reduce(
    (sum, item) => sum + calculateItemTotal(item.price, item.quantity),
    0
  );

export const calculateVAT = (items: CartItem[]) => {
  const subtotal = calculateSubtotal(items);
  return subtotal * VAT_RATE;
};

export const calculateTotalWithVAT = (items: CartItem[]) => {
  const subtotal = calculateSubtotal(items);
  const vat = calculateVAT(items);
  return subtotal + vat;
};

const initialState: CartState = {
  items: [],
  isOpen: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      // Always ensure moq is present in the payload
      const payloadWithMOQ = {
        ...action.payload,
        moq: action.payload.moq !== undefined ? action.payload.moq : 1,
      };
      if (existingItem) {
        existingItem.quantity += payloadWithMOQ.quantity;
        // Update moq and other fields if present in payload
        if (payloadWithMOQ.moq !== undefined) {
          existingItem.moq = payloadWithMOQ.moq;
        }
        if (payloadWithMOQ.name) {
          existingItem.name = payloadWithMOQ.name;
        }
        if (payloadWithMOQ.price) {
          existingItem.price = payloadWithMOQ.price;
        }
        if (payloadWithMOQ.image) {
          existingItem.image = payloadWithMOQ.image;
        }
        if (payloadWithMOQ.category) {
          existingItem.category = payloadWithMOQ.category;
        }
      } else {
        state.items.push(payloadWithMOQ);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCart,
} = cartSlice.actions;

export default cartSlice.reducer;
