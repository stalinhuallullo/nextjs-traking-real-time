"use client"
import { FC, useEffect, useReducer, useState } from "react";
import { UIContext, uiReducer } from "./";
import { getApiRoutes } from "@/utils/functions-utils";
import { Route } from "@/interfaces/routes-interface";

export interface UiState {
  isMenu: string;
  localStorageRute: string;
  isMenuActive: boolean;
}

const UI_INITIAL_STATE: UiState = {
  isMenu: "RUTE",
  localStorageRute: "01",
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