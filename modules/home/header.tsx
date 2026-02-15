import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import UserButton from "../auth/components/user-button";
import { Orbit } from "lucide-react";

export function Header() {
    return (
        // 1. Changed "sticky" wrapper to ensure full width
        <div className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:bg-neutral-950/80 dark:border-neutral-800">

            {/* 2. Container to constrain the content width (Logo left, Links right) */}
            <div className="container mx-auto flex h-16 items-center justify-between px-4">

                {/* Logo Section */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                        {/* 3. Resized the Orbit Logo to fit the Header (h-9 w-9) */}
                        <div className="relative flex items-center justify-center">
                            <Orbit
                                className="h-9 w-9 text-violet-500 animate-[spin_10s_linear_infinite]"
                                strokeWidth={1.5}
                            />
                            {/* Subtle Glow for the logo */}
                            <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-md" />
                        </div>

                        <span className="hidden sm:block text-xl font-bold tracking-tight">
                            Orbit Editor
                        </span>
                    </Link>

                    <span className="text-zinc-300 dark:text-zinc-700 h-6 border-l border-zinc-300 dark:border-zinc-700 mx-2"></span>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden sm:flex items-center gap-6">
                        <Link
                            href="/docs"
                            className="text-sm font-medium text-zinc-600 hover:text-violet-500 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors"
                        >
                            Docs
                        </Link>
                        <Link
                            href="/api"
                            className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-violet-500 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors"
                        >
                            API
                            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-500">
                                NEW
                            </span>
                        </Link>
                    </nav>
                </div>

                {/* Right side items */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <UserButton />
                </div>
            </div>
        </div>
    );
}