"use client";

import clsx from "clsx";
import Image from "next/image";
import React, { useImperativeHandle, useRef, useState } from "react";
import { ErrorMessage } from "../error-message";
import TextCustom, { ITextCustomProp } from "../text-custom";

export interface InputImperativeHandle {
  focus: () => void;
  scrollIntoView: (options?: ScrollIntoViewOptions) => void;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * the props for label of input
   */
  label?: ITextCustomProp;
  /**
   * is text area or only input
   */
  multipleLine?: boolean;
  name?: string;
  ref?: React.Ref<InputImperativeHandle>;
  /**
   * the error of input
   */
  error?: { [key: string]: any };
  /**
   * th custom type only use for input
   */
  customType?: "number" | "phone" | "password";
}

const Input = ({ className, name, ref, label, error, multipleLine, customType, ...rest }: InputProps) => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [typePass, setTypePass] = useState("password");

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    scrollIntoView: (options?: ScrollIntoViewOptions) => {
      inputRef.current?.scrollIntoView(options);
    },
  }));

  const onKeyDownHandle = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!customType) return;
    if (
      event.key !== "Backspace" &&
      event.key !== "Delete" &&
      event.key !== "ArrowDown" &&
      event.key !== "ArrowUp" &&
      event.key !== "ArrowRight" &&
      event.key !== "ArrowLeft"
    ) {
      const value = (event.target as any).value;
      if (customType === "number" || customType === "phone") {
        if (!value && customType === "number") {
          // prevent input 0 at first
          if (event.keyCode < 49 || (event.keyCode > 57 && event.keyCode < 97) || event.keyCode > 105) {
            event.preventDefault();
            event.stopPropagation();
          }
        } else {
          if (event.keyCode < 48 || (event.keyCode > 57 && event.keyCode < 96) || event.keyCode > 105) {
            event.preventDefault();
            event.stopPropagation();
          }
        }
      }
    }
  };

  const changeTypePass = () => {
    if (typePass === "password") {
      setTypePass("text");
    } else if (typePass === "text") {
      setTypePass("password");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <TextCustom {...label} />}
      {multipleLine ? (
        <div
          className={clsx(
            "min-h-[150px] max-h-[300px] w-full rounded-lg border border-[var(--border-light-theme-border-1)] p-4",
            className,
            error ? "border-[var(--error-color-error)]" : ""
          )}
        >
          <textarea
            className={clsx(
              "border-none outline-none text-sm text-[var(--typography-light-theme-body)] placeholder:text-[var(--typography-light-theme-placeholder)] w-full h-full"
            )}
            style={{ resize: "none" }}
            {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            name={name}
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          />
        </div>
      ) : (
        <div
          className={clsx(
            "h-10 w-full flex items-center rounded-lg border border-[var(--border-light-theme-border-1)] px-4 gap-2 hover:border-[var(--primary-primary)]",
            className,
            error ? "border-[var(--error-color-error)]" : ""
          )}
        >
          <input
            className={clsx(
              "border-none outline-none text-sm text-[var(--typography-light-theme-body)] placeholder:text-[var(--typography-light-theme-placeholder)] w-full"
            )}
            {...rest}
            name={name}
            onKeyDown={onKeyDownHandle}
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={customType === "password" ? typePass : rest.type}
          />
          {customType === "password" && (
            <Image
              className="cursor-pointer"
              width={16}
              height={16}
              src={typePass === "text" ? "/icon/eye-on.svg" : "/icon/eye-off.svg"}
              alt=""
              onClick={changeTypePass}
            />
          )}
        </div>
      )}

      {error && <ErrorMessage message={error?.message} />}
    </div>
  );
};

export default Input;
