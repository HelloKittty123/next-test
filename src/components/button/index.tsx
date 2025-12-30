"use client";

import clsx from "clsx";
import { memo } from "react";
import Spinner from "../spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  /**
   * button has loading or not
   */
  loading?: boolean;
  /**
   * the fill color of svg for loading spin
   */
  fill?: string;
  /**
   * the color of spinner
   */
  colorSpin?: string;
}

function Button({ children, className, loading, fill, colorSpin, ...rest }: ButtonProps) {
  return (
    <button
      className={clsx(
        className,
        "cursor-pointer flex items-center justify-center gap-2 hover:opacity-80 border-none outline-none rounded bg-[var(--primary-primary)] text-white h-10 min-w-[120px]"
      )}
      {...rest}
    >
      <span className="text-base font-medium">{children}</span>
      {loading && <Spinner width={20} height={20} color={colorSpin} fill={fill}></Spinner>}
    </button>
  );
}

export default memo(Button);
