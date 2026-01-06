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
    <div ref={pageRef} className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <SignUpForm cardRef={cardRef} />
      <AuthHero />
    </div>
  );
};

export default SignUp;