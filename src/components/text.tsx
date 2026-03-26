import { cva, type VariantProps } from 'class-variance-authority';
import React, { type JSX } from 'react';

export const textVariants = cva("font-sans text-gray-400", {
  variants: {
    variant: {
      "body-sm-bold": "text-sm leading-5 font-semibold",
      "body-md": "text-base leading-6 font-normal",
      "body-md-bold": "text-base leading-6 font-semibold",
    }
  },
  defaultVariants: {
    variant: "body-md"
  }
});

interface TextProps extends VariantProps<typeof textVariants> {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children?: React.ReactNode;
}

export default function Text({ as = 'span', variant, className, children, ...props }: TextProps) {
  return React.createElement(as, {
    className: textVariants({ variant, className }),
    ...props
  }, children)
}