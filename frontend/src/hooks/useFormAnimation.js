import { useLayoutEffect } from "react";
import gsap from "gsap";

/**
 * useFormAnimation — Configurable GSAP stagger entrance for auth forms.
 * Consolidates useLoginAnimation and useSignUpAnimation into one hook.
 *
 * @param {React.RefObject} scopeRef - Ref to scope GSAP selectors
 * @param {React.RefObject} cardRef - Ref to the form card element
 * @param {object} options - CSS class selectors for animation targets
 */
export function useFormAnimation(scopeRef, cardRef, options = {}) {
  const {
    headerClass = ".form-header",
    fieldClass = ".form-field",
    buttonClass = ".form-button",
  } = options;

  useLayoutEffect(() => {
    if (!cardRef?.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(cardRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
      })
        .from(headerClass, { y: 10, opacity: 0, duration: 0.5 }, "-=0.6")
        .from(
          fieldClass,
          { y: 8, opacity: 0, stagger: 0.06, duration: 0.45 },
          "-=0.4"
        )
        .from(buttonClass, { y: 6, opacity: 0, duration: 0.4 }, "-=0.3");
    }, scopeRef);

    return () => ctx.revert();
  }, [buttonClass, cardRef, fieldClass, headerClass, scopeRef]);
}
