import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
