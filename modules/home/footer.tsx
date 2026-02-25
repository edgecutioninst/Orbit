import Link from "next/link";
import { CatIcon, Orbit } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-purple-900/20 bg-[#03000a]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

                <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
                    <Orbit className="h-5 w-5 text-purple-400 animate-[spin_10s_linear_infinite]" />
                    <span className="text-sm font-semibold tracking-tight text-zinc-300">Orbit Editor</span>
                </div>

                <p className="text-xs text-zinc-600 sm:text-center">
                    &copy; {new Date().getFullYear()} Orbit Editor
                </p>

                {/* Social Links */}
                <div className="flex items-center">
                    <Link
                        href="https://github.com/edgecutioninst/Orbit"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 p-2 rounded-full hover:bg-purple-900/20 border border-transparent hover:border-purple-500/30 transition-all duration-300"
                    >
                        <span className="text-xs text-zinc-500 font-medium group-hover:text-purple-400 transition-colors"> GitHub </span>
                        <CatIcon className="w-5 h-5 text-zinc-500 group-hover:text-purple-400 transition-colors duration-300" />
                    </Link>
                </div>

            </div>
        </footer>
    );
}