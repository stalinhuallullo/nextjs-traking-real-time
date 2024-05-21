"use client"
import { createContext } from "react";

interface ContextProps {
  isMenu: String;
  isMenuActive: boolean;

  // Methods
  toggleSideMenu: (menu: string) => void;
}

export const UIContext = createContext({} as ContextProps);