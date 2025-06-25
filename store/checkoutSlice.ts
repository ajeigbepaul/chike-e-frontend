import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CustomerAddress {
  name: string;
  address: string;
  phone: string;
}

interface DeliveryDetails {
  pickupStation: string;
  deliveryDate: string;
}

interface CheckoutState {
  customerAddress: CustomerAddress | null;
  deliveryDetails: DeliveryDetails | null;
  paymentMethod: string;
}

const initialState: CheckoutState = {
  customerAddress: null,
  deliveryDetails: null,
  paymentMethod: '',
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCustomerAddress(state, action: PayloadAction<CustomerAddress>) {
      state.customerAddress = action.payload;
    },
    setDeliveryDetails(state, action: PayloadAction<DeliveryDetails>) {
      state.deliveryDetails = action.payload;
    },
    setPaymentMethod(state, action: PayloadAction<string>) {
      state.paymentMethod = action.payload;
    },
    clearCheckout(state) {
      state.customerAddress = null;
      state.deliveryDetails = null;
      state.paymentMethod = '';
    },
  },
});

export const { setCustomerAddress, setDeliveryDetails, setPaymentMethod, clearCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer; 