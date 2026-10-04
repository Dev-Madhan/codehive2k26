"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { grantAdminByEmail } from "@/actions/admin-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheckIcon, UserPlusIcon } from "lucide-react";

interface AdminAccessManagerProps {
  admins: Array<{ id: string; email: string }>;
}

export function AdminAccessManager({ admins }: AdminAccessManagerProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await grantAdminByEmail(email);
      if (!result.success) {
        toast.error(result.error.message);
        return;
      }

      toast.success(result.message || `${result.data.email} now has admin access.`);
      setEmail("");
      router.refresh();
    });
  };

  return (
    <section className="space-y-4 border border-border bg-card p-4 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="border border-amber-500/30 bg-amber-500/10 p-2 text-amber-400">
          <ShieldCheckIcon className="size-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Administrator Access
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Grant dashboard access to an account that has signed in at least once.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@example.com"
          autoComplete="email"
          required
          disabled={isPending}
          aria-label="Email address to grant admin access"
          className="h-10 min-w-0 rounded-none border-border bg-background text-foreground"
        />
        <Button
          type="submit"
          disabled={isPending || !email.trim()}
          className="h-10 shrink-0 rounded-none bg-amber-600 px-4 text-xs font-bold uppercase tracking-wide text-white hover:bg-amber-500"
        >
          <UserPlusIcon className="mr-2 size-4" />
          {isPending ? "Granting..." : "Grant admin"}
        </Button>
      </form>

      <div className="space-y-2 border-t border-border pt-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Current admins · {admins.length}
        </p>
        {admins.length === 0 ? (
          <p className="text-xs text-muted-foreground">No admin accounts found.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {admins.map((admin) => (
              <li
                key={admin.id}
                className="flex min-w-0 items-center gap-2 border border-border bg-background px-3 py-2"
              >
                <ShieldCheckIcon className="size-3.5 shrink-0 text-amber-400" />
                <span className="truncate text-xs text-foreground">{admin.email}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
