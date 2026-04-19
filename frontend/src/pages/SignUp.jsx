import { useRef } from "react";
import SignUpForm from "@/components/auth/SignUpForm";
import AuthHero from "@/components/auth/AuthHero";
import { useFormAnimation } from "@/hooks/useFormAnimation";

export default function SignUp() {
  const pageRef = useRef(null);
  const cardRef = useRef(null);

  useFormAnimation(pageRef, cardRef, {
    headerClass: ".signup-header",
    fieldClass: ".signup-field",
    buttonClass: ".signup-button",
  });

  return (
    <div ref={pageRef} className="flex h-screen w-full overflow-hidden bg-[#060a13]">
      <AuthHero />
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 overflow-y-auto">
        <SignUpForm cardRef={cardRef} />
      </div>
    </div>
  );
}