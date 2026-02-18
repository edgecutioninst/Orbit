"use client";
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TemplateFileTree } from '@/modules/playground/components/playground-explorer';
import { useFileExplorerStore } from '@/modules/playground/hooks/useFileExplorer';
import { usePlayground } from '@/modules/playground/hooks/usePlayground';
import { TemplateFile } from '@/modules/playground/lib/path-to-json';
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { Bot, Cat, FileText, Save, Settings, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import PlaygroundEditor from '@/modules/playground/components/playground-editor';



const MainPlaygroundPage = () => {

    const { id } = useParams<{ id: string }>()
    const [isPreviewVisible, setIsPreviewVisible] = React.useState(false)

    const { playgroundData, templateData, isLoading, error } = usePlayground(id)

    const {
        activeFileId,
        closeAllFiles,
        openFile,
        openFiles,
        setActiveFileId,
        setPlaygroundId,
        setTemplateData,
        closeFile,
        setOpenFiles
    } = useFileExplorerStore()

    useEffect(() => { setPlaygroundId(id) }, [id, setPlaygroundId])

    useEffect(() => {
        if (templateData && openFiles.length === 0) {
            setTemplateData(templateData)
        }
    }, [templateData, openFiles.length, setTemplateData])

    const activeFile = openFiles.find(file => file.id === activeFileId)
    const hasUnsavedChanges = openFiles.some(file => file.hasUnsavedChanges)

    const handleFileSelect = (file: TemplateFile) => {
        openFile(file)
    }

    if (isLoading || !templateData) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#03000a]">
                <div className="animate-pulse text-purple-500 font-medium">Initializing Workspace...</div>
            </div>
        )
    }

    return (
        <TooltipProvider>
            <>
                <TemplateFileTree
                    data={templateData}
                    onFileSelect={handleFileSelect}
                    selectedFile={activeFile}
                    title="File Explorer"
                    onAddFile={() => { }}
                    onAddFolder={() => { }}
                    onDeleteFile={() => { }}
                    onDeleteFolder={() => { }}
                    onRenameFile={() => { }}
                    onRenameFolder={() => { }}
                />

                <SidebarInset className="bg-[#03000a]">
                    <header className='flex h-16 shrink-0 items-center gap-2 border-b border-purple-900/20 px-4'>
                        <SidebarTrigger className='ml-1 text-zinc-400 hover:text-purple-400' />
                        <Separator orientation='vertical' className='mr-2 h-4 bg-purple-900/20' />

                        <div className='flex flex-1 items-center justify-between'>
                            <div className='flex flex-col'>
                                <h1 className='text-sm font-medium text-purple-300'>
                                    {playgroundData?.title || "Code Playground"}
                                </h1>
                                <p className='text-xs text-purple-500/70'>
                                    {openFiles.length} File(s) Open {hasUnsavedChanges && <span className="text-orange-400">* Unsaved Changes</span>}
                                </p>
                            </div>

                            <div className='flex items-center gap-1'>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className='text-sm text-zinc-400 hover:text-purple-400 hover:bg-purple-900/20'
                                            onClick={() => closeAllFiles()}
                                            disabled={!activeFileId || !hasUnsavedChanges}
                                        >
                                            <Save className='mr-2 h-4 w-4' />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-purple-950 border-purple-800 text-purple-100">
                                        <p>Save (Ctrl + S)</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className='text-sm text-zinc-400 hover:text-purple-400 hover:bg-purple-900/20'
                                            onClick={() => closeAllFiles()}
                                            disabled={!hasUnsavedChanges}
                                        >
                                            <Save className='mr-2 h-4 w-4' /> All
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-purple-950 border-purple-800 text-purple-100">
                                        <p>Save All (Ctrl + Shift + S)</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Button variant={"ghost"} size={"sm"} className="text-zinc-400 hover:text-purple-400 hover:bg-purple-900/20">
                                    <Cat className='mr-2 h-4 w-4' /> Run
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-purple-400 hover:bg-purple-900/20">
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-[#0a0014] border-purple-900/30 text-zinc-300">
                                        <DropdownMenuItem
                                            className="hover:bg-purple-900/40 hover:text-purple-300 cursor-pointer"
                                            onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                                        >
                                            {isPreviewVisible ? "Hide" : "Show"} Preview
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-purple-900/20" />
                                        <DropdownMenuItem
                                            className="hover:bg-purple-900/40 hover:text-purple-300 cursor-pointer"
                                            onClick={closeAllFiles}
                                        >
                                            Close All Files
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </header>

                    <div className="h-[calc(100vh-4rem)]">
                        {openFiles.length > 0 ? (
                            <div className="h-full flex flex-col">
                                <div className="border-b border-purple-900/20 bg-[#03000a]">
                                    <Tabs
                                        value={activeFileId || ""}
                                        onValueChange={setActiveFileId}
                                    >
                                        <div className="flex items-center justify-between">
                                            <TabsList className="h-9 bg-transparent p-0 flex space-x-0">
                                                {openFiles.map((file) => (
                                                    <TabsTrigger
                                                        key={file.id}
                                                        value={file.id}
                                                        className="relative h-9 rounded-none border-r border-purple-900/20 px-4 text-zinc-500 hover:text-purple-300 data-[state=active]:bg-purple-900/10 data-[state=active]:text-purple-300 data-[state=active]:border-b-2 data-[state=active]:border-b-purple-500 group transition-all"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-3.5 w-3.5" />
                                                            <span className="font-medium">
                                                                {file.filename}{file.fileExtension}
                                                            </span>
                                                            {file.hasUnsavedChanges && (
                                                                <span className="h-2 w-2 rounded-full bg-orange-500" />
                                                            )}
                                                            <span
                                                                className="ml-2 h-5 w-5 hover:bg-purple-900/40 hover:text-purple-200 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    closeFile(file.id);
                                                                }}
                                                            >
                                                                <X className="h-3.5 w-3.5" />
                                                            </span>
                                                        </div>
                                                    </TabsTrigger>
                                                ))}
                                            </TabsList>
                                        </div>
                                    </Tabs>
                                </div>
                                <div className="flex-1 p-4 text-zinc-300 font-mono text-sm">
                                    {/* @ts-ignore - shadcn type mismatch */}
                                    <ResizablePanelGroup direction="horizontal" className="h-full">

                                        <ResizablePanel defaultSize={isPreviewVisible ? 50 : 100}>
                                            <PlaygroundEditor
                                                activeFile={activeFile}
                                                content={activeFile?.content || ""}
                                                onContentChange={() => { }}
                                            />
                                        </ResizablePanel>

                                    </ResizablePanelGroup>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full items-center justify-center gap-4">
                                <div className="p-6 rounded-full bg-purple-900/10">
                                    <FileText className="h-16 w-16 text-purple-500/30" />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-medium text-purple-300">No files open</p>
                                    <p className="text-sm text-zinc-500 mt-1">
                                        Select a file from the sidebar to start editing
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </SidebarInset>
            </>
        </TooltipProvider >
    )
}

export default MainPlaygroundPage