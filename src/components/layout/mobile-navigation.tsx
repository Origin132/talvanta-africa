"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { NavigationItem } from "@/lib/site-navigation";
import { ButtonLink } from "@/components/ui/button";
import { NavigationLink } from "./navigation-link";

type MobileNavigationProps = {
  items: readonly NavigationItem[];
};

export function MobileNavigation({ items }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus());

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <div className="min-[1180px]:hidden">
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-xl border border-border-grey/70 bg-white p-0 font-bold text-navy shadow-sm transition duration-200 ease-out hover:border-border-grey hover:bg-soft-grey hover:shadow focus-visible:shadow"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={isOpen ? "Close main navigation" : "Open main navigation"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true" className="text-xl leading-none">
          {isOpen ? "×" : "☰"}
        </span>
      </button>

      <div
        id={menuId}
        ref={menuRef}
        className={`${isOpen ? "block" : "hidden"} absolute inset-x-0 top-full max-h-[calc(100dvh-5rem-env(safe-area-inset-bottom))] overflow-y-auto overscroll-contain border-t border-border-grey bg-white pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-subtle)]`}
      >
        <nav
          aria-label="Mobile navigation"
          className="mx-auto max-w-[var(--page-max-width)] px-4 py-4"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) setIsOpen(false);
          }}
        >
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.href}>
                <NavigationLink
                  href={item.href}
                  activeClassName="border-l-4 border-gold bg-soft-grey font-extrabold"
                  className="flex min-h-12 items-center rounded-lg px-3 py-2 font-semibold text-navy hover:bg-soft-grey hover:text-green"
                >
                  {item.label}
                </NavigationLink>
              </li>
            ))}
          </ul>
          <ButtonLink
            href="/for-employers"
            className="mt-4 w-full"
            variant="primary"
          >
            Hire Talent
          </ButtonLink>
          <ButtonLink
            href="/candidate-registration"
            className="mt-3 w-full"
            variant="outline"
          >
            Register Your Profile
          </ButtonLink>
        </nav>
      </div>
    </div>
  );
}
