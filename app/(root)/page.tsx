import { Button } from "@/components/ui/button";
import { ArrowUpRight, Orbit } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="relative z-20 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white dark:bg-neutral-950 transition-colors duration-300">

            <div className="absolute inset-0 h-full w-full bg-white dark:bg-neutral-950 bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:24px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-violet-500 opacity-20 blur-[100px]"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center my-5">

                <div className="relative mb-12 flex items-center justify-center">
                    <div className="absolute inset-0 border border-violet-500/30 dark:border-violet-500/20 rounded-full w-[300px] h-[300px] animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-0 border border-indigo-500/30 dark:border-indigo-500/20 rounded-full w-[400px] h-[400px] animate-[spin_15s_linear_infinite_reverse]" />

                    <div className="relative flex items-center justify-center w-40 h-40 bg-violet-500/10 rounded-full backdrop-blur-sm border border-violet-500/20 shadow-[0_0_50px_-10px_rgba(139,92,246,0.5)]">
                        <Orbit className="w-20 h-20 text-violet-600 dark:text-violet-400 animate-spin-slow" strokeWidth={1.5} />
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-center tracking-tight leading-[1.1] text-neutral-900 dark:text-white">
                    Code with{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        Intelligence
                    </span>
                </h1>

                <p className="mt-4 text-lg text-center text-neutral-600 dark:text-neutral-400 px-5 max-w-2xl leading-relaxed">
                    Orbit is an intelligent development environment designed to enhance your
                    workflow. Write, debug, and deploy code with the speed of light.
                </p>

                <div className="mt-10">
                    <Link href={"/dashboard"}>
                        <Button
                            size={"lg"}
                            className="h-12 px-8 text-lg font-medium transition-all
                                       bg-neutral-900 text-white hover:bg-neutral-800
                                       dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 cursor-pointer"
                        >
                            Get Started
                            <ArrowUpRight className="ml-2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}