import { createContext, useContext, useState } from "react";

// Create the context
const OrderContext = createContext();

// Custom hook for easy usage
export function useOrder() {
  return useContext(OrderContext);
}

// Provider component
export function OrderProvider({ children }) {
  const [orderInfo, setOrderInfo] = useState(null);

  return (
    <OrderContext.Provider value={{ orderInfo, setOrderInfo }}>
      {children}
    </OrderContext.Provider>
  );
}
