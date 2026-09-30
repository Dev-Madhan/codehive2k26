import { Header } from "@/components/header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CalendarIcon, QrCodeIcon } from "lucide-react";

export default function ParticipantDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Participant Dashboard</h1>
          <p className="text-muted text-sm mt-1">
            Manage your registered events, access your check-in passes, and view certificates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-cyan">
                <CalendarIcon className="size-5" />
              </div>
              <h2 className="text-lg font-bold">My Registrations</h2>
            </div>
            <p className="text-sm text-muted">
              View the events you are currently registered for and download your QR entry passes.
            </p>
            <Button
              className="w-full border-2 border-primary bg-primary hover:bg-primary-hover text-white cursor-pointer font-medium"
              render={<Link href="/events" />}
              nativeButton={false}
            >
              Browse More Events <ArrowRightIcon className="size-4 ml-1" />
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-mint/10 text-mint">
                <QrCodeIcon className="size-5" />
              </div>
              <h2 className="text-lg font-bold">Event Day Pass</h2>
            </div>
            <p className="text-sm text-muted">
              Keep your digital QR badge ready for smooth event check-in at the desk.
            </p>
            <Button
              variant="outline"
              className="w-full border-2 cursor-pointer font-medium"
              render={<Link href="/events" />}
              nativeButton={false}
            >
              View Pass
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
