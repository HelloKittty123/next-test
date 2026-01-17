"use client";

import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import TextCustom, { ITextCustomProp } from "../text-custom";
import clsx from "clsx";

export interface IDatePickerProps {
    placeholder?: string;
    disabled?: boolean;
    onChange?: (...event: any[]) => void;
    error?: { [key: string]: any };
    value?: Date;
    label?: ITextCustomProp;
    className?: string | undefined;
}

export function DatePicker({
    placeholder,
    disabled,
    onChange,
    error,
    value,
    label,
    className,
}: IDatePickerProps) {
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(undefined);

    React.useEffect(() => {
        setDate(value);
    }, [value]);

    return (
        <div className="flex flex-col gap-2 w-full">
            {label && <TextCustom {...label} />}
            <div className="flex flex-col gap-3">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <div
                            className={clsx(
                                "border border-[var(--border-light-theme-border-1)] flex items-center w-full justify-between rounded-lg px-4",
                                className,
                                error && "border-[var(--error-color-error)]",
                            )}
                        >
                            <span
                                className={clsx(
                                    "text-sm font-normal",
                                    date
                                        ? "text-[var(--typography-light-theme-body)]"
                                        : "text-[var(--typography-light-theme-placeholder)]",
                                )}
                            >
                                {date ? date.toLocaleDateString() : placeholder}
                            </span>
                            <ChevronDownIcon />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                    >
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                                if (onChange) {
                                    onChange(date);
                                }
                                setDate(date);
                                setOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
