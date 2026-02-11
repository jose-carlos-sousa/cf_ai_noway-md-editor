import React from "react";

interface MarkdownEditorProps {
    markdown: string;
    onChange: (value: string) => void;
    showAI: boolean;
}

export function MarkdownEditor({ markdown, onChange, showAI }: MarkdownEditorProps) {
    return (
        <div className="flex flex-col h-full group">
            <div
                className={`bg-zinc-900/50 border border-zinc-800/60 rounded-xl shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:border-zinc-700/60 ${showAI ? "h-[calc(50vh-80px)]" : "h-[calc(90vh-100px)]"
                    }`}
            >
                <div className="bg-zinc-950/30 px-5 py-3 border-b border-zinc-800/40 backdrop-blur-sm">
                    <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Editor</h2>
                </div>
                <textarea
                    value={markdown}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 p-5 bg-transparent text-zinc-300 font-mono text-sm resize-none focus:outline-none placeholder-zinc-700 leading-relaxed selection:bg-zinc-700 selection:text-zinc-100"
                    placeholder="Write your markdown here..."
                    spellCheck={false}
                />
            </div>
        </div>
    );
}
