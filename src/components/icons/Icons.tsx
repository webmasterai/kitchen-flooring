import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type IconProps = {
  className?: string;
  title?: string;
  /** Pixel size used for SVG width/height attributes (CSS classes still control display size). */
  size?: number;
};

function SvgIcon({
  className,
  title,
  size = 20,
  viewBox = "0 0 24 24",
  children,
  fill = "none",
}: IconProps & {
  viewBox?: string;
  children: ReactNode;
  fill?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill={fill}
      className={cn("inline-block shrink-0", className)}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function IconPin({ className, title, size = 20 }: IconProps) {
  return (
    <SvgIcon className={cn("h-5 w-5", className)} title={title} size={size}>
      <path
        d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </SvgIcon>
  );
}

export function IconClock({ className, title, size = 20 }: IconProps) {
  return (
    <SvgIcon className={cn("h-5 w-5", className)} title={title} size={size}>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 8v4.5l3 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

export function IconPhone({ className, title, size = 20 }: IconProps) {
  return (
    <SvgIcon className={cn("h-5 w-5", className)} title={title} size={size}>
      <path
        d="M7.5 4.5h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v3A2 2 0 0 1 18.5 19.5 14 14 0 0 1 4.5 5.5a2 2 0 0 1 3-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

export function IconMail({ className, title, size = 20 }: IconProps) {
  return (
    <SvgIcon className={cn("h-5 w-5", className)} title={title} size={size}>
      <rect x="3.5" y="6" width="17" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4.5 7.5 7.5 5.5 7.5-5.5" stroke="currentColor" strokeWidth="1.5" />
    </SvgIcon>
  );
}

export function IconArrow({ className, title, size = 20 }: IconProps) {
  return (
    <SvgIcon className={cn("h-5 w-5", className)} title={title} size={size}>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

export function IconPencil({ className, title, size = 28 }: IconProps) {
  return (
    <SvgIcon
      className={cn("h-7 w-7", className)}
      title={title}
      size={size}
      viewBox="0 0 48 48"
    >
      {/* Bold design pen — matches approved benefits reference */}
      <path
        d="M14.2 39.5 9.8 42l2.4-4.5 18.8-18.8 4.4 4.4L14.2 39.5Z"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="m31 18.7 4.3 4.3 5.2-5.2a3.1 3.1 0 0 0 0-4.4l-.9-.9a3.1 3.1 0 0 0-4.4 0L31 18.7Z"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 37.2h5.2M34.8 12.2l2.6-4.8"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

export function IconDiamond({ className, title, size = 28 }: IconProps) {
  return (
    <SvgIcon
      className={cn("h-7 w-7", className)}
      title={title}
      size={size}
      viewBox="0 0 48 48"
    >
      {/* Generated bold gem icon */}
      <path
        d="M15 8h18l9 12L24 42 6 20l9-12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M15 8h18M6 20h36M15 8 6 20l18 22L42 20 33 8M15 8l9 12 9-12M24 20v22"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

export function IconPeople({ className, title, size = 28 }: IconProps) {
  return (
    <SvgIcon
      className={cn("h-7 w-7", className)}
      title={title}
      size={size}
      viewBox="0 0 48 48"
    >
      {/* Generated bold people icon */}
      <circle cx="17" cy="14.5" r="5.8" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="31.5" cy="15.5" r="5" fill="none" stroke="currentColor" strokeWidth="3" />
      <path
        d="M6.5 37.5c1.4-6.2 5.2-9.5 10.5-9.5S26.1 31.3 27.5 37.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M25.8 35.5c1.3-4 4-6.2 7-6.2s5.6 2.2 6.9 6.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

export function IconLeafMark({ className, title, size = 28 }: IconProps) {
  return (
    <SvgIcon
      className={cn("h-7 w-7", className)}
      title={title}
      size={size}
      viewBox="0 0 48 48"
    >
      {/* Generated bold leaf icon */}
      <path
        d="M24 6c11 8 14 20 12 30-8 2-16 2-24 0C10 26 13 14 24 6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M24 12v28M24 20c-4 2-7.5 4.5-10 7.5M24 20c4 2 7.5 4.5 10 7.5M24 28c-3.5 1.5-6.5 3.5-8.5 6M24 28c3.5 1.5 6.5 3.5 8.5 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

export function IconFacebook({ className, title, size = 16 }: IconProps) {
  return (
    <SvgIcon
      className={cn("h-4 w-4", className)}
      title={title}
      size={size}
      fill="currentColor"
    >
      <path d="M14.5 8.5V7.2c0-.7.3-1.2 1.3-1.2H17V3.5h-2.1C12.2 3.5 11 5 11 7v1.5H9v2.7h2V20.5h3.5v-9.3h2.3l.4-2.7h-2.7Z" />
    </SvgIcon>
  );
}

export function IconInstagram({ className, title, size = 16 }: IconProps) {
  return (
    <SvgIcon className={cn("h-4 w-4", className)} title={title} size={size}>
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16.7" cy="7.3" r="1" fill="currentColor" />
    </SvgIcon>
  );
}

export function IconChevron({ className, title, size = 16 }: IconProps) {
  return (
    <SvgIcon className={cn("h-4 w-4", className)} title={title} size={size}>
      <path
        d="m7 10 5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

export function IconLightbulb({ className, title, size = 24 }: IconProps) {
  return (
    <SvgIcon className={cn("h-6 w-6", className)} title={title} size={size} viewBox="0 0 48 48">
      <path
        d="M18 34h12M20 40h8M24 6a12 12 0 0 0-7 21.6c1.4 1 2.2 2.4 2.4 4.2h9.2c.2-1.8 1-3.2 2.4-4.2A12 12 0 0 0 24 6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

export function IconShield({ className, title, size = 24 }: IconProps) {
  return (
    <SvgIcon className={cn("h-6 w-6", className)} title={title} size={size} viewBox="0 0 48 48">
      <path
        d="M24 6 10 12v11c0 9 6 16.5 14 19 8-2.5 14-10 14-19V12L24 6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="m18 24 4 4 8-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

export function IconLeaf({ className, title, size = 96 }: IconProps) {
  return (
    <SvgIcon
      className={cn("h-24 w-24", className)}
      title={title}
      size={size}
      viewBox="0 0 120 120"
    >
      <path
        d="M90 18C52 24 28 52 24 96c28-8 54-28 66-58-10 8-24 14-38 16 22-18 36-34 38-36Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </SvgIcon>
  );
}

export function IconTools({ className, title, size = 28 }: IconProps) {
  return (
    <SvgIcon
      className={cn("h-7 w-7", className)}
      title={title}
      size={size}
      viewBox="0 0 48 48"
    >
      <path
        d="M14 34 34 14M18 14h-4v4M34 30v4h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 12c4 0 8 4 8 8l-6 2-4-4 2-6ZM12 28l6 2 4-4-2-6c-4 0-8 4-8 8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

export function IconSearch({ className, title, size = 20 }: IconProps) {
  return (
    <SvgIcon className={cn("h-5 w-5", className)} title={title} size={size}>
      <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

export function IconClose({ className, title, size = 20 }: IconProps) {
  return (
    <SvgIcon className={cn("h-5 w-5", className)} title={title} size={size}>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

export function IconLock({ className, title, size = 16 }: IconProps) {
  return (
    <SvgIcon className={cn("h-4 w-4", className)} title={title} size={size}>
      <rect x="6" y="11" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9 11V8.5a3 3 0 0 1 6 0V11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

export function IconLayers({ className, title, size = 28 }: IconProps) {
  return (
    <SvgIcon className={cn("h-7 w-7", className)} title={title} size={size} viewBox="0 0 48 48">
      <path
        d="M24 10 10 18l14 8 14-8-14-8ZM10 24l14 8 14-8M10 30l14 8 14-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

export function IconDroplet({ className, title, size = 28 }: IconProps) {
  return (
    <SvgIcon className={cn("h-7 w-7", className)} title={title} size={size} viewBox="0 0 48 48">
      <path
        d="M24 8c0 0-12 14-12 22a12 12 0 0 0 24 0c0-8-12-22-12-22Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

export function IconGrid({ className, title, size = 28 }: IconProps) {
  return (
    <SvgIcon className={cn("h-7 w-7", className)} title={title} size={size} viewBox="0 0 48 48">
      <path
        d="M12 12h10v10H12V12Zm14 0h10v10H26V12ZM12 26h10v10H12V26Zm14 0h10v10H26V26Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

export function IconHome({ className, title, size = 28 }: IconProps) {
  return (
    <SvgIcon className={cn("h-7 w-7", className)} title={title} size={size} viewBox="0 0 48 48">
      <path
        d="M10 22 24 10l14 12v16a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V22Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M20 40V28h8v12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

export function IconStar({ className, title, size = 14 }: IconProps) {
  return (
    <SvgIcon
      className={cn("h-3.5 w-3.5", className)}
      title={title}
      size={size}
      fill="currentColor"
    >
      <path d="m12 3.2 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.6 7.2 18.1l.9-5.4-3.9-3.8 5.4-.8L12 3.2Z" />
    </SvgIcon>
  );
}

export function IconCabinet({ className, title, size = 28 }: IconProps) {
  return (
    <SvgIcon className={cn("h-7 w-7", className)} title={title} size={size} viewBox="0 0 48 48">
      <rect
        x="10"
        y="8"
        width="28"
        height="32"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M10 18h28M10 28h28M24 18v20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="17" cy="23" r="1.5" fill="currentColor" />
      <circle cx="31" cy="23" r="1.5" fill="currentColor" />
      <circle cx="17" cy="33" r="1.5" fill="currentColor" />
      <circle cx="31" cy="33" r="1.5" fill="currentColor" />
    </SvgIcon>
  );
}

export function IconBrush({ className, title, size = 28 }: IconProps) {
  return (
    <SvgIcon className={cn("h-7 w-7", className)} title={title} size={size} viewBox="0 0 48 48">
      <path
        d="M14 34c0-4 3-7 7-8l13-13 5 5-13 13c-1 4-4 7-8 7-2 0-4-1-4-4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="m30 17 4-4 3 3-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 36c2 1 5 1 7-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}
