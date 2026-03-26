import { cva, type VariantProps, cx } from "class-variance-authority";
import { textVariants } from "./text";

export const inputTextVariants = cva("border-b border-solid border-gray-200 focus:border-pink-base bg-transparent outline-none", {
  variants: {
    size: {
      md: "pb-2 px-2",
    },
    disabled: {
      true: "pointer-events-none",
    },
  },
  defaultVariants: {
    size: "md",
    disabled: false,
  },
})

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'disabled'>, VariantProps<typeof inputTextVariants> {}

export default function InputText({ size, disabled, className, ...props }: InputProps) {
  return (
    <input className={cx(inputTextVariants({ size, disabled, className }), textVariants(), className)} {...props} />
  )
}