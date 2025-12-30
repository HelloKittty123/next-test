"use client";

import { Account } from "@models";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { fetchData } from "@utils";

interface IAuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [account, setAccount] = useState<Account>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (loading) getAccount();
  }, [loading]);

  const getAccountLocal = (): boolean => {
    try {
      const accesToken = localStorage.getItem("acess_token") || sessionStorage.getItem("access_token");
      if (accesToken) {
        const decode = atob(accesToken);

        const account: Account = JSON.parse(decode);
        if (["email", "name", "type"].every((k) => account.hasOwnProperty(k))) {
          setAccount(account);
          setIsAuthenticated(true);
          setLoading(false);

          return true;
        }
      }
    } catch (error) {
      console.log(error);
    }

    return false;
  };

  const getAccount = async () => {
    try {
      const response = await fetchData<{
        verified: boolean;
        message: string;
        data: { email: string; name: string; type: "a" | "u" };
      }>({
        api: "/api/admin/auth",
        method: "GET",
      });

      if (response?.verified) {
        setAccount(response.data);
        setIsAuthenticated(true);
        setLoading(false);
        setIsAdmin(true);

        return;
      }
    } catch (error) {
      console.log(error);
    }

    if (getAccountLocal()) return;
    setLoading(false);
    setIsAuthenticated(false);
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setAccount(undefined);
    setIsAuthenticated(false);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{ account, setAccount, loading, setLoading, isAuthenticated, logout, setIsAuthenticated, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
