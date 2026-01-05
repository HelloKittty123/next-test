import { AESUitls, decodeBase64URL } from "@utils";
import { NextRequest } from "next/server";

export function getTokenFromHeader(headers: Headers) {
  const authHeader = headers.get("authorization");

  if (!authHeader) return null;
  // Cắt bỏ chữ "Bearer " để lấy token nguyên bản
  const token = authHeader.split(" ")[1];

  return token;
}

export function getCurrentLogin(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value || getTokenFromHeader(req.headers);
  try {
    if (token) {
      const decode = decodeBase64URL(token);
      const payload = JSON.parse(decode);
      const { ADMIN_ACCOUNT: adminAccount, SECRET_KEY } = process.env;

      if (
        payload.type === "a" &&
        payload.email === adminAccount &&
        payload.name === "admin" &&
        payload.scretKey === SECRET_KEY
      ) {
        return { email: adminAccount, name: payload.name, type: payload.type };
      }
    }
  } catch (err) {
    throw Error(JSON.stringify(err));
  }

  return null;
}
