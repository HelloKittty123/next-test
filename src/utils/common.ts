import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";

export const isFormInvalid = (err: any) => {
    if (Object.keys(err).length > 0) return true;
    return false;
};

export function findInputError(errors: any, name: string) {
    if (!errors || !name) return {};
    const filtered = Object.keys(errors)
        .filter((key) => key.includes(name))
        .reduce((cur, key) => {
            return Object.assign(cur, { error: errors[key] });
        }, {});
    return filtered;
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const encodeBase64URL = (str: string) => {
    return Buffer.from(str)
        .toString("base64")
        .replace(/=/g, "") // Xóa dấu = (Padding)
        .replace(/\+/g, "-") // Thay + bằng -
        .replace(/\//g, "_"); // Thay / bằng _
};

export const decodeBase64URL = (base64url: string) => {
    // Thêm lại dấu = nếu cần thiết để Buffer hiểu
    let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    return Buffer.from(base64, "base64").toString("utf8");
};

export function formatToIsoDate(
    value: string,
    type: "start" | "end" = "start",
): string | null {
    if (!value) {
        return null;
    }
    if (type === "start") {
        return moment(value)
            .utc()
            .add(7, "hour")
            .startOf("day")
            .subtract(7, "hour")
            .toISOString();
    }
    return moment(value)
        .utc()
        .add(7, "hour")
        .endOf("day")
        .subtract(7, "hour")
        .set("millisecond", 0)
        .toISOString();
}

export function formatDate(
    value: string,
    format: string = "YYYY-MM-DD",
): string | null {
    if (!value) {
        return null;
    }

    return moment(value).format(format);
}
