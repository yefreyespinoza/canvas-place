import React, { createContext, ReactNode } from "react";
import io, { Socket } from "socket.io-client";

const socketApp: Socket = io("http://192.168.0.4:4000");
const initialState = {
  socketApp,
};
export const AppContext = createContext<{ socketApp: Socket }>(initialState);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AppContext.Provider value={{ socketApp }}>{children}</AppContext.Provider>
  );
};
