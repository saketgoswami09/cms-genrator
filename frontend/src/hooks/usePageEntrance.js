import { useLayoutEffect } from "react";
import gsap from "gsap";

/**
 * usePageEntrance — Fade-in + slide-up animation for page containers.
 * Replaces the identical useLayoutEffect + gsap.from pattern used in 4+ pages.
 *
 * @param {React.RefObject} ref - Ref to the page container element
 * @param {Array} deps - Additional dependencies to re-trigger the animation
 */
export function usePageEntrance(ref, deps = []) {
  useLayoutEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
    // The caller controls when this entrance animation should replay.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
