import React from "react";
import { cva, type VariantProps, cx } from "class-variance-authority";

export const iconVariants = cva("", {
  variants: {
    animate: {
      spin: "animate-spin"
    }
  },
  defaultVariants: {
    animate: undefined
  }
});

interface IconProps extends React.SVGProps<SVGSVGElement>, VariantProps<typeof iconVariants> {
  svg: React.FC<React.SVGProps<SVGSVGElement>>;
}

export default function Icon({svg, animate, className, ...props}: IconProps) {
  const SvgComponent = svg;
  return <SvgComponent {...props} className={cx(iconVariants({ animate }), className)} />
}