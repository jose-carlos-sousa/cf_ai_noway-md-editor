import React, { useRef, useEffect } from "react";
import { Message } from "@/types";

interface AiAssistantProps {
    showAI: boolean;
    setShowAI: (show: boolean) => void;
    messages: Message[];
    input: string;
    setInput: (value: string) => void;
    onSend: () => void;
    isLoading: boolean;
}

export function AiAssistant({
    showAI,
    setShowAI,
    messages,
    input,
    setInput,
    onSend,
    isLoading,
}: AiAssistantProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!showAI) {
        return (
            <div className="flex items-center justify-center mt-6">
                <button
                    onClick={() => setShowAI(true)}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Open AI Assistant
                </button>
            </div>
        );
    }

    return (
        <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl shadow-sm overflow-hidden mt-6 flex flex-col transition-all duration-300">
            <div className="bg-zinc-950/30 px-5 py-3 border-b border-zinc-800/40 backdrop-blur-sm flex items-center justify-between">
                <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI Assistant
                </h2>
                <button
                    onClick={() => setShowAI(false)}
                    className="text-zinc-600 hover:text-zinc-300 transition-colors p-1 rounded-md hover:bg-zinc-800/50"
                    title="Hide AI Assistant"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div className="h-[300px] overflow-auto p-5 space-y-4 scroll-smooth">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-2">
                        <p className="text-sm font-medium">How can I help you today?</p>
                        <p className="text-xs text-zinc-600">Try "Improve my summary" or "Fix grammar"</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.role === "user"
                                        ? "bg-zinc-800 text-zinc-100 rounded-tr-sm"
                                        : "bg-zinc-950/50 text-zinc-300 border border-zinc-800/50 rounded-tl-sm"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-zinc-950/30 border border-zinc-800/30 rounded-full px-4 py-2 text-zinc-500 text-xs animate-pulse flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-75"></div>
                            <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-zinc-800/40 p-4 bg-zinc-950/30 backdrop-blur-sm">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onSend()}
                        placeholder="Type your request..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-zinc-900/50 border border-zinc-700/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-zinc-100 disabled:opacity-50 placeholder-zinc-600 text-sm transition-all shadow-inner"
                    />
                    <button
                        onClick={onSend}
                        disabled={isLoading}
                        className="px-5 py-2.5 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 rounded-lg transition-all duration-200 font-semibold text-sm shadow-sm hover:shadow"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
