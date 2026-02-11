import { useState, useEffect, useRef } from "react";
import { markdownService } from "@/services/markdownService";

const AUTOSAVE_INTERVAL = 5000; // 5 seconds

export type SaveStatus = "saved" | "saving" | "unsaved" | "error";

export function useMarkdownEditor(username: string, initialMarkdown: string) {
    const [markdown, setMarkdown] = useState(initialMarkdown);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // We use refs to track the latest state inside the interval without re-triggering it
    const markdownRef = useRef(markdown);
    const lastSavedMarkdownRef = useRef(initialMarkdown);
    const isInitialLoadRef = useRef(true);

    // Update refs when markdown changes
    useEffect(() => {
        markdownRef.current = markdown;
        if (markdown !== lastSavedMarkdownRef.current) {
            setSaveStatus("unsaved");
            // Save to local storage immediately
            if (username && !isInitialLoadRef.current) {
                localStorage.setItem(`markdown_${username}`, markdown);
            }
        }
    }, [markdown, username]);

    // Initial load from local storage or remote
    useEffect(() => {
        if (!username) return;

        const loadContent = async () => {
            try {
                // Try local storage first for immediate display
                const localContent = localStorage.getItem(`markdown_${username}`);
                if (localContent) {
                    setMarkdown(localContent);
                    lastSavedMarkdownRef.current = localContent; // Assume local is "saved" relative to session start
                    setSaveStatus("saved"); // Assume local is "saved" relative to session start
                }

                // Then fetch from server to get latest source of truth
                const remoteContent = await markdownService.load(username);
                if (remoteContent) {
                    // Conflict resolution strategy: 
                    // If we have local changes that are different from remote, we might want to ask.
                    // For simplicity, if we have local content distinct from remote, keep local but mark diff.
                    // Here we'll just respect local if it exists and differs, or take remote.
                    // Actually, simplified: if local exists, use it. If not, use remote.
                    // If remote is newer? We don't have timestamps.
                    // Let's stick to: if local exists, use it.
                    if (!localContent) {
                        setMarkdown(remoteContent);
                        lastSavedMarkdownRef.current = remoteContent;
                        setSaveStatus("saved");
                    }
                }
                isInitialLoadRef.current = false;
            } catch (err) {
                console.error("Error loading markdown:", err);
            }
        };

        loadContent();
    }, [username]);

    // Autosave interval
    useEffect(() => {
        if (!username) return;

        const intervalId = setInterval(async () => {
            const currentMarkdown = markdownRef.current;
            const lastSaved = lastSavedMarkdownRef.current;

            if (currentMarkdown !== lastSaved) {
                setSaveStatus("saving");
                try {
                    await markdownService.save(username, currentMarkdown);
                    lastSavedMarkdownRef.current = currentMarkdown;
                    setSaveStatus("saved");
                    setLastSaved(new Date());
                } catch (err) {
                    console.error("Autosave error:", err);
                    setSaveStatus("error");
                }
            }
        }, AUTOSAVE_INTERVAL);

        return () => clearInterval(intervalId);
    }, [username]);

    // Manual save handler
    const saveMarkdown = async () => {
        if (!username) return;
        setSaveStatus("saving");
        try {
            await markdownService.save(username, markdown);
            lastSavedMarkdownRef.current = markdown;
            setSaveStatus("saved");
            setLastSaved(new Date());
        } catch (err) {
            console.error("Manual save error:", err);
            setSaveStatus("error");
            alert("Failed to save markdown.");
        }
    };

    return {
        markdown,
        setMarkdown,
        saveStatus,
        lastSaved,
        saveMarkdown,
    };
}