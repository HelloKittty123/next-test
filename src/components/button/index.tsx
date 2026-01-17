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
    size?: "xs" | "sm" | "base";
}

function Button({
    children,
    className,
    loading,
    fill,
    colorSpin,
    classChildrens,
    disabled = false,
    variant = "primary",
    tooltip,
    size = "base",
    ...rest
}: ButtonProps) {
    return (
        <Tooltip hidden={!tooltip} content={tooltip || ""}>
            <button
                className={clsx(
                    className,
                    "px-2 flex items-center justify-center gap-2! hover:opacity-80 border-none outline-none rounded font-medium",
                    size === "xs" && "h-7 text-xs",
                    size === "sm" && "h-8 text-sm",
                    size === "base" && "h-10 text-base",
                    variant === "primary" &&
                        "bg-[var(--primary-primary)] text-white",
                    variant === "cancel" &&
                        "bg-[var(--background-light-theme-disable)] text-[var(--typography-light-theme-body)]",
                    variant === "basic" &&
                        "text-[var(--typography-light-theme-label)]! px-1 py-1 h-fit! ",
                    disabled && "opacity-50"
                )}
                {...rest}
                disabled={disabled}
                style={{ cursor: disabled ? "not-allowed" : "pointer" }}
            >
                {children}
                {loading && (
                    <Spinner
                        width={20}
                        height={20}
                        color={colorSpin}
                        fill={fill}
                    ></Spinner>
                )}
            </button>
        </Tooltip>
    );
}

export default memo(Button);
