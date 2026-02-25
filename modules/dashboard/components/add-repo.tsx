"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowDown, Github, Loader2 } from "lucide-react"
import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { createPlaygroundFromGithub } from "@/modules/dashboard/actions/repo-clone";

const GITHUB_TO_TEMPLATE_MAP: Record<string, string> = {
    "C++": "CPP",
    "C": "C",
    "Java": "JAVA",
    "Python": "PYTHON",
    "Rust": "RUST",
    "Ruby": "RUBY",
    "JavaScript": "JAVASCRIPT",
    "TypeScript": "TYPESCRIPT",
};

const AddRepo = () => {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();

    const handleImport = async () => {
        if (!url) return;
        setIsLoading(true);

        try {
            const cleanUrl = url.trim().replace(/\/$/, "");
            const parts = cleanUrl.split("/");

            const repo = parts.pop()?.replace(".git", "");
            const owner = parts.pop();

            if (!owner || !repo || !cleanUrl.includes("github.com")) {
                toast.error("Invalid GitHub URL format");
                setIsLoading(false);
                return;
            }

            console.log(`Connecting to GitHub: ${owner}/${repo}...`);

            const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
            if (!repoRes.ok) throw new Error("Repository not found or is private");
            const repoData = await repoRes.json();

            const primaryLanguage = repoData.language;
            const matchedTemplate = GITHUB_TO_TEMPLATE_MAP[primaryLanguage || ""];

            if (!matchedTemplate) {
                toast.error(`Unsupported language: ${primaryLanguage || "Unknown"}. We support C, C++, Java, Python, Rust, Ruby, JS, TS.`);
                setIsLoading(false);
                return;
            }

            const defaultBranch = repoData.default_branch;

            const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`);
            if (!treeRes.ok) throw new Error("Failed to fetch file tree");
            const treeData = await treeRes.json();

            const files = treeData.tree.filter((item: any) =>
                item.type === "blob" &&
                !item.path.includes("node_modules") &&
                !item.path.includes(".png") &&
                !item.path.includes(".jpg")
            );

            const newPlaygroundId = await createPlaygroundFromGithub({
                title: repo,
                description: repoData.description || `Imported from ${url}`,
                template: matchedTemplate,
                githubFiles: files.map((f: any) => ({ path: f.path, url: f.url }))
            });

            if (newPlaygroundId) {
                toast.success("Repository imported successfully! Redirecting...");

                setIsOpen(false);
                setUrl("");

                setTimeout(() => {
                    router.push(`/playground/${newPlaygroundId}`);
                }, 100);
            }

        } catch (error) {
            console.error("Import failed:", error);
            toast.error("Failed to import. Make sure the URL is a public GitHub repository.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div
                    className={`group px-6 py-6 flex flex-row justify-between items-center border border-purple-900/20 rounded-xl bg-[#06020d] cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#0a0515] hover:border-purple-500/50 hover:scale-[1.02] shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] relative overflow-hidden`}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex flex-row justify-center items-start gap-4 relative z-10">
                        <Button
                            variant={"outline"}
                            className="flex justify-center items-center bg-purple-950/20 border-purple-900/50 text-purple-500 
                            group-hover:bg-purple-900/40 group-hover:border-purple-400 group-hover:text-purple-300 
                            transition-all duration-300 pointer-events-none" // Stops the button from stealing the click from the DialogTrigger
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
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] bg-[#0a0515] border-purple-900/50 text-purple-100">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2">
                        <Github className="w-5 h-5" /> Import Repository
                    </DialogTitle>
                    <DialogDescription className="text-purple-400/60">
                        Paste a public GitHub repository URL to import its files into your workspace.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input
                        id="repo-url"
                        placeholder="https://github.com/facebook/react"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="bg-zinc-900/50 border-purple-900/30 text-zinc-200 focus-visible:ring-purple-500 placeholder:text-zinc-600"
                        autoComplete="off"
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => setIsOpen(false)}
                        className="text-zinc-400 hover:text-purple-300 hover:bg-purple-900/20"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleImport}
                        disabled={!url || isLoading}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cloning...
                            </>
                        ) : (
                            "Import Repo"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddRepo