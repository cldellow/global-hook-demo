import React, { createContext } from 'react';

export interface Cookie {
  value: string;
}

export type CookieContextType = {
  getCookieValue: () => Promise<Cookie>;
}

export const CookieContext = createContext<CookieContextType | undefined>(
  undefined
);

export const CookieContextProvider = (
  props: React.PropsWithChildren<CookieContextType>
) => {
  return <CookieContext.Provider
    value={props}>
    {props.children}
  </CookieContext.Provider>
}
