"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import PublicLayout from "../../layouts/public-layout";
import { useAuth } from "@hooks";

interface IPublicRouteProps {
  children: React.ReactNode;
}

function PublicRoute({ children }: IPublicRouteProps) {
  const { account, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.replace("/");
    }
  }, [isAuthenticated, loading, router]);

  if (!isAuthenticated && !loading) {
    return <PublicLayout>{children}</PublicLayout>;
  }

  if (loading) {
    return (
      <div
        className="flex items-center w-screen h-screen justify-center
    "
      >
        Loading...
      </div>
    );
  }
  return null;
}

export default PublicRoute;
