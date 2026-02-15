"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
    ChevronRight,
    Search,
    Star,
    Code,
    Server,
    Globe,
    Zap,
    Clock,
    Check,
    Plus,
    ShieldCheck, // Added for TS
    Braces       // Added for JS
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Updated to include TYPESCRIPT and JAVASCRIPT
type TemplateSelectionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        title: string;
        template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR" | "TYPESCRIPT" | "JAVASCRIPT";
        description?: string;
    }) => void;
};

// Added lucideIcon as an optional property for our TS/JS templates
interface TemplateOption {
    id: string;
    name: string;
    description: string;
    icon?: string;
    lucideIcon?: any;
    color: string;
    popularity: number;
    tags: string[];
    features: string[];
    category: "frontend" | "backend" | "fullstack";
}

const templates: TemplateOption[] = [
    {
        id: "typescript",
        name: "TypeScript",
        description: "Strictly typed JavaScript environment for robust architecture and safety.",
        icon: "/typescript.svg",
        color: "#3178C6",
        popularity: 5,
        tags: ["Vanilla", "Strict", "Fullstack"],
        features: ["Static Typing", "Object-Oriented", "Modern Syntax"],
        category: "fullstack",
    },
    {
        id: "javascript",
        name: "Vanilla JS",
        description: "Standard JavaScript environment for quick prototyping and logic.",
        icon: "/javascript.svg",
        color: "#F7DF1E",
        popularity: 5,
        tags: ["Vanilla", "Dynamic", "Scripting"],
        features: ["Dynamic Typing", "Ubiquitous", "Event-Driven"],
        category: "fullstack",
    },
    {
        id: "react",
        name: "React",
        description: "A JavaScript library for building user interfaces with component-based architecture",
        icon: "/react.svg",
        color: "#61DAFB",
        popularity: 5,
        tags: ["UI", "Frontend", "JavaScript"],
        features: ["Component-Based", "Virtual DOM", "JSX Support"],
        category: "frontend",
    },
    {
        id: "nextjs",
        name: "Next.js",
        description: "The React framework for production with server-side rendering and static site generation",
        icon: "/nextjs-icon.svg",
        color: "#ffffff",
        popularity: 4,
        tags: ["React", "SSR", "Fullstack"],
        features: ["Server Components", "API Routes", "File-based Routing"],
        category: "fullstack",
    },
    {
        id: "express",
        name: "Express",
        description: "Fast, unopinionated, minimalist web framework for Node.js to build APIs and web applications",
        icon: "/expressjs-icon.svg",
        color: "#ffffff",
        popularity: 4,
        tags: ["Node.js", "API", "Backend"],
        features: ["Middleware", "Routing", "HTTP Utilities"],
        category: "backend",
    },
    {
        id: "vue",
        name: "Vue.js",
        description: "Progressive JavaScript framework for building user interfaces with an approachable learning curve",
        icon: "/vuejs-icon.svg",
        color: "#4FC08D",
        popularity: 4,
        tags: ["UI", "Frontend", "JavaScript"],
        features: ["Reactive Data Binding", "Component System", "Virtual DOM"],
        category: "frontend",
    },
    {
        id: "hono",
        name: "Hono",
        description: "Fast, lightweight, built on Web Standards. Support for any JavaScript runtime.",
        icon: "/hono.svg",
        color: "#e36002",
        popularity: 3,
        tags: ["Node.js", "TypeScript", "Backend"],
        features: ["Dependency Injection", "TypeScript Support", "Modular Architecture"],
        category: "backend",
    },
    {
        id: "angular",
        name: "Angular",
        description: "Angular is a web framework that empowers developers to build fast, reliable applications.",
        icon: "/angular-2.svg",
        color: "#DD0031",
        popularity: 3,
        tags: ["React", "Fullstack", "JavaScript"],
        features: ["Reactive Data Binding", "Component System", "Virtual DOM", "Dependency Injection", "TypeScript Support"],
        category: "fullstack",
    },
];

const TemplateSelectionModal = ({
    isOpen,
    onClose,
    onSubmit,
}: TemplateSelectionModalProps) => {
    const [step, setStep] = useState<"select" | "configure">("select");
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState<"all" | "frontend" | "backend" | "fullstack">("all");
    const [projectName, setProjectName] = useState("");

    const filteredTemplates = templates.filter((template) => {
        const matchesSearch =
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = category === "all" || template.category === category;
        return matchesSearch && matchesCategory;
    });

    const handleSelectTemplate = (templateId: string) => {
        setSelectedTemplate(templateId);
    };

    const handleContinue = () => {
        if (selectedTemplate) {
            setStep("configure");
        }
    };

    const handleCreateProject = () => {
        if (selectedTemplate) {
            const templateMap: Record<string, "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR" | "TYPESCRIPT" | "JAVASCRIPT"> = {
                react: "REACT",
                nextjs: "NEXTJS",
                express: "EXPRESS",
                vue: "VUE",
                hono: "HONO",
                angular: "ANGULAR",
                typescript: "TYPESCRIPT",
                javascript: "JAVASCRIPT"
            };

            const template = templates.find((t) => t.id === selectedTemplate);

            if (template) {
                onSubmit({
                    title: projectName.trim() || `${template.name} Project`,
                    template: templateMap[selectedTemplate] || "REACT", // Default to REACT if not found, though it should always be found
                    description: template?.description,
                });
            }

            onClose();
            setStep("select");
            setSelectedTemplate(null);
            setProjectName("");
        }
    };

    const handleBack = () => {
        setStep("select");
    };

    const renderStars = (count: number) => {
        return Array(5)
            .fill(0)
            .map((_, i) => (
                <Star
                    key={i}
                    size={14}
                    className={i < count ? "fill-purple-400 text-purple-400" : "text-purple-900/30"}
                />
            ));
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                    setStep("select");
                    setSelectedTemplate(null);
                    setProjectName("");
                }
            }}
        >
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-[#06020d] border-purple-900/30 text-zinc-200">
                {step === "select" ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-purple-400 flex items-center gap-2">
                                <Plus size={24} className="text-purple-500" />
                                Select a Template
                            </DialogTitle>
                            <DialogDescription className="text-purple-400/50">
                                Choose a template to create your new playground
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-6 py-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500/50 outline-none"
                                        size={18}
                                    />
                                    <Input
                                        placeholder="Search templates..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 bg-[#0a0515] border-purple-900/30 text-purple-100 placeholder:text-purple-900/50 focus-visible:ring-purple-500/50"
                                    />
                                </div>

                                <Tabs
                                    defaultValue="all"
                                    className="w-full sm:w-auto"
                                    onValueChange={(value) => setCategory(value as any)}
                                >
                                    <TabsList className="grid grid-cols-4 w-full sm:w-[400px] bg-[#0a0515] border border-purple-900/30 p-1">
                                        <TabsTrigger value="all" className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300">All</TabsTrigger>
                                        <TabsTrigger value="frontend" className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300">Frontend</TabsTrigger>
                                        <TabsTrigger value="backend" className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300">Backend</TabsTrigger>
                                        <TabsTrigger value="fullstack" className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300">Fullstack</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            <RadioGroup
                                value={selectedTemplate || ""}
                                onValueChange={handleSelectTemplate}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredTemplates.length > 0 ? (
                                        filteredTemplates.map((template) => (
                                            <div
                                                key={template.id}
                                                className={`relative p-5 flex flex-col items-start border rounded-xl cursor-pointer transition-all duration-300 ${selectedTemplate === template.id
                                                    ? "border-purple-500 bg-purple-900/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                                                    : "border-purple-900/20 bg-[#0a0515] hover:border-purple-500/40 hover:bg-[#0f081c]"
                                                    }`}
                                                onClick={() => handleSelectTemplate(template.id)}
                                            >
                                                <div className="absolute top-4 right-4 flex gap-1">
                                                    {renderStars(template.popularity)}
                                                </div>

                                                {selectedTemplate === template.id && (
                                                    <div className="absolute top-3 left-3 bg-purple-600 text-white rounded-full p-1 shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                                                        <Check size={12} strokeWidth={3} />
                                                    </div>
                                                )}

                                                <div className="flex gap-4 w-full pl-6">
                                                    <div
                                                        className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-xl bg-[#06020d] border border-purple-900/30 shadow-inner"
                                                    >
                                                        {template.lucideIcon ? (
                                                            <template.lucideIcon size={28} style={{ color: template.color }} />
                                                        ) : (
                                                            <Image
                                                                src={template.icon || "/placeholder.svg"}
                                                                alt={`${template.name} icon`}
                                                                width={32}
                                                                height={32}
                                                                className="object-contain drop-shadow-md"
                                                            />
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col w-full">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="text-lg font-semibold text-purple-100">
                                                                {template.name}
                                                            </h3>
                                                            <div className="flex gap-1">
                                                                {template.category === "frontend" && <Code size={14} className="text-blue-400" />}
                                                                {template.category === "backend" && <Server size={14} className="text-green-400" />}
                                                                {template.category === "fullstack" && <Globe size={14} className="text-purple-400" />}
                                                            </div>
                                                        </div>

                                                        <p className="text-xs text-purple-400/50 mb-4 line-clamp-2">
                                                            {template.description}
                                                        </p>

                                                        <div className="flex flex-wrap gap-2 mt-auto">
                                                            {template.tags.map((tag) => (
                                                                <span
                                                                    key={tag}
                                                                    className="text-[10px] px-2 py-0.5 border border-purple-900/40 bg-purple-950/30 text-purple-300 rounded-full"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <RadioGroupItem
                                                    value={template.id}
                                                    id={template.id}
                                                    className="sr-only"
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 flex flex-col items-center justify-center p-12 text-center border border-dashed border-purple-900/30 rounded-xl bg-[#0a0515]">
                                            <Search size={48} className="text-purple-900/50 mb-4" />
                                            <h3 className="text-lg font-medium text-purple-300">
                                                No templates found
                                            </h3>
                                            <p className="text-sm text-purple-500/50">
                                                Try adjusting your search or filters
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="flex justify-between items-center gap-3 mt-2 pt-4 border-t border-purple-900/20">
                            <div className="flex items-center text-sm text-purple-400/50">
                                <Clock size={14} className="mr-2 text-purple-500" />
                                <span>
                                    Estimated setup time:{" "}
                                    <span className="text-purple-300">{selectedTemplate ? "2-5 seconds" : "Select a template"}</span>
                                </span>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={onClose} className="border-purple-900/30 bg-transparent text-purple-300 hover:bg-purple-900/20 hover:text-purple-200">
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                                    disabled={!selectedTemplate}
                                    onClick={handleContinue}
                                >
                                    Continue <ChevronRight size={16} className="ml-1" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-purple-400">
                                Configure Your Project
                            </DialogTitle>
                            <DialogDescription className="text-purple-400/50">
                                <span className="text-purple-300 font-semibold">{templates.find((t) => t.id === selectedTemplate)?.name}</span> project configuration
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-6 py-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="project-name" className="text-purple-300">Project Name</Label>
                                <Input
                                    id="project-name"
                                    placeholder="my-awesome-project"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    className="bg-[#0a0515] border-purple-900/30 text-purple-100 placeholder:text-purple-900/50 focus-visible:ring-purple-500/50"
                                />
                            </div>

                            <div className="p-5 bg-purple-950/10 rounded-xl border border-purple-900/30 shadow-[inset_0_0_20px_rgba(168,85,247,0.02)]">
                                <h3 className="font-medium text-purple-300 mb-4">Selected Template Features</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {templates
                                        .find((t) => t.id === selectedTemplate)
                                        ?.features.map((feature) => (
                                            <div key={feature} className="flex items-center gap-2">
                                                <Zap size={14} className="text-purple-500" />
                                                <span className="text-sm text-purple-200/80">{feature}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between gap-3 mt-2 pt-4 border-t border-purple-900/20">
                            <Button variant="outline" onClick={handleBack} className="border-purple-900/30 bg-transparent text-purple-300 hover:bg-purple-900/20 hover:text-purple-200">
                                Back
                            </Button>
                            <Button
                                className="bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                                onClick={handleCreateProject}
                            >
                                Initialize Vault
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default TemplateSelectionModal;