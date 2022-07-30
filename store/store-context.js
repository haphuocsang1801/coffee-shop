import { createContext, useReducer } from "react";
export const ACTION_TYPE = {
  SET_LAST_LONG: "SET_LAST_LONG",
  SET_COFFEE_STORES: " SET_COFFEE_STORES",
};

export const StoreContext = createContext();

const storeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPE.SET_LAST_LONG:
      return {
        ...state,
        latLong: action.payload.latLong,
      };
    case ACTION_TYPE.SET_COFFEE_STORES:
      return {
        ...state,
        coffeeStores: action.payload.coffeeStores,
      };
    default:
      throw new Error(`Unhandle action type: ${action.type}`);
  }
};

const StoreProvider = ({ children }) => {
  const initalState = {
    latLong: "",
    coffeeStores: [],
  };
  const [state, dispatch] = useReducer(storeReducer, initalState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};
export default StoreProvider;
