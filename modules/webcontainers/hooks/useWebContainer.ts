import { useState, useCallback, useEffect } from 'react'
import { WebContainer } from "@webcontainer/api"
import { TemplateFolder } from '@/modules/playground/lib/path-to-json'

// 1. We declare these OUTSIDE the hook so they survive Next.js hot-reloads!
let webcontainerInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

interface UseWebContainerProps {
    templateData: TemplateFolder
}

interface UseWebContainerReturn {
    serverUrl: string | null;
    isLoading: boolean;
    error: string | null;
    instance: WebContainer | null;
    writeFileSync: (path: string, content: string) => Promise<void>;
    destroy: () => void;
}

export const useWebContainer = ({ templateData }: UseWebContainerProps): UseWebContainerReturn => {
    const [serverUrl, setServerUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [instance, setInstance] = useState<WebContainer | null>(null);

    useEffect(() => {
        let mounted = true;

        async function initializeWebContainer() {
            try {
                // 2. The Singleton Logic
                if (!webcontainerInstance) {
                    // If it's not currently booting, start the boot process
                    if (!bootPromise) {
                        bootPromise = WebContainer.boot();
                    }
                    // Wait for it to finish booting
                    webcontainerInstance = await bootPromise;
                }

                if (!mounted) return;

                setInstance(webcontainerInstance);
                setIsLoading(false);

            } catch (error) {
                setError(error instanceof Error ? error.message : "Failed to initialize WebContainer");
                setIsLoading(false);
            }
        }

        initializeWebContainer();

        return () => {
            mounted = false;
            // 3. DO NOT teardown the instance here during development!
            // Next.js fast-refresh will kill the component, but we want to keep 
            // the WebContainer alive in the background so it doesn't crash on the next save.
        };

    }, [])

    const writeFileSync = useCallback(async (path: string, content: string): Promise<void> => {
        if (!instance) {
            throw new Error("WebContainer is not initialized");
        }

        try {
            const pathParts = path.split("/");
            const folderPath = pathParts.slice(0, -1).join("/");

            if (folderPath) {
                await instance.fs.mkdir(folderPath, { recursive: true });
            }

            await instance.fs.writeFile(path, content);

        } catch (error) {
            console.log(error);
            throw new Error(`Failed to write file: ${(error as Error).message}`);
        }
    }, [instance]);

    const destroy = useCallback(() => {
        if (instance) {
            instance.teardown();
            setInstance(null);
            setServerUrl(null);
            // Reset our global variables so it can boot fresh next time
            webcontainerInstance = null;
            bootPromise = null;
        }
    }, [instance]);

    return {
        serverUrl,
        isLoading,
        error,
        instance,
        writeFileSync,
        destroy
    }
}