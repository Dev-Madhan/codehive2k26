"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";

export const navLinks = [
	{
		label: "Features",
		href: "#",
	},
	{
		label: "Pricing",
		href: "#",
	},
	{
		label: "About",
		href: "#",
	},
];

export function Header() {
	const scrolled = useScroll(10);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 mx-auto w-full max-w-4xl border-transparent border-b md:rounded-md md:border md:transition-all md:ease-out",
				{
					"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-3xl md:shadow":
						scrolled,
				}
			)}
		>
			<nav
				className={cn(
					"relative flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out",
					{
						"md:px-2": scrolled,
					}
				)}
			>
				<Link
					className="flex items-center gap-1 rounded-md px-2 py-1 font-bold text-lg tracking-tight text-foreground hover:opacity-90 transition-opacity font-heading"
					href="/"
				>
					<span>Code</span>
					<span className="text-primary">Hive</span>
				</Link>

				{/* Centered navigation links */}
				<div className="hidden items-center gap-1 absolute left-1/2 -translate-x-1/2 md:flex">
					{navLinks.map((link) => (
						<Button
							key={link.label}
							size="sm"
							variant="ghost"
							render={<a href={link.href} />}
							nativeButton={false}
						>
							{link.label}
						</Button>
					))}
				</div>

				{/* Single important button on the right */}
				<div className="flex items-center gap-2">
					<Button
						size="sm"
						className="hidden md:inline-flex cursor-pointer"
						render={<Link href="/auth" />}
						nativeButton={false}
					>
						Get Started
					</Button>
					<MobileNav />
				</div>
			</nav>
		</header>
	);
}
