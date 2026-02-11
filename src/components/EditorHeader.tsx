"use client";

import React from "react";
import { SaveStatus } from "../hooks/useMarkdownEditor";

interface EditorHeaderProps {
    username: string;
    showPreview: boolean;
    onTogglePreview: () => void;
    onExport: () => void;
    onLogout: () => void;
    saveStatus: SaveStatus;
}

export function EditorHeader({
    username,
    showPreview,
    onTogglePreview,
    onExport,
    onLogout,
    saveStatus,
}: EditorHeaderProps) {
    return (
        <header className="mb-6 flex items-center justify-between py-4">
            <div className="flex items-center">
                <h1 className="text-lg font-bold text-zinc-100 tracking-wide select-none">
                    NOWAY<span className="text-zinc-600 font-light">EDITOR</span>
                </h1>
            </div>

            {/* Central Status Indicator */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 pointer-events-none">
                {saveStatus === "saving" && (
                    <span className="text-xs text-zinc-500 animate-pulse flex items-center gap-1.5 font-medium">
                        <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving
                    </span>
                )}
                {saveStatus === "saved" && (
                    <span className="text-xs text-zinc-500 flex items-center gap-1.5 transition-opacity duration-500 font-medium">
                        <svg className="w-3 h-3 text-emerald-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Saved
                    </span>
                )}
                {saveStatus === "unsaved" && (
                    <span className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500/80"></div>
                        Unsaved
                    </span>
                )}
                {saveStatus === "error" && (
                    <span className="text-xs text-red-500 flex items-center gap-1.5 font-medium">
                        Error
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                <div className="text-xs text-zinc-500 mr-4 hidden md:block">
                    <span className="text-zinc-600">User:</span> <span className="font-medium text-zinc-400">{username}</span>
                </div>

                <button
                    onClick={onTogglePreview}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 border ${showPreview
                            ? "bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700"
                            : "bg-transparent text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-900"
                        }`}
                >
                    {showPreview ? "Preview On" : "Preview Off"}
                </button>

                <button
                    onClick={onExport}
                    className="px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-md text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow"
                >
                    Export
                </button>

                <button
                    onClick={onLogout}
                    className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all duration-200"
                    title="Sign Out"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        </header>
    );
}
