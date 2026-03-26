import { cva, type VariantProps } from "class-variance-authority";
import Icon from "./icon";
import Skeleton from "./skeleton";

export const buttonVariants = cva("inline-flex items-center justify-center cursor-pointer transition group", {
  variants: {
    variant: {
      none: "",
      primary: "bg-green-base hover:bg-green-dark",
      secondary: "bg-gray-200 hover:bg-pink-dark",
      tertiary: "bg-transparent hover:bg-gray-200",
    },
    size: {
      sm: "w-6 h-6 p-1 rounded",
    },
    disabled: {
      true: "cursor-not-allowed pointer-events-none opacity-50",
    }
  },
  defaultVariants: {
    variant: "primary",
    size: "sm",
    disabled: false,
  },
})

export const buttonIconVariants = cva("transition", {
  variants: {
    variant: {
      none: "",
      primary: "fill-white",
      secondary: "fill-pink-base group-hover:fill-white",
      tertiary: "fill-gray-300 group-hover:fill-gray-400",
    },
    size: {
      sm: "w-4 h-4",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "sm",
  },
})

interface ButtonIconProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'disabled'>, VariantProps<typeof buttonVariants>, VariantProps<typeof buttonIconVariants> {
  icon: React.ComponentProps<typeof Icon>["svg"];
  loading?: boolean;
}

export default function ButtonIcon({ variant, size, disabled, icon, loading, className, ...props }: ButtonIconProps) {

  if (loading) return <Skeleton rounded='sm' className={buttonVariants({ variant: "none", size, className })} />;

  return (
    <button className={buttonVariants({ variant, size, disabled, className })} {...props}>
      <Icon svg={icon} className={buttonIconVariants({ variant, size })} />
    </button>
  )
}