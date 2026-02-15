import React from 'react'

const EmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 w-full max-w-3xl mx-auto border border-dashed border-purple-900/40 rounded-2xl bg-[#06020d]/40 shadow-[inset_0_0_30px_rgba(168,85,247,0.03)]">

            {/* Atmospheric glow behind the SVG */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none" />
                <img
                    src="/empty-state.svg"
                    alt="No projects"
                    className="relative w-48 h-48 opacity-85 drop-shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:scale-105 transition-transform duration-500"
                />
            </div>

            <h2 className="text-xl font-bold text-purple-300 tracking-wide mb-2">
                The Vault is Empty
            </h2>
            <p className="text-sm text-purple-400/50 text-center max-w-sm">
                No active projects found. Initialize a new playground or connect a repository to begin.
            </p>
        </div>
    )
}

export default EmptyState