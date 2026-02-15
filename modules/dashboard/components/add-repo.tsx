"use client";

import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import Image from "next/image"

const AddRepo = () => {
    return (
        <div
            className={`group px-6 py-6 flex flex-row justify-between items-center border border-purple-900/20 rounded-xl bg-[#06020d] cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#0a0515] hover:border-purple-500/50 hover:scale-[1.02] shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] relative overflow-hidden`}
        >
            {/* Subtle gradient glow effect inside the card */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex flex-row justify-center items-start gap-4 relative z-10">
                <Button
                    variant={"outline"}
                    className="flex justify-center items-center bg-purple-950/20 border-purple-900/50 text-purple-500 
                    group-hover:bg-purple-900/40 group-hover:border-purple-400 group-hover:text-purple-300 
                    transition-all duration-300"
                    size={"icon"}
                >
                    <ArrowDown size={30} className="transition-transform duration-300 group-hover:translate-y-1" />
                </Button>
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-purple-300 group-hover:text-purple-200 transition-colors">Open Github Repository</h1>
                    <p className="text-sm text-purple-400/50 max-w-[220px]">Work with your repositories in our editor</p>
                </div>
            </div>

            <div className="relative overflow-hidden z-10">
                <Image
                    src={"/github.svg"}
                    alt="Open GitHub repository"
                    width={150}
                    height={150}
                    className="transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] opacity-80 group-hover:opacity-100"
                />
            </div>
        </div>
    )
}

export default AddRepo