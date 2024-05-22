"use client"
import { createContext } from "react";

interface ContextProps {
  isMenu: String;
  localStorageRute: String;
  isMenuActive: boolean;

  // Methods
  toggleSideMenu: (menu: string) => void;
  setLocalStorageRute: (rute: string) => void;
}

export const UIContext = createContext({} as ContextProps);