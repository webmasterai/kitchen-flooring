import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "link";

const variants: Record<Variant, string> = {
  primary:
    "inline-flex items-center justify-center gap-2 bg-forest text-white px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-200 hover:bg-forest-deep focus-visible:outline-offset-4",
  secondary:
    "inline-flex items-center justify-center gap-2 border border-forest text-forest px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-200 hover:bg-forest hover:text-white",
  ghost:
    "inline-flex items-center justify-center gap-2 text-forest text-sm font-semibold tracking-wide transition-colors duration-200 hover:text-forest-deep",
  link: "inline-flex items-center gap-2 text-forest font-semibold underline underline-offset-4 decoration-forest/40 hover:decoration-forest transition-colors duration-200",
};

type Props = ComponentProps<typeof Link> & {
  variant?: Variant;
  className?: string;
};

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: Props) {
  let content = children;
  if (typeof children === "string" && children.includes("→")) {
    const parts = children.split("→");
    content = (
      <>
        <span>{parts[0].trim()}</span>
        <span
          className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1"
          aria-hidden="true"
        >
          →
        </span>
      </>
    );
  }

  return (
    <Link className={`group ${variants[variant]} ${className}`} {...props}>
      {content}
    </Link>
  );
}
