export type NavigationItem = {
  label: string;
  href: string;
};

export const primaryNavigation: readonly NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Jobs", href: "/jobs" },
  { label: "For Employers", href: "/employers" },
  { label: "For Job Seekers", href: "/job-seekers" },
  { label: "Contact", href: "/contact" },
];
