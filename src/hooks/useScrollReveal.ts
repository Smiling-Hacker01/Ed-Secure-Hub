'use client';

import { useEffect, useRef } from 'react';

/**
 * useScrollReveal — lightweight IntersectionObserver hook.
 * Adds the CSS class `is-visible` to observed elements when they
 * enter the viewport. Works alongside the `.reveal-on-scroll` CSS class.
 *
 * Usage:
 *   const ref = useScrollReveal();
 *   <div ref={ref} className="reveal-on-scroll"> ... </div>
 *
 * You can also observe a container and all matching children:
 *   const ref = useScrollReveal('.reveal-on-scroll');
 *   <section ref={ref}> <div className="reveal-on-scroll">...</div> </section>
 */
export function useScrollReveal(childSelector?: string) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const elements = childSelector
      ? Array.from(root.querySelectorAll<HTMLElement>(childSelector))
      : [root];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [childSelector]);

  return ref;
}
