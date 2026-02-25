import Link from "next/link";
import UserButton from "../auth/components/user-button";
import { Orbit } from "lucide-react";

export function Header() {
    return (
        <div className="sticky top-0 z-50 w-full border-b border-purple-900/20 bg-[#03000a]/80 backdrop-blur-md">

            <div className="container mx-auto flex h-16 items-center justify-between px-4">

                {/* Logo Section */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative flex items-center justify-center">
                            <Orbit
                                className="h-9 w-9 text-violet-500 animate-[spin_10s_linear_infinite]"
                                strokeWidth={1.5}
                            />
                            <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-md" />
                        </div>

                        <span className="hidden sm:block text-xl font-bold tracking-tight text-zinc-100">
                            Orbit Editor
                        </span>
                    </Link>

                    <span className="h-6 border-l border-purple-900/30 mx-2"></span>

                    {/* Desktop Navigation Link */}
                    <nav className="hidden sm:flex items-center gap-6">
                        <a
                            href="https://github.com/edgecutioninst/Orbit.git"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-zinc-400 hover:text-purple-400 transition-colors"
                        >
                            Docs
                        </a>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <UserButton />
                </div>
            </div>
        </div>
    );
}