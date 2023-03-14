import { configureStore } from '@reduxjs/toolkit';

import filterReducer from './filterSlice';
import authReducer from './authSlice';
import wishlistReducer from './wishlistSlice';
import cartReducer from './cartSlice';
import productsSlice from './productSlice'

const store = configureStore({
  reducer: {
    filter: filterReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    products: productsSlice,
  },
});

export default store;
