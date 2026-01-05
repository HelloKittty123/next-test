"use client";

import clsx from "clsx";
import { memo } from "react";
import Spinner from "../spinner";
import { Tooltip } from "@radix-ui/themes";

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
  classChildrens?: string;
  variant?: "primary" | "cancel" | "basic";
  tooltip?: string;
}

function Button({
  children,
  className,
  loading,
  fill,
  colorSpin,
  classChildrens,
  disabled,
  variant = "primary",
  tooltip,
  ...rest
}: ButtonProps) {
  return (
    <Tooltip hidden={!tooltip} content={tooltip || ""}>
      <button
        className={clsx(
          className,
          "px-2 flex items-center justify-center gap-2 hover:opacity-80 border-none outline-none rounded h-10",
          variant === "primary" && "bg-[var(--primary-primary)] text-white",
          variant === "cancel" && "bg-[var(--error-light)] text-white",
          variant === "basic" &&
            "text-[var(--typography-light-theme-label)]! px-1 py-1 hover:bg-[var(--border-light-theme-border-2)] h-fit!",
          disabled && "opacity-50"
        )}
        {...rest}
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
      >
        <div className={clsx("text-base font-medium", classChildrens)}>{children}</div>
        {loading && <Spinner width={20} height={20} color={colorSpin} fill={fill}></Spinner>}
      </button>
    </Tooltip>
  );
}

export default memo(Button);
