"use client";

import { Account } from "@models";
import { createContext, Dispatch, SetStateAction } from "react";

export interface IAuthContext {
  account: Account | undefined | null;
  setAccount: Dispatch<SetStateAction<Account | undefined>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  isAuthenticated: boolean;
  isAdmin?: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);
