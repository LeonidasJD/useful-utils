//**MODULES */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

//**UTILS */
import { cn } from "@/utils/cn";

const textVariants = cva(
  "font-normal transition-colors [&_a]:font-bold [&_a]:text-green-500 [&_a]:hover:underline",
  {
    variants: {
      variant: {
        h1: "text-5xl leading-[120%] font-bold md:text-7xl",
        h2: "text-4xl leading-[120%] font-bold md:text-6xl",
        h3: "text-3xl leading-[120%] font-bold md:text-5xl",
        h4: "text-2xl leading-[140%] font-bold md:text-3xl",
        h5: "text-xl leading-[140%] font-bold md:text-2xl",
        h6: "text-lg leading-[140%] font-bold md:text-xl",
        title: "text-4xl leading-[140%] font-extrabold uppercase md:text-5xl",
        subtitle: "text-lg font-bold uppercase sm:text-xl",
        p: "",
      },
      color: {
        default: "text-gray-900 dark:text-white",
        white: "text-white",
        green: "text-green-500",
        deepGreen: "text-green-800",
        error: "text-red-500",
        "nav-link": "font-bold text-gray-900 hover:text-green-500",
        link: "font-bold text-green-500 hover:underline",
        linkGray: "text-gray-900 hover:underline",
        darkGreen: "text-green-800",
        darkGray: "text-gray-900",
        lightGold: "text-gold-300",
      },
    },
    defaultVariants: {
      variant: "p",
      color: "default",
    },
  }
);

interface TextProps
  // Omit the color prop so we can use a custom one
  extends Omit<React.ComponentPropsWithoutRef<"p">, "color">,
    VariantProps<typeof textVariants> {
  asChild?: boolean;
}

function Text({
  className,
  variant,
  color,
  asChild,
  children,
  ...props
}: TextProps) {
  // If the tag is one of the headings it will be renders as that, otherwise it will be a paragraph,
  // tag can be overridden by using the asChild prop, which will render the first child passed as the tag, keeping the variant styles
  // also all the styles can be overridden by using the className prop
  const tag =
    variant === "subtitle" ? "p" : variant === "title" ? "h1" : variant || "p";
  const Component = asChild ? Slot : tag;

  return (
    <Component
      className={cn(textVariants({ variant, color, className }))}
      {...props}
    >
      {children}
    </Component>
  );
}

export { Text, textVariants };
