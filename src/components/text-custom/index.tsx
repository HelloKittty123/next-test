import clsx from "clsx";

export interface ITextCustomProp {
  /**
   * the text label render
   */
  text?: string;
  /**
   * the function to custom render text label
   * @param label: the text label render
   * @returns
   */
  render?: (label: string) => React.ReactNode;
  /**
   * label has reuquired or not
   */
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function TextCustom({ text, render, required, className, style }: ITextCustomProp) {
  return (
    <>
      {render ? (
        render(text || "")
      ) : (
        <div
          style={style}
          className={clsx("text-sm font-medium text-[var(--typography-light-theme-label)]", className)}
        >
          {text}
          {required && <span className="text-base text-[var(--error-color-error)] font-semibold"> *</span>}
        </div>
      )}
    </>
  );
}

export default TextCustom;
