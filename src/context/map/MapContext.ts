import { createContext } from "react";

interface ContextProps {
  isMenu: String;
  isMenuActive: boolean;

  // Methods
  toggleSideMenu: (menu: string) => void;
}

export const UiContext = createContext({} as ContextProps);