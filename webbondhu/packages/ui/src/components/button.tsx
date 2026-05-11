import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
const buttonVariants = cva("inline-flex items-center justify-center rounded-xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5A0] disabled:pointer-events-none disabled:opacity-50", { variants: { variant: { primary: "bg-[#00E5A0] text-black hover:bg-[#18f5b4]", secondary: "bg-[#7C3AED] text-white hover:bg-[#8b5cf6]", ghost: "text-white hover:bg-white/10" }, size: { sm: "h-9 px-3", md: "h-11 px-5", lg: "h-12 px-7" } }, defaultVariants: { variant: "primary", size: "md" } });
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean; }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => { const Comp = asChild ? Slot : "button"; return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />; });
Button.displayName = "Button";
