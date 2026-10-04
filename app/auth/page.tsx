import type { Metadata } from "next";
import { AuthPage } from "@/components/auth-page";

export const metadata: Metadata = {
  title: "Sign In | CodeHive 2K26",
  description:
    "Access your CodeHive workspace, manage event registrations, and view your digital passes.",
};

export default function AuthRoute() {
  return <AuthPage />;
}
