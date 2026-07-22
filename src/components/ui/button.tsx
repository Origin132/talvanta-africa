import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "light";

const baseStyles =
  "inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] border px-5 py-3 text-center text-sm font-bold leading-5 no-underline shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "border-green bg-green text-white hover:bg-navy hover:border-navy",
  secondary: "border-gold bg-gold text-navy hover:bg-white",
  outline: "border-navy bg-white text-navy hover:bg-soft-grey",
  light: "border-white bg-white text-navy hover:bg-gold hover:border-gold",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

export function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  className?: string;
  variant?: ButtonVariant;
};

export function ButtonLink({
  children,
  href,
  className = "",
  variant = "primary",
}: ButtonLinkProps) {
  return (
    <Link
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      href={href}
    >
      {children}
    </Link>
  );
}
