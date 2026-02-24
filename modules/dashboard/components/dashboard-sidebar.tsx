"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Code2,
    FolderPlus,
    History,
    Home,
    LayoutDashboard,
    Plus,
    Settings,
    Star,
    Braces,
    ShieldCheck,
    Cpu,
    Binary,
    Coffee,
    Terminal,
    Cog,
    Gem,
    type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarGroupAction,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"

interface PlaygroundData {
    id: string
    name: string
    icon: string
    starred: boolean
}

const lucideIconMap: Record<string, LucideIcon> = {
    Cpu,
    Binary,
    Coffee,
    Terminal,
    Cog,
    Gem,
    Braces,
    ShieldCheck,
    Code2
}

export function DashboardSidebar({ initialPlaygroundData }: { initialPlaygroundData: PlaygroundData[] }) {
    const pathname = usePathname()

    const starredPlaygrounds = initialPlaygroundData.filter((p) => p.starred)
    const recentPlaygrounds = initialPlaygroundData.slice(0, 5)

    const menuButtonClasses = "text-zinc-400 hover:bg-purple-900/20 hover:text-purple-300 data-[active=true]:bg-purple-900/40 data-[active=true]:text-purple-400 data-[active=true]:border-r-2 data-[active=true]:border-purple-500 transition-all duration-200"

    return (
        <Sidebar variant="inset" collapsible="icon" className="border-r border-purple-900/20 bg-[#03000a]">
            <SidebarHeader>
                <div className="flex items-center gap-2 px-4 py-5 justify-center">
                    <Image src={"/logo.svg"} alt="logo" height={60} width={60} className="drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname === "/"} tooltip="Home" className={menuButtonClasses}>
                                <Link href="/">
                                    <Home className="h-4 w-4" />
                                    <span>Home</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname === "/dashboard"} tooltip="Dashboard" className={menuButtonClasses}>
                                <Link href="/dashboard">
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                {/* Starred Playgrounds */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-purple-400/70 font-semibold tracking-wider text-xs uppercase mt-4">
                        <Star className="h-3.5 w-3.5 mr-2 text-purple-500" />
                        Starred
                    </SidebarGroupLabel>
                    <SidebarGroupAction title="Add starred playground" className="hover:bg-purple-900/30 hover:text-purple-300 text-zinc-500 mt-4">
                        <Plus className="h-4 w-4" />
                    </SidebarGroupAction>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {starredPlaygrounds.length === 0 ? (
                                <div className="text-center text-purple-400/50 py-6 mx-2 my-2 text-sm border border-dashed border-purple-900/30 rounded-lg bg-purple-950/10 shadow-inner">
                                    No starred files
                                </div>
                            ) : (
                                starredPlaygrounds.map((playground) => {
                                    const IconComponent = lucideIconMap[playground.icon] || Code2;
                                    return (
                                        <SidebarMenuItem key={playground.id}>
                                            <SidebarMenuButton asChild isActive={pathname === `/playground/${playground.id}`} tooltip={playground.name} className={menuButtonClasses}>
                                                <Link href={`/playground/${playground.id}`}>
                                                    <IconComponent className="h-4 w-4" />
                                                    <span>{playground.name}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Recent Playgrounds */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-purple-400/70 font-semibold tracking-wider text-xs uppercase mt-2">
                        <History className="h-3.5 w-3.5 mr-2 text-purple-500" />
                        Recent
                    </SidebarGroupLabel>
                    <SidebarGroupAction title="Create new playground" className="hover:bg-purple-900/30 hover:text-purple-300 text-zinc-500 mt-2">
                        <FolderPlus className="h-4 w-4" />
                    </SidebarGroupAction>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {recentPlaygrounds.length === 0 ? null : (
                                recentPlaygrounds.map((playground) => {
                                    const IconComponent = lucideIconMap[playground.icon] || Code2;
                                    return (
                                        <SidebarMenuItem key={playground.id}>
                                            <SidebarMenuButton asChild isActive={pathname === `/playground/${playground.id}`} tooltip={playground.name} className={menuButtonClasses}>
                                                <Link href={`/playground/${playground.id}`}>
                                                    <IconComponent className="h-4 w-4" />
                                                    <span>{playground.name}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarRail className="hover:after:bg-purple-500/50" />
        </Sidebar>
    )
}