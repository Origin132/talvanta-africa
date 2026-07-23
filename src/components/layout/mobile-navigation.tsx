"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { NavigationItem } from "@/lib/site-navigation";
import { ButtonLink } from "@/components/ui/button";

type MobileNavigationProps = {
  items: readonly NavigationItem[];
};

export function MobileNavigation({ items }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <div className="xl:hidden">
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
        className={`${isOpen ? "block" : "hidden"} absolute inset-x-0 top-full max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-border-grey bg-white shadow-[var(--shadow-subtle)]`}
      >
        <nav aria-label="Mobile navigation" className="mx-auto max-w-[var(--page-max-width)] px-4 py-4">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block min-h-11 rounded-lg px-3 py-2 font-semibold text-navy hover:bg-soft-grey hover:text-green"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink
            href="/hire-talent"
            className="mt-4 w-full"
            variant="primary"
          >
            Hire Talent
          </ButtonLink>
        </nav>
      </div>
    </div>
  );
}
