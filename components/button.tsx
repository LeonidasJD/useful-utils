import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full text-lg font-bold whitespace-nowrap shadow-none ring-current transition duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-2",
        text: "border-none bg-transparent focus-visible:ring-offset-0",
      },
      color: {
        green: "",
        gray: "",
        white: "",
        red: "",
        lightGray: "",
        darkGrey: "",
        whiteGreen: "",
      },
      size: {
        sm: "h-10 min-w-20 gap-1.5 px-5 py-2 text-sm has-[>svg]:px-2.5",
        md: "h-12 min-w-40 px-6 py-2 text-base has-[>svg]:px-4",
        lg: "h-16 min-w-48 px-4 py-3 has-[>svg]:px-3",
        icon: "size-9",
      },
    },
    compoundVariants: [
      // classes for specific combinations of props
      {
        variant: "default",
        color: "gray",
        className:
          "border-2 border-gray-900 bg-gray-900 text-white focus-visible:ring-gray-900",
      },
      {
        variant: "default",
        color: "white",
        className:
          "border-2 border-gray-900 text-gray-900 focus-visible:ring-gray-900",
      },
      {
        variant: "default",
        color: "whiteGreen",
        className:
          "border-2 border-gray-900 bg-white text-green-800 hover:bg-gray-700 focus-visible:ring-gray-900",
      },
      {
        variant: "default",
        color: "lightGray",
        className:
          "bg-gray-400 text-black hover:bg-gray-900 focus-visible:ring-gray-900",
      },
      {
        variant: "default",
        color: "darkGrey",
        className: "bg-gray-900 text-white focus-visible:ring-gray-900",
      },
      {
        variant: "default",
        color: "green",
        className:
          "border-2 border-gray-900 bg-green-500 text-gray-900 hover:border-white hover:text-white focus-visible:ring-gray-900",
      },

      {
        variant: "outline",
        color: "green",
        className: "border-green-500 text-green-500",
      },
      {
        variant: "outline",
        color: "gray",
        className:
          "border-gray text-gray-900 hover:bg-gray-900 hover:text-white",
      },
      {
        variant: "outline",
        color: "white",
        className: "border-white text-white hover:bg-white hover:text-gray-900",
      },
      {
        variant: "text",
        color: "green",
        className: "text-green-500 hover:bg-green-500/10",
      },
      {
        variant: "text",
        color: "gray",
        className: "text-gray-900 hover:bg-gray-900/10",
      },
    ],
    defaultVariants: {
      variant: "default",
      color: "gray",
      size: "md",
    },
  }
);

function Button({
  className,
  variant,
  size,
  color,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, color, className }))}
      {...props}
    />
  );
}

export { Button };
