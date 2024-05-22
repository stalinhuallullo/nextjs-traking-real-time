"use client"
import { FC, useReducer } from "react";
import { UIContext, uiReducer } from "./";

export interface UiState {
  isMenu: string;
  localStorageRute: string;
  isMenuActive: boolean;
}

const UI_INITIAL_STATE: UiState = {
  isMenu: "RUTE",
  localStorageRute: localStorage.getItem("rute") ?? "",
  isMenuActive: true,
};

export const UIProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const toggleSideMenu = (menu: string) => {
    dispatch({ type: "[UI] - ToggleMenu", payload: menu });
  };

  const setLocalStorageRute = (localStorageRute: string) => {
    dispatch({ type: "[UI] - SetLocalStorageRute", payload: localStorageRute });
  };




  return (
    <UIContext.Provider
      value={{
        ...state,

        // Methods
        toggleSideMenu,
        setLocalStorageRute,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};