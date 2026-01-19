import { useLayoutEffect } from "react";
import gsap from "gsap";

export const useSignUpAnimation = (scopeRef, cardRef) => {
  useLayoutEffect(() => {
    if (!scopeRef.current || !cardRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // --- RIGHT SIDE (Background & Text) ---
      tl.from(".right-panel", {
        opacity: 0,
        scale: 1.05,
        duration: 1.5,
        ease: "power2.out",
      }, 0);

      tl.from(".right-text", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      }, 0.2);

      // --- LEFT SIDE (Form & Card) ---
      tl.from(scopeRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power1.out",
      }, 0);

      tl.from(cardRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
      }, 0.1);

      tl.from(".signup-header", {
        y: 10,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      }, "-=0.6");

      tl.from(".signup-field", {
        y: 8,
        opacity: 0,
        duration: 0.45,
        stagger: 0.06,
        ease: "power3.out",
      }, "-=0.4");

      tl.from(".signup-button", {
        y: 6,
        opacity: 0,
        duration: 0.4,
        ease: "power3.out",
      }, "-=0.3");

    }, scopeRef); // Scope selectors to the main page wrapper

    return () => ctx.revert();
  }, [scopeRef, cardRef]);
};