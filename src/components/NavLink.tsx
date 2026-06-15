import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  href: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, href, ...props }, ref) => {
    // For simplicity, just use Next Link (we don't have active state handling here since it's not used in the current nav)
    return <Link ref={ref} href={href} className={className} {...props} />;
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
