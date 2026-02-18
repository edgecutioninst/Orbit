import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import type { TemplateFolder } from '../lib/path-to-json';
import { getPlaygroundById, saveUpdatedCode } from '../actions';

interface PlaygroundData {
    id: string;
    title?: string;
    description?: string;
    template?: string;
    [key: string]: any;
}

interface UsePlaygroundReturn {
    playgroundData: PlaygroundData | null;
    templateData: TemplateFolder | null;
    isLoading: boolean;
    error: string | null;
    loadPlayground: (id: string) => Promise<void>;
    saveTemplateData: (data: TemplateFolder) => Promise<void>;
}

export const usePlayground = (id: string): UsePlaygroundReturn => {
    const [playgroundData, setPlaygroundData] = useState<PlaygroundData | null>(null);
    const [templateData, setTemplateData] = useState<TemplateFolder | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadPlayground = useCallback(async (playgroundId: string) => {
        if (!playgroundId) return;

        try {
            setIsLoading(true);
            setError(null);

            const data = await getPlaygroundById(playgroundId);
            setPlaygroundData(data as PlaygroundData);

            const rawContent = data?.templateFile?.[0]?.content;

            if (rawContent) {
                setTemplateData(rawContent as unknown as TemplateFolder);
                toast.success("Playground loaded successfully!");
                return;
            }

            const res = await fetch(`/api/template/${playgroundId}`);
            if (!res.ok) {
                throw new Error("Failed to load template data");
            }

            const templateRes = await res.json();

            if (templateRes.templateJson && Array.isArray(templateRes.templateJson)) {
                setTemplateData({
                    folderName: "Root",
                    items: templateRes.templateJson,
                });
            } else {
                setTemplateData(
                    templateRes.templateJson || {
                        folderName: "Root",
                        items: [],
                    }
                );
            }
            toast.success("Template generated successfully");

        } catch (err) {
            console.error("Error loading playground:", err);
            setError("Failed to load playground data");
            toast.error("Failed to load playground data");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const saveTemplateData = useCallback(async (data: TemplateFolder) => {
        try {
            await saveUpdatedCode(id, data);
            toast.success("Playground saved successfully!");
        } catch (err) {
            console.error("Error saving playground:", err);
            toast.error("Failed to save playground data");
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            loadPlayground(id);
        }
    }, [id, loadPlayground]);

    return {
        playgroundData,
        templateData,
        isLoading,
        error,
        loadPlayground,
        saveTemplateData,
    };
};