import { IADFormLogin } from "@types";
import { fetchData } from "@utils";

export const loginAD = (payload: IADFormLogin) => {
  return fetchData<{ message: string; verified: boolean }>({
    api: "/api/login",
    method: "POST",
    payload,
  });
};

export const getAccountAD = () => {
  return fetchData<{
    email: string;
    name: string;
    type: "a" | "u";
  }>({
    api: "/api/admin/auth",
    method: "GET",
  });
};

export const logoutAD = () => {
  return fetchData<{ message: string }>({
    api: "/api/admin/logout",
    method: "GET",
  });
};
