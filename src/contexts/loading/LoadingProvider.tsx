"use client";

import { useState } from "react";
import { LoadingContext } from "./LoadingContext";
import { Spinner } from "@components";

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <LoadingContext value={{ loading, setLoading }}>
      {children}
      {loading && (
        <div className="w-screen h-screen flex items-center justify-center bg-gray-50 opacity-65 z-9999 absolute top-0 left-0">
          <Spinner width={40} height={40} />
        </div>
      )}
    </LoadingContext>
  );
};
