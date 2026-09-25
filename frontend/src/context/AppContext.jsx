import {
  createContext,
  useState
} from "react";

export const AppContext =
createContext();

export default function AppProvider({
  children
}) {

  const [theme] =
    useState("light");

  return (
    <AppContext.Provider
      value={{
        theme
      }}
    >
      {children}
    </AppContext.Provider>
  );
}