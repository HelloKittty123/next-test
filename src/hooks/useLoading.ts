"use client";

import { LoadingContext } from "@contexts";
import { useContext } from "react";

export default function useLoading() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("useLoading must be used inside LoadingProvider");
  }

  return context;
}
