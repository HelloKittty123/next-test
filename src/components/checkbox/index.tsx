import { Checkbox } from "@radix-ui/themes";
import TextCustom, { ITextCustomProp } from "../text-custom";
import clsx from "clsx";

export interface ICheckBoxProps {
  label?: ITextCustomProp;
  value?: boolean;
  className?: string;
  checkbox?: {
    className?: string;
    style?: React.CSSProperties;
  };
  onChange?: (...event: any[]) => void;
  disabled?: boolean;
}

function CheckboxRadix({ label, value, className, checkbox, onChange }: ICheckBoxProps) {
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <Checkbox checked={value} {...checkbox} onCheckedChange={onChange} />
      {label && <TextCustom {...label} />}
    </div>
  );
}

export default CheckboxRadix;
