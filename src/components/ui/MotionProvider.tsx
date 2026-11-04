"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const docEl = document.documentElement;

    if (mq.matches) {
      docEl.classList.add("reduced-motion");
      docEl.classList.remove("motion-ready");
      return;
    }

    docEl.classList.add("motion-ready");
    docEl.classList.remove("reduced-motion");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -25px 0px",
      }
    );

    function registerElements() {
      const vh = window.innerHeight || 800;

      // 1. All sections inside #main-content
      const sections = document.querySelectorAll<HTMLElement>(
        "#main-content section:not([data-no-reveal]):not(.is-revealed)"
      );

      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        // If element is already visible or partially in viewport upon mount, reveal immediately
        if (rect.top < vh && rect.bottom > 0) {
          sec.classList.add("reveal-on-scroll", "is-revealed");
        } else {
          sec.classList.add("reveal-on-scroll");
          observer.observe(sec);
        }
      });

      // 2. Card grids inside sections
      const grids = document.querySelectorAll<HTMLElement>(
        "#main-content section .grid:not(.is-revealed)"
      );

      grids.forEach((grid) => {
        const rect = grid.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          grid.classList.add("stagger-grid", "is-revealed");
        } else {
          grid.classList.add("stagger-grid");
          observer.observe(grid);
        }
      });
    }

    // Run registration immediately and after a short paint delay
    registerElements();
    const timer = setTimeout(registerElements, 80);

    const mutObserver = new MutationObserver(() => {
      registerElements();
    });

    const mainEl = document.getElementById("main-content");
    if (mainEl) {
      mutObserver.observe(mainEl, { childList: true, subtree: true });
    }

    const onMotionChange = () => {
      if (mq.matches) {
        docEl.classList.add("reduced-motion");
        docEl.classList.remove("motion-ready");
      } else {
        docEl.classList.add("motion-ready");
        docEl.classList.remove("reduced-motion");
        registerElements();
      }
    };

    mq.addEventListener("change", onMotionChange);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mutObserver.disconnect();
      mq.removeEventListener("change", onMotionChange);
    };
  }, [pathname]);

  return <>{children}</>;
}
