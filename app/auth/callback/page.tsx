import { redirect } from "next/navigation";
import { getCurrentUserAccess } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function AuthCallbackPage() {
  const { session, role } = await getCurrentUserAccess();

  if (!session?.user) {
    redirect("/auth");
  }

  redirect(role === "ADMIN" ? "/dashboard" : "/events");
}
