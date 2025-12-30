'use client';

import { Account } from "@models";
import { createContext } from "react";

export const AuthContext = createContext<{
  account: Account | undefined | null;
  setAccount: (acc: Account) => void;
  loading: boolean;
  setLoading: (val: boolean) => void;
  setIsAuthenticated: (val: boolean) => void;
  isAuthenticated: boolean;
  isAdmin?: boolean;
  logout: () => void;
}>({
  account: undefined,
  setAccount: (acc) => {},
  loading: true,
  setLoading: (val) => {},
  setIsAuthenticated: (val) => {},
  isAuthenticated: false,
  logout: () => {},
});
