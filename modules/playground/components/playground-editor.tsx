"use client";
import { useRef, useEffect } from 'react';
import { configureMonaco, defaultEditorOptions, getEditorLanguage } from '../lib/editor-config';
import { TemplateFile } from '../lib/path-to-json';
import React from 'react';
import { Editor, Monaco } from '@monaco-editor/react';
import { getInlineCompletion } from '../actions/copilot';

interface PlaygroundEditorProps {
    activeFile: TemplateFile | undefined;
    content: string;
    onContentChange: (value: string) => void;
}

const PlaygroundEditor = ({
    activeFile,
    content,
    onContentChange,
}: PlaygroundEditorProps) => {

    const editorRef = useRef<any>(null);
    const monacoRef = useRef<Monaco | null>(null);
    // Keep track of the timeout so we can cancel it if the user keeps typing
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);


    const loadedFileIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!activeFile) return;

        const fileKey = (activeFile as any).id || activeFile.filename;

        if (loadedFileIdRef.current !== fileKey) {
            const savedCode = localStorage.getItem(`orbit-file-${fileKey}`);

            const isPlaceholder = (text: string) => text?.includes("File imported from GitHub");

            if (savedCode && !isPlaceholder(savedCode)) {
                onContentChange(savedCode);
            }
            else if (isPlaceholder(activeFile.content)) {
                const githubUrl = (activeFile as any).githubUrl;

                if (githubUrl) {
                    onContentChange("// Fetching file from GitHub...");

                    fetch(githubUrl)
                        .then(res => res.json())
                        .then(data => {
                            const realCode = atob(data.content);
                            onContentChange(realCode);
                            localStorage.setItem(`orbit-file-${fileKey}`, realCode);
                        })
                        .catch(err => {
                            console.error("Failed to fetch from GitHub:", err);
                            onContentChange("// Error loading file from GitHub.");
                        });
                } else {
                    console.log("Uh oh, this file is missing its githubUrl:", activeFile);
                }
            }
            else {
                onContentChange(activeFile.content || "");
            }

            loadedFileIdRef.current = fileKey;
        }
    }, [activeFile]);

    useEffect(() => {
        if (!activeFile || !content) return;

        const fileKey = (activeFile as any).id || (activeFile as any).name;
        localStorage.setItem(`orbit-file-${fileKey}`, content);
    }, [content, activeFile]);


    const handleEditorMount = (editor: any, monaco: Monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        editor.updateOptions({
            ...defaultEditorOptions,
            inlineSuggest: { enabled: true },
        });

        configureMonaco(monaco);

        monaco.languages.registerInlineCompletionsProvider('*', {
            provideInlineCompletions: async (model: any, position: any, context: any, token: any) => {
                const textUntilPosition = model.getValueInRange({
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                });

                const language = model.getLanguageId();

                return new Promise((resolve) => {
                    if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                    }

                    typingTimeoutRef.current = setTimeout(async () => {
                        if (token.isCancellationRequested) {
                            return resolve({ items: [] });
                        }

                        const response = await getInlineCompletion(textUntilPosition, language);

                        if (!response.completion) {
                            return resolve({ items: [] });
                        }

                        resolve({
                            items: [
                                {
                                    insertText: response.completion,
                                    range: new monaco.Range(
                                        position.lineNumber,
                                        position.column,
                                        position.lineNumber,
                                        position.column
                                    ),
                                }
                            ]
                        });
                    }, 1000);
                });
            },
            freeInlineCompletions: () => { },
            disposeInlineCompletions: () => { }
        });
    }

    const updateEditorLanguage = () => {
        if (!activeFile || !monacoRef.current || !editorRef.current) return;
        const model = editorRef.current.getModel();
        if (!model) return;

        const language = getEditorLanguage(activeFile.fileExtension || "");
        try {
            monacoRef.current.editor.setModelLanguage(model, language);
        } catch (error) {
            console.warn("Failed to set editor language:", error);
        }
    }

    useEffect(() => {
        updateEditorLanguage();
    }, [activeFile]);

    return (
        <div className='h-full relative'>
            <Editor
                height="100%"
                value={content}
                onChange={(value) => onContentChange(value || '')}
                onMount={handleEditorMount}
                language={getEditorLanguage(activeFile?.fileExtension || '') || "plaintext"}
                //@ts-ignore
                options={{ ...defaultEditorOptions, inlineSuggest: { enabled: true } }}
            />
        </div>
    )
}

export default PlaygroundEditor;