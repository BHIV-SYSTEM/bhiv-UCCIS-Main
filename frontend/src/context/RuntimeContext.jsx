import React, { createContext, useContext, useState } from "react";

const RuntimeContext = createContext();

export function RuntimeProvider({ children }) {
  const [runtime] = useState({
    health: 98,
    region: "India",
    version: "1.0.0",
  });

  return (
    <RuntimeContext.Provider value={{ runtime }}>
      {children}
    </RuntimeContext.Provider>
  );
}

export const useRuntime = () => useContext(RuntimeContext);