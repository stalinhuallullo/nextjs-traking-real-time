"use client"
import { FC, useReducer } from "react";
import { UIContext, uiReducer } from "./";

export interface UiState {
  isMenu: string;
  isMenuActive: boolean;
}

const UI_INITIAL_STATE: UiState = {
  isMenu: "RUTE",
  isMenuActive: true,
};

export const UIProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const toggleSideMenu = (menu: string) => {
    dispatch({ type: "[UI] - ToggleMenu", payload: menu });
  };

  const setMenu = (menu: string) => {
    dispatch({ type: "[UI] - SetMenu", payload: menu });
  };

  const getMenu = (menu: string) => {
    dispatch({ type: "[UI] - GetMenu", payload: menu });
  };

  return (
    <UIContext.Provider
      value={{
        ...state,

        // Methods
        toggleSideMenu,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};