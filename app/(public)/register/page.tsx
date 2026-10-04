import { Header } from "@/components/header";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterIndexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Event Registration</h1>
        <p className="text-muted text-base">
          To register for an event, browse our available competitions and symposium events, then select the event you wish to participate in.
        </p>
        <Button
          size="lg"
          className="border-2 border-primary bg-primary hover:bg-primary-hover text-foreground cursor-pointer font-semibold"
          render={<Link href="/events" />}
          nativeButton={false}
        >
          Browse All Events
        </Button>
      </div>
    </div>
  );
}
