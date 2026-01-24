import React, { useRef } from "react";
import LoginForm from "../components/auth/LoginForm";
import AuthHero from "../components/auth/AuthHero";
import { useLoginAnimation } from "../components/hooks/useLoginAnimation";

const Login = () => {
  const pageRef = useRef(null);
  const cardRef = useRef(null);

  useLoginAnimation(pageRef, cardRef);

  return (
    <div ref={pageRef} className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <AuthHero />
      <LoginForm cardRef={cardRef} />
    </div>
  );
};

export default Login;
