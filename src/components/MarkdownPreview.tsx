import React from "react";
import Markdown from "react-markdown";

interface MarkdownPreviewProps {
    markdown: string;
    showAI: boolean;
    onClose: () => void;
}

export function MarkdownPreview({ markdown, showAI, onClose }: MarkdownPreviewProps) {
    return (
        <div className="flex flex-col h-full group">
            <div
                className={`bg-zinc-900/50 border border-zinc-800/60 rounded-xl shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:border-zinc-700/60 ${showAI ? "h-[calc(50vh-80px)]" : "h-[calc(90vh-100px)]"
                    }`}
            >
                <div className="bg-zinc-950/30 px-5 py-3 border-b border-zinc-800/40 backdrop-blur-sm flex items-center justify-between">
                    <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Preview</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-600 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100"
                        title="Hide preview"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 overflow-auto p-8 prose prose-invert max-w-none prose-sm prose-zinc">
                    <Markdown
                        components={{
                            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-6 text-zinc-50 tracking-tight" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-8 mb-4 text-zinc-100 tracking-tight border-b border-zinc-800/50 pb-2" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-lg font-medium mt-6 mb-3 text-zinc-200" {...props} />,
                            p: ({ node, ...props }) => <p className="my-4 text-zinc-400 leading-7 font-light" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-semibold text-zinc-200" {...props} />,
                            em: ({ node, ...props }) => <em className="italic text-zinc-500" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-4 text-zinc-400 space-y-1" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-4 text-zinc-400 space-y-1" {...props} />,
                            li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                            hr: ({ node, ...props }) => <hr className="my-8 border-zinc-800/50" {...props} />,
                            code: ({ node, ...props }) => <code className="bg-zinc-950/50 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-300 border border-zinc-800/50" {...props} />,
                            pre: ({ node, ...props }) => <pre className="bg-zinc-950/50 p-4 rounded-lg my-6 overflow-x-auto border border-zinc-800/50 text-xs" {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-zinc-700 pl-4 py-1 my-6 text-zinc-500 italic" {...props} />,
                            a: ({ node, ...props }) => <a className="text-zinc-200 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-400 transition-all" {...props} />,
                        }}
                    >
                        {markdown}
                    </Markdown>
                </div>
            </div>
        </div>
    );
}
