import { useState } from "react";
import { DiffLine } from "@/types";

// Utility functions (import or paste them as needed)
import { normalizeMarkdown, diffLinesLCS } from "@/utils/markdownUtils"; // adjust path as needed

export function useDiffReview() {
    const [showReview, setShowReview] = useState(false);
    const [diffLines, setDiffLines] = useState<DiffLine[]>([]);

    // Store the latest markdowns for accept/deny
    const [pending, setPending] = useState<{ oldMd: string; newMd: string } | null>(null);

    const createDiff = (oldMd: string, newMd: string) => {
        const normOld = normalizeMarkdown(oldMd);
        const normNew = normalizeMarkdown(newMd);
        const diff = diffLinesLCS(normOld, normNew);
        setDiffLines(diff as DiffLine[]);
        setShowReview(true);
        setPending({ oldMd, newMd });
    };

    const acceptChanges = () => {
        setShowReview(false);
        setDiffLines([]);
        setPending(null);
        // Optionally: apply newMd somewhere
    };

    const denyChanges = () => {
        setShowReview(false);
        setDiffLines([]);
        setPending(null);
        // Optionally: revert to oldMd somewhere
    };

    return { showReview, diffLines, createDiff, acceptChanges, denyChanges, pending };
}