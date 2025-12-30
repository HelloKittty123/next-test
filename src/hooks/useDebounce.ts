"use client";

import { useEffect, useState } from "react";

const useDebounce = (value: string, delay: number = 300): string => {
  const [debounceValue, setDebounceValue] = useState<string>('');

  useEffect(() => {
    const timeout = setTimeout(() => setDebounceValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounceValue;
};

export default useDebounce;
