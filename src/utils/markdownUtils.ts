// Utility functions for Markdown operations

/**
 * Exports the given markdown content as a downloadable file.
 * @param markdown - The markdown content to export.
 */
export const exportMarkdown = (markdown: string) => {
  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume.md";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

/**
 * Extracts the markdown content from a given text block.
 * @param text - The text containing markdown content.
 * @returns The extracted markdown content or null if not found.
 */
export const extractMarkdown = (text: string): string | null => {
  const match = text.match(/```markdown\n([\s\S]*?)```/);
  if (match) return match[1].trim();
  const openBlock = text.match(/```markdown\n([\s\S]*)/);
  if (openBlock) return openBlock[1].trim();
  return null;
};

/**
 * Extracts the explanation part from the AI response (everything outside the markdown block).
 * @param text - The full text from AI.
 * @returns The explanation text.
 */
export const extractExplanation = (text: string): string => {
  const match = text.match(/```markdown\n([\s\S]*?)```/);
  if (match && match.index !== undefined) {
    return text.slice(match.index + match[0].length).trim();
  }
  const openBlock = text.match(/```markdown\n([\s\S]*)/);
  if (openBlock && openBlock.index !== undefined) {
    return text.slice(openBlock.index + openBlock[0].length).trim();
  }
  return "";
};

/**
 * Normalizes markdown content for diffing by adding line breaks after headers, lists, etc.
 * @param md - The markdown content to normalize.
 * @returns The normalized markdown content.
 */
export const normalizeMarkdown = (md: string): string => {
  return md
    .replace(/\r/g, "")
    .replace(/(#+ .*)/g, "$1\n")
    .replace(/(\*.+)/g, "$1\n")
    .replace(/(- .+)/g, "$1\n")
    .replace(/(\n{2,})/g, "\n")
    .replace(/\n\s+\n/g, "\n")
    .trim();
};

/**
 * Computes the line-by-line difference between two markdown texts using LCS (Longest Common Subsequence).
 * @param oldText - The original markdown text.
 * @param newText - The updated markdown text.
 * @returns An array representing the differences between the two texts.
 */
export const diffLinesLCS = (oldText: string, newText: string) => {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");

  // Build LCS matrix
  const buildLCSMatrix = (m: number, n: number) => {
    const lcs: number[][] = Array(m + 1)
      .fill(0)
      .map(() => Array(n + 1).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (oldLines[i] === newLines[j]) {
          lcs[i + 1][j + 1] = lcs[i][j] + 1;
        } else {
          lcs[i + 1][j + 1] = Math.max(lcs[i + 1][j], lcs[i][j + 1]);
        }
      }
    }
    return lcs;
  };

  // Backtrack to build diff
  const backtrackDiff = (lcs: number[][], m: number, n: number) => {
    const diff: Array<{ type: "added" | "removed" | "unchanged"; content: string }> = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
        diff.unshift({ type: "unchanged", content: oldLines[i - 1] });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
        diff.unshift({ type: "added", content: newLines[j - 1] });
        j--;
      } else if (i > 0 && (j === 0 || lcs[i][j - 1] < lcs[i - 1][j])) {
        diff.unshift({ type: "removed", content: oldLines[i - 1] });
        i--;
      }
    }
    return diff;
  };

  const m = oldLines.length;
  const n = newLines.length;
  const lcs = buildLCSMatrix(m, n);
  return backtrackDiff(lcs, m, n);
};