import { useLayoutEffect } from "react";
import gsap from "gsap";

export const useLoginAnimation = (pageRef, cardRef) => {
  useLayoutEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(cardRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
      })
        .from(
          ".login-header",
          { y: 10, opacity: 0, duration: 0.5 },
          "-=0.6"
        )
        .from(
          ".login-field",
          {
            y: 8,
            opacity: 0,
            stagger: 0.06,
            duration: 0.45,
          },
          "-=0.4"
        )
        .from(
          ".login-button",
          { y: 6, opacity: 0, duration: 0.4 },
          "-=0.3"
        );
    }, pageRef);

    return () => ctx.revert();
  }, []);
};
