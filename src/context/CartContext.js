"use client";

import { createContext, useContext, useReducer, useState, useEffect } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.items.find(
        (item) => (item._id || item.id) === (action.payload._id || action.payload.id),
      );
      
      // If moving from savedItems, remove it from there
      const newSavedItems = state.savedItems.filter(
        (item) => (item._id || item.id) !== (action.payload._id || action.payload.id)
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            (item._id || item.id) === (action.payload._id || action.payload.id)
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
          savedItems: newSavedItems
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        savedItems: newSavedItems
      };
    }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => (item._id || item.id) !== action.payload),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          (item._id || item.id) === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };
    case "SAVE_FOR_LATER": {
      const itemToSave = state.items.find(
        (item) => (item._id || item.id) === action.payload
      );
      if (!itemToSave) return state;
      
      return {
        ...state,
        items: state.items.filter((item) => (item._id || item.id) !== action.payload),
        savedItems: [...state.savedItems, itemToSave]
      };
    }
    case "REMOVE_FROM_SAVED":
      return {
        ...state,
        savedItems: state.savedItems.filter((item) => (item._id || item.id) !== action.payload),
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], savedItems: [] });
  const [toast, setToast] = useState({ show: false, message: "" });

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    showToast("Item added to the cart");
  };

  const saveForLater = (id) => {
    dispatch({ type: "SAVE_FOR_LATER", payload: id });
    showToast("Item saved for later");
  };

  const removeFromSaved = (id) => {
    dispatch({ type: "REMOVE_FROM_SAVED", payload: id });
  };

  const showToast = (message) => {
    setToast({ show: true, message });
  };

  const hideToast = () => {
    setToast({ show: false, message: "" });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const getTotal = () => {
    return state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  return (
    <CartContext.Provider
      value={{ 
        ...state, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        getTotal,
        saveForLater,
        removeFromSaved,
        toast,
        hideToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
