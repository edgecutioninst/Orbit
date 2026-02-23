"use client";

import { useChat } from '@ai-sdk/react';
import { Button } from "@/components/ui/button";
import { Bot, User, Send, X, Loader2, Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';

interface ChatPanelProps {
    onClose: () => void;
    code: string;
    language: string;
}

// 1. We lock the PreBlock container so it CANNOT push the bubble wider
const PreBlock = ({ children, ...props }: any) => {
    const [copied, setCopied] = useState(false);
    const rawText = children?.props?.children || '';

    const handleCopy = () => {
        navigator.clipboard.writeText(String(rawText).replace(/\n$/, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-3 w-full min-w-0">
            <div className="absolute right-2 top-2 z-10">
                <button
                    onClick={handleCopy}
                    className="bg-[#0a0014] border border-purple-900/50 hover:bg-purple-900/50 text-zinc-400 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                    title="Copy code"
                >
                    {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                </button>
            </div>
            {/* Add w-full and min-w-0 to the pre tag itself */}
            <pre className="bg-[#03000a] border border-purple-900/40 p-4 pt-8 rounded-md overflow-x-auto font-mono text-xs text-green-400 shadow-inner w-full min-w-0 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-purple-900/50 hover:scrollbar-thumb-purple-500/50" {...props}>
                {children}
            </pre>
        </div>
    );
};

export default function ChatPanel({ onClose, code, language }: ChatPanelProps) {
    const [input, setInput] = useState('');
    const { messages, sendMessage, status } = useChat();
    const isLoading = status === 'submitted' || status === 'streaming';
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage(
                { text: input },
                {
                    body: { code, language }
                }
            );
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-[#0a0014] border-l border-purple-900/20">
            <div className="flex items-center justify-between px-4 py-2 border-b border-purple-900/20 bg-[#03000a]">
                <div className="flex items-center gap-2 text-purple-300">
                    <Bot className="h-4 w-4" />
                    <span className="text-sm font-medium">Orbit AI</span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-zinc-500 hover:text-purple-300" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* 2. Force overflow-x-hidden on the main messages area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 min-h-0 w-full">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-sm">
                        <Bot className="h-8 w-8 mb-2 opacity-50" />
                        <p>Ask me to explain code or find bugs!</p>
                    </div>
                ) : (
                    messages.map((m) => (
                        // 3. Lock the message row with w-full
                        <div key={m.id} className={`flex gap-3 w-full ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center justify-center h-8 w-8 rounded-full shrink-0 ${m.role === 'user' ? 'bg-purple-600' : 'bg-zinc-800'}`}>
                                {m.role === 'user' ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-purple-400" />}
                            </div>
                            {/* 4. Lock the bubble strictly to 85% width and FORCE min-w-0 */}
                            <div className={`flex flex-col max-w-[85%] min-w-0 overflow-hidden rounded-lg p-3 text-sm ${m.role === 'user' ? 'bg-purple-600/20 text-purple-100' : 'bg-zinc-800/50 text-zinc-300'}`}>
                                <div className="text-sm w-full min-w-0">
                                    <ReactMarkdown
                                        components={{
                                            pre: PreBlock,
                                            code: ({ node, inline, ...props }: any) => (
                                                inline
                                                    ? <code className="bg-purple-900/40 text-purple-200 px-1.5 py-0.5 rounded font-mono text-xs break-words" {...props} />
                                                    : <code {...props} />
                                            ),
                                            p: ({ node, ...props }) => <p className="mb-3 last:mb-0 leading-relaxed break-words" {...props} />,
                                        }}
                                    >
                                        {m.parts.map((part) => (part.type === 'text' ? part.text : '')).join('')}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#03000a] border-t border-purple-900/20">
                <form onSubmit={onSubmit} className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your code..."
                        className="flex-1 min-w-0 bg-zinc-900/50 border border-purple-900/30 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-purple-500"
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </form>
            </div>
        </div>
    );
}