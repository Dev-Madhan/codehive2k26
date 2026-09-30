"use client";

import { Auth3 } from "@/components/ui/auth-03";

export function AuthCard() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Auth3
        brandName="CodeHive 2K26"
        brandDescriptor="Sign in with your Google account to register for events"
        onSignIn={(email, password) => {
          console.log("Sign in with:", email);
        }}
        onSignUp={(name, email, password) => {
          console.log("Sign up with:", name, email);
        }}
      />
    </div>
  );
}

export default AuthCard;
