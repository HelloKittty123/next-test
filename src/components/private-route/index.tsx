"use client";

import { useAuth } from "@hooks";
import { Navbar, Sidebar } from "@layouts";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import PageLoading from "../page-loading/page-loading";

interface IPrivateRouteProps {
  children: React.ReactNode;
  role?: "admin" | "user";
}

function PrivateRoute({ children, role }: IPrivateRouteProps) {
  const { account, isAuthenticated, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathName = usePathname();

  console.log("pathname", pathName);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      sessionStorage.setItem("prevUrl", pathName);
      router.push("/login");
    } else if (!loading && isAuthenticated && pathName === "/") {
      if (isAdmin) {
        router.replace("/ad");
        return;
      }

      const prevUrl = sessionStorage.getItem("prevUrl");
      if (prevUrl) {
        router.replace(prevUrl);
        sessionStorage.removeItem("prevUrl");
        return;
      }
      router.replace("/u");
    }
  }, [loading, isAuthenticated, router, pathName, isAdmin, role]);

  if (account) {
    if (role) {
      return <>{children}</>;
    }
    return (
      <div className="w-screen h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 min-h-0">
          {isAdmin && <Sidebar />}
          <div className="flex-1 min-w-0 h-full">{children}</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <PageLoading />;
  }
  return null;
}

export default PrivateRoute;
