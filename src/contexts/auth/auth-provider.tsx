"use client";

import { Account } from "@models";
import { decodeBase64URL, fetchData } from "@utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "./auth-context";
import { getAccountAD, logoutAD } from "@services";

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
        const decode = decodeBase64URL(accesToken);

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
      const response = await getAccountAD();

      if (response) {
        setAccount(response);
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

  const logout = async () => {
    try {
      if (isAdmin) {
        await logoutAD();

        setIsAdmin(false);
      }
      localStorage.clear();
      sessionStorage.clear();
      setAccount(undefined);
      setIsAuthenticated(false);

      router.replace("/login");
    } catch (error) {
      toast("Đăng xuất thất bại, vui lòng thử lại sau!", { type: "error" });
    }
  };

  return (
    <AuthContext.Provider
      value={{ account, setAccount, loading, setLoading, isAuthenticated, logout, setIsAuthenticated, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
