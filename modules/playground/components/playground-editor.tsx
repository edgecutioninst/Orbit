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

    const handleEditorMount = (editor: any, monaco: Monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        editor.updateOptions({
            ...defaultEditorOptions,
            inlineSuggest: { enabled: true }, // ghost text is turned on
        });

        configureMonaco(monaco);

        // Register the AI Copilot Autocomplete
        monaco.languages.registerInlineCompletionsProvider('*', {
            provideInlineCompletions: async (model: any, position: any, context: any, token: any) => {
                // Get all the text from the start of the file up to exactly where the cursor is
                const textUntilPosition = model.getValueInRange({
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                });

                const language = model.getLanguageId();

                // Debounce: Wait 800ms after the user stops typing before asking the AI
                return new Promise((resolve) => {
                    if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                    }

                    typingTimeoutRef.current = setTimeout(async () => {
                        // If the user started typing again while we were waiting, cancel this request
                        if (token.isCancellationRequested) {
                            return resolve({ items: [] });
                        }

                        // Call our Server Action
                        const response = await getInlineCompletion(textUntilPosition, language);

                        if (!response.completion) {
                            return resolve({ items: [] });
                        }

                        // Give Monaco the ghost text!
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
                    }, 1000); // delay
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