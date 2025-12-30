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
export const SelectRadix = <T extends object>({
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
              key={(item?.[bindLabel as keyof T] || index) as React.Key}
              value={item?.[bindValue as keyof T] as string}
            >
              {renderItems ? renderItems(item) : <span>{item?.[bindLabel as keyof T] as React.ReactNode}</span>}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      {error && <ErrorMessage message={error?.message} />}
    </div>
  );
};
