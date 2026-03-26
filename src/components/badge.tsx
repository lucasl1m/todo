import React from "react";
import { cva, cx, type VariantProps } from "class-variance-authority";
import Text from "./text";
import Skeleton from "./skeleton";

export const textVariants = cva("", {
  variants: {
    variant: {
      none: "",
      primary: "text-green-dark",
      secondary: "text-pink-dark",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
 });

export const badgeVariants = cva("inline-flex items-center justify-center rounded-full", {
  variants: {
    variant: {
      none: "",
      primary: "bg-green-light",
      secondary: "bg-pink-light",
    },
    size: {
      sm: "px-2 py-0.5",
    }
  },
  defaultVariants: {
    variant: "primary",
    size: "sm"
  }
});

export const skeletonBadgeVariants = cva("", {
  variants: {
    size: {
      sm: "w-6 h-6",
    },
  },
  defaultVariants: {
    size: "sm",
  },
})

interface BadgeProps extends VariantProps<typeof badgeVariants>, React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
}

export default function Badge({ variant, size, className, loading, children, ...props }: BadgeProps) {
  if (loading) return <Skeleton rounded="full" className={cx(badgeVariants({ variant: "none" }), skeletonBadgeVariants({ size }), className)} />;

  return (
    <div className={badgeVariants({ variant, size, className })} {...props}>
      <Text variant="body-sm-bold" className={textVariants({ variant })}>
        {children}
      </Text>
    </div>
  )
}