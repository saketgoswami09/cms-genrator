import { useRef } from "react";
import LoginForm from "@/components/auth/LoginForm";
import AuthHero from "@/components/auth/AuthHero";
import { useFormAnimation } from "@/hooks/useFormAnimation";

export default function Login() {
  const pageRef = useRef(null);
  const cardRef = useRef(null);

  useFormAnimation(pageRef, cardRef, {
    headerClass: ".login-header",
    fieldClass: ".login-field",
    buttonClass: ".login-button",
  });

  return (
    <div ref={pageRef} className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <AuthHero />
      <LoginForm cardRef={cardRef} />
    </div>
  );
}
