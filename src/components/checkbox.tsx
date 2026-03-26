import { cva, type VariantProps } from "class-variance-authority"
import Icon from "./icon"
import Check from "../assets/icons/check.svg?react"
import Skeleton from "./skeleton"

export const checkboxWrapperVariants = cva("inline-flex items-center justify-center  relative group", {
  variants: {
    disabled: {
      true: 'pointer-events-none opacity-50',
    },
  },
  defaultVariants: {
    disabled: false,
  },
})

export const checkboxVariants = cva("appearance-none peer flex items-center cursor-pointer justify-center transition overflow-hidden", {
  variants: {
    variant: {
      none: "",
      default: "border-2 border-solid hover:border-green-dark border-green-base hover:bg-green-dark/20 checked:border-green-base checked:bg-green-base group-hover:checked:border-green-dark group-hover:checked:bg-green-dark",
    },
    size: {
      md: 'w-5 h-5 rounded-sm'
    },
    disabled: {
      true: 'pointer-events-none opacity-50',
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    disabled: false
  }
})

export const checkboxIconVariants = cva("absolute top-1/2 left-1 -translate-y-1/2 hidden peer-checked:block fill-white", {
  variants: {
    size: {
      md: "w-3 h-3",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'disabled'>, VariantProps<typeof checkboxVariants> {
  loading?: boolean;
}

export default function Checkbox({ variant, size, disabled, loading, className, ...props }: CheckboxProps) {


  if (loading) return <Skeleton rounded="full" className={checkboxVariants({ variant: "none", size, disabled, className })} />;

  return (
    <label className={checkboxWrapperVariants({ disabled })}>
      <input type="checkbox" className={checkboxVariants({ variant, size, disabled, className })} {...props} />
      <Icon svg={Check} className={checkboxIconVariants({ size })} />
    </label>
  )
}