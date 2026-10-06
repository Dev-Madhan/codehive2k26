import { Header } from "@/components/header";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterIndexPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] text-[#A3A3A3] border border-[#262626] bg-[#0F0F0F]">
          <span>// REGISTRATION PORTAL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-mono font-bold tracking-tight uppercase text-white">Event Registration</h1>
        <p className="text-neutral-400 font-mono text-sm leading-relaxed max-w-lg mx-auto">
          To register for an event, browse our available competitions and symposium events, then select the event you wish to participate in.
        </p>
        <div className="pt-2">
          <Button
            size="lg"
            className="rounded-none border border-white bg-white hover:bg-neutral-200 text-black cursor-pointer font-mono font-bold uppercase tracking-wider h-11 px-8"
            render={<Link href="/events" />}
            nativeButton={false}
          >
            Browse All Events &gt;
          </Button>
        </div>
      </div>
    </div>
  );
}
