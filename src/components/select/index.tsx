"use client";

import { Select } from "@radix-ui/themes";
import clsx from "clsx";
import { ErrorMessage } from "../error-message";
import TextCustom, { ITextCustomProp } from "../text-custom";
import styles from "./select.module.scss";

interface ISelectProps<T> {
  label?: ITextCustomProp;
  error?: { [key: string]: any };
  placeholder?: string;
  value?: string;
  items: T[];
  bindLabel?: string;
  bindValue?: string;
  renderItems?: (item: T) => React.ReactNode;
  onChange?: (...event: any[]) => void;
  disabled?: boolean;
  trigger?: {
    class?: string;
    style?: React.CSSProperties;
  };
}
export const SelectRadix = <T,>({
  label,
  error,
  placeholder,
  value,
  items,
  bindLabel = "label",
  bindValue = "value",
  renderItems,
  onChange,
  disabled,
  trigger,
}: ISelectProps<T>) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <TextCustom {...label} />}
      <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
        <Select.Trigger
          placeholder={placeholder}
          className={clsx(styles["select-trigger"], trigger?.class)}
          style={trigger?.style}
        />
        <Select.Content>
          {items.map((item, index) => (
            <Select.Item
              key={(typeof item === "object" ? item?.[bindValue as keyof T] || index : item) as React.Key}
              value={(typeof item === "object" ? item?.[bindValue as keyof T] : item) as string}
            >
              {renderItems ? (
                renderItems(item)
              ) : (
                <span>{(typeof item === "object" ? item?.[bindLabel as keyof T] : item) as React.ReactNode}</span>
              )}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      {error && <ErrorMessage message={error?.message} />}
    </div>
  );
};
