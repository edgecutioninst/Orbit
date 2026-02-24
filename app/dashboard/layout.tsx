import { SidebarProvider } from "@/components/ui/sidebar";
import { getAllPlaygroundForUser } from "@/modules/dashboard/actions";
import { DashboardSidebar } from "@/modules/dashboard/components/dashboard-sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const playgroundData = await getAllPlaygroundForUser();

    const technologyIconMap: Record<string, string> = {
        CPP: "Cpu",
        C: "Binary",
        JAVA: "Coffee",
        PYTHON: "Terminal",
        RUST: "Cog",
        RUBY: "Gem",
        JAVASCRIPT: "Braces",
        TYPESCRIPT: "ShieldCheck",
    }

    const formattedPlaygroundData = playgroundData?.map(
        (item) => ({
            id: item.id,
            name: item.title,
            starred: item.starMarks?.[0]?.isMarked || false,
            icon: technologyIconMap[item.template] || "Code2"
        })
    )

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full overflow-x-hidden">
                {/* @ts-ignore */}
                <DashboardSidebar initialPlaygroundData={formattedPlaygroundData} />

                <main className="flex-1">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}