"use client";
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TemplateFileTree } from '@/modules/playground/components/playground-explorer';
import { useFileExplorerStore } from '@/modules/playground/hooks/useFileExplorer';
import { usePlayground } from '@/modules/playground/hooks/usePlayground';
import { TemplateFile, TemplateFolder } from '@/modules/playground/lib/path-to-json';
import { useParams } from 'next/navigation'
import React, { useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic';

const WebContainerPreview = dynamic(
    () => import('@/modules/webcontainers/components/webcontainer-preview'),
    { ssr: false }
);
// import WebContainerPreview from '@/modules/webcontainers/components/webcontainer-preview'
import { Button } from '@/components/ui/button';
import { AlertCircle, Bot, Cat, FileText, FolderOpen, Save, Settings, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import PlaygroundEditor from '@/modules/playground/components/playground-editor';
import { useWebContainer } from '@/modules/webcontainers/hooks/useWebContainer';
import { toast } from "sonner"
import { findFilePath } from '@/modules/playground/lib';
import LoadingStep from '@/modules/playground/components/loader';


const MainPlaygroundPage = () => {

    const { id } = useParams<{ id: string }>()
    const [isPreviewVisible, setIsPreviewVisible] = React.useState(false)

    const { playgroundData, templateData, isLoading, saveTemplateData, error } = usePlayground(id)

    const {
        activeFileId,
        closeAllFiles,
        openFile,
        openFiles,
        setActiveFileId,
        setPlaygroundId,
        setTemplateData,
        closeFile,
        setOpenFiles,
        handleAddFile,
        handleAddFolder,
        handleDeleteFile,
        handleDeleteFolder,
        handleRenameFile,
        handleRenameFolder,
        updateFileContent

    } = useFileExplorerStore()

    const {
        serverUrl,
        isLoading: containerLoading,
        error: containerError,
        instance,
        writeFileSync,
        destroy,
        //@ts-ignore
    } = useWebContainer({ templateData })

    useEffect(() => { setPlaygroundId(id) }, [id, setPlaygroundId])

    const lastSyncedContent = useRef<Map<string, string>>(new Map());


    useEffect(() => {
        if (templateData && openFiles.length === 0) {
            setTemplateData(templateData)
        }
    }, [templateData, openFiles.length, setTemplateData])

    // Create wrapper functions that pass saveTemplateData
    const wrappedHandleAddFile = useCallback(
        (newFile: TemplateFile, parentPath: string) => {
            return handleAddFile(
                newFile,
                parentPath,
                writeFileSync!,
                instance,
                saveTemplateData
            );
        },
        [handleAddFile, writeFileSync, instance, saveTemplateData]
    );

    const wrappedHandleAddFolder = useCallback(
        (newFolder: TemplateFolder, parentPath: string) => {
            return handleAddFolder(newFolder, parentPath, instance, saveTemplateData);
        },
        [handleAddFolder, instance, saveTemplateData]
    );

    const wrappedHandleDeleteFile = useCallback(
        (file: TemplateFile, parentPath: string) => {
            return handleDeleteFile(file, parentPath, saveTemplateData);
        },
        [handleDeleteFile, saveTemplateData]
    );

    const wrappedHandleDeleteFolder = useCallback(
        (folder: TemplateFolder, parentPath: string) => {
            return handleDeleteFolder(folder, parentPath, saveTemplateData);
        },
        [handleDeleteFolder, saveTemplateData]
    );

    const wrappedHandleRenameFile = useCallback(
        (
            file: TemplateFile,
            newFilename: string,
            newExtension: string,
            parentPath: string
        ) => {
            return handleRenameFile(
                file,
                newFilename,
                newExtension,
                parentPath,
                saveTemplateData
            );
        },
        [handleRenameFile, saveTemplateData]
    );

    const wrappedHandleRenameFolder = useCallback(
        (folder: TemplateFolder, newFolderName: string, parentPath: string) => {
            return handleRenameFolder(
                folder,
                newFolderName,
                parentPath,
                saveTemplateData
            );
        },
        [handleRenameFolder, saveTemplateData]
    );

    const activeFile = openFiles.find((file) => file.id === activeFileId);
    const hasUnsavedChanges = openFiles.some((file) => file.hasUnsavedChanges);


    const handleSave = useCallback(
        async (fileId?: string) => {
            const targetFileId = fileId || activeFileId;
            if (!targetFileId) return;

            const fileToSave = openFiles.find((f) => f.id === targetFileId);

            if (!fileToSave) return;

            const latestTemplateData = useFileExplorerStore.getState().templateData;
            if (!latestTemplateData) return

            try {
                const filePath = findFilePath(fileToSave, latestTemplateData);
                if (!filePath) {
                    toast.error(
                        `Could not find path for file: ${fileToSave.filename}.${fileToSave.fileExtension}`
                    );
                    return;
                }

                const updatedTemplateData = JSON.parse(
                    JSON.stringify(latestTemplateData)
                );

                // @ts-ignore
                const updateFileContent = (items: any[]) =>
                    // @ts-ignore
                    items.map((item) => {
                        if ("folderName" in item) {
                            return { ...item, items: updateFileContent(item.items) };
                        } else if (
                            item.filename === fileToSave.filename &&
                            item.fileExtension === fileToSave.fileExtension
                        ) {
                            return { ...item, content: fileToSave.content };
                        }
                        return item;
                    });
                updatedTemplateData.items = updateFileContent(
                    updatedTemplateData.items
                );

                // Sync with WebContainer
                if (writeFileSync) {
                    await writeFileSync(filePath, fileToSave.content);
                    lastSyncedContent.current.set(fileToSave.id, fileToSave.content);
                    if (instance && instance.fs) {
                        await instance.fs.writeFile(filePath, fileToSave.content);
                    }
                }
                await saveTemplateData(updatedTemplateData);
                setTemplateData(updatedTemplateData);

                // Update open files
                const updatedOpenFiles = openFiles.map((f) =>
                    f.id === targetFileId
                        ? {
                            ...f,
                            content: fileToSave.content,
                            originalContent: fileToSave.content,
                            hasUnsavedChanges: false,
                        }
                        : f
                );
                setOpenFiles(updatedOpenFiles);

                toast.success(
                    `Saved ${fileToSave.filename}.${fileToSave.fileExtension}`
                );
            } catch (error) {
                console.error("Error saving file:", error);
                toast.error(
                    `Failed to save ${fileToSave.filename}.${fileToSave.fileExtension}`
                );
                throw error;
            }
        },
        [
            activeFileId,
            openFiles,
            writeFileSync,
            instance,
            saveTemplateData,
            setTemplateData,
            setOpenFiles,
        ]
    );

    const handleSaveAll = async () => {
        const unsavedFiles = openFiles.filter((f) => f.hasUnsavedChanges);

        if (unsavedFiles.length === 0) {
            toast.info("No unsaved changes");
            return;
        }

        try {
            await Promise.all(unsavedFiles.map((f) => handleSave(f.id)));
            toast.success(`Saved ${unsavedFiles.length} file(s)`);
        } catch (error) {
            toast.error("Failed to save some files");
        }
    };


    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "s") {
                e.preventDefault()
                handleSave()
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleSave]);

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

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold text-red-600 mb-2">
                    Something went wrong
                </h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="destructive">
                    Try Again
                </Button>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
                <div className="w-full max-w-md p-6 rounded-lg shadow-sm border">
                    <h2 className="text-xl font-semibold mb-6 text-center">
                        Loading Playground
                    </h2>
                    <div className="mb-8">
                        <LoadingStep
                            currentStep={1}
                            step={1}
                            label="Loading playground data"
                        />
                        <LoadingStep
                            currentStep={2}
                            step={2}
                            label="Setting up environment"
                        />
                        <LoadingStep currentStep={3} step={3} label="Ready to code" />
                    </div>
                </div>
            </div>
        );
    }

    // No template data
    if (!templateData) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
                <FolderOpen className="h-12 w-12 text-amber-500 mb-4" />
                <h2 className="text-xl font-semibold text-amber-600 mb-2">
                    No template data available
                </h2>
                <Button onClick={() => window.location.reload()} variant="outline">
                    Reload Template
                </Button>
            </div>
        );
    }


    return (
        <TooltipProvider>
            <>
                <TemplateFileTree
                    data={templateData}
                    onFileSelect={handleFileSelect}
                    selectedFile={activeFile}
                    title="File Explorer"
                    onAddFile={wrappedHandleAddFile}
                    onAddFolder={wrappedHandleAddFolder}
                    onDeleteFile={wrappedHandleDeleteFile}
                    onDeleteFolder={wrappedHandleDeleteFolder}
                    onRenameFile={wrappedHandleRenameFile}
                    onRenameFolder={wrappedHandleRenameFolder}
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
                                            onClick={() => handleSave()}
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
                                            onClick={() => handleSaveAll()}
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
                                                                {file.filename}.{file.fileExtension}
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
                                                onContentChange={(value) => {
                                                    activeFileId && updateFileContent(activeFileId, value)
                                                }}
                                            />
                                        </ResizablePanel>

                                        {isPreviewVisible && (
                                            <>
                                                <ResizableHandle />
                                                <ResizablePanel defaultSize={50}>
                                                    <WebContainerPreview
                                                        templateData={templateData}
                                                        instance={instance}
                                                        writeFileSync={writeFileSync}
                                                        isLoading={containerLoading}
                                                        error={containerError}
                                                        serverUrl={serverUrl!}
                                                        forceResetup={false}
                                                    />
                                                </ResizablePanel>
                                            </>
                                        )}


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