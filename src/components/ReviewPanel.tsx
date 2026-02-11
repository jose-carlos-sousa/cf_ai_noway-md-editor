import React from "react";
import { DiffLine } from "@/types";

interface ReviewPanelProps {
    pendingMarkdown: string;
    diffLines: DiffLine[];
    onAccept: () => void;
    onDeny: () => void;
    onDismiss: () => void;
    showAI: boolean;
}

export function ReviewPanel({ pendingMarkdown, diffLines, onAccept, onDeny, onDismiss, showAI }: ReviewPanelProps) {
    return (
        <div className="flex flex-col h-full group">
            <div
                className={`bg-zinc-900/50 border border-zinc-700/60 rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 ring-1 ring-zinc-800/50 ${showAI ? "h-[calc(50vh-80px)]" : "h-[calc(90vh-100px)]"
                    }`}
            >
                <div className="px-5 py-3 border-b border-zinc-800/40 backdrop-blur-sm flex items-center justify-between bg-zinc-950/30">
                    <h2 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                        Suggested Changes
                    </h2>
                    <button
                        onClick={onDismiss}
                        className="text-zinc-600 hover:text-zinc-300 transition-colors p-1 rounded-md hover:bg-zinc-800/50"
                        title="Dismiss review"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 overflow-auto p-4 bg-zinc-950/20">
                    {diffLines.length === 0 || diffLines.every((l) => l.type === "unchanged") ? (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500 font-mono text-sm">
                            <span>No changes detected.</span>
                        </div>
                    ) : (
                        <div className="font-mono text-xs md:text-sm bg-zinc-950/40 rounded-lg border border-zinc-800/50 overflow-hidden">
                            {diffLines.map((line, idx) => {
                                if (line.type === "added") {
                                    return (
                                        <div key={idx} className="flex bg-emerald-950/20 border-l-[3px] border-emerald-500/50 text-emerald-200/90 py-0.5 px-3 hover:bg-emerald-950/30 transition-colors">
                                            <span className="w-4 select-none opacity-50 mr-2">+</span>
                                            <span className="whitespace-pre-wrap break-all">{line.content}</span>
                                        </div>
                                    );
                                } else if (line.type === "removed") {
                                    return (
                                        <div key={idx} className="flex bg-red-950/20 border-l-[3px] border-red-500/50 text-red-200/80 py-0.5 px-3 hover:bg-red-950/30 transition-colors opacity-70">
                                            <span className="w-4 select-none opacity-50 mr-2">-</span>
                                            <span className="whitespace-pre-wrap break-all line-through decoration-red-500/50">{line.content}</span>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={idx} className="flex text-zinc-500 py-0.5 px-3 border-l-[3px] border-transparent hover:bg-zinc-900/30 transition-colors">
                                            <span className="w-4 select-none opacity-20 mr-2"> </span>
                                            <span className="whitespace-pre-wrap break-all">{line.content}</span>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    )}
                </div>
                <div className="border-t border-zinc-800/40 p-4 flex gap-3 justify-end bg-zinc-950/30 backdrop-blur-sm">
                    <button
                        onClick={onDeny}
                        className="px-4 py-2 border border-red-900/30 hover:bg-red-950/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 text-xs font-semibold uppercase tracking-wide"
                    >
                        Discard
                    </button>
                    <button
                        onClick={onAccept}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all duration-200 text-xs font-bold uppercase tracking-wide shadow-md hover:shadow-emerald-900/20 shadow-emerald-900/10"
                    >
                        Accept & Apply
                    </button>
                </div>
            </div>
        </div>
    );
}
