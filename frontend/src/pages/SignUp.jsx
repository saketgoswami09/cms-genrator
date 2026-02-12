import React, { useRef } from "react";
import SignUpForm from "../components/auth/SignUpForm";
import AuthHero from "../components/auth/AuthHero";
import { useSignUpAnimation } from "../components/hooks/useSignUpAnimation";

const SignUp = () => {
  const pageRef = useRef(null);
  const cardRef = useRef(null);

  // 1. Initialize Animation
  useSignUpAnimation(pageRef, cardRef);

  // 2. Render Layout
  return (
    // ✨ CHANGED: Used 'flex h-screen' instead of 'min-h-screen grid'
    // This forces the page to be exactly the viewport height (no outer scrollbar)
    <div 
      ref={pageRef} 
      className="flex h-screen w-full overflow-hidden bg-white dark:bg-black"
    >
      
      {/* 👈 LEFT SIDE: AuthHero 
         (Ensure AuthHero component has 'w-1/2 hidden lg:flex' as discussed previously)
      */}
      <AuthHero />

      {/* 👉 RIGHT SIDE: SignUpForm Container
         - w-full: Takes full width on mobile
         - lg:w-1/2: Takes half width on desktop
         - overflow-y-auto: Allows ONLY this side to scroll if form is tall
      */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 overflow-y-auto">
        <SignUpForm cardRef={cardRef} />
      </div>

    </div>
  );
};

export default SignUp;