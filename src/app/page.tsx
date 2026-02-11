"use client";

import { useState } from "react";
import { exportMarkdown } from "../utils/markdownUtils";
import { UsernamePrompt } from "../components/UsernamePrompt";
import { EditorHeader } from "../components/EditorHeader";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { MarkdownPreview } from "../components/MarkdownPreview";
import { AiAssistant } from "../components/AiAssistant";
import { ReviewPanel } from "../components/ReviewPanel";
import { useAIChat } from "../hooks/useAIChat";
import { useMarkdownEditor } from "../hooks/useMarkdownEditor";

const defaultResume = `# My tasks
- Go to the Gym
- Buy bread
- Help John with homework
`;

export default function Home() {
  const [username, setUsername] = useState("");
  const [isUsernameSubmitted, setIsUsernameSubmitted] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Use custom hook for markdown editing and autosave
  const {
    markdown,
    setMarkdown,
    saveStatus,
    saveMarkdown
  } = useMarkdownEditor(username, defaultResume);

  // Use custom hook for AI chat and diff review
  const {
    messages,
    isLoading,
    input,
    setInput,
    showAI,
    setShowAI,
    sendMessage,
    showReview,
    diffLines,
    acceptChanges,
    denyChanges,
    pending,
  } = useAIChat(markdown);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {!isUsernameSubmitted ? (
        <UsernamePrompt
          onSubmit={(name) => {
            setUsername(name);
            setIsUsernameSubmitted(true);
          }}
        />
      ) : (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <EditorHeader
            username={username}
            showPreview={showPreview}
            onTogglePreview={() => setShowPreview(!showPreview)}
            onExport={() => exportMarkdown(markdown)}
            onLogout={() => {
              setUsername("");
              setIsUsernameSubmitted(false);
              // Consider clearing localStorage here if you want logout to clear local data
              // localStorage.removeItem(`markdown_${username}`);
            }}
            saveStatus={saveStatus}
          />

          <div className={`flex flex-col lg:flex-row mb-6 transition-all duration-500 ease-in-out ${showPreview ? "gap-6" : "gap-0"}`}>
            {/* Editor Panel or Review Panel */}
            <div className={`transition-all duration-500 ease-in-out ${showPreview ? "lg:w-1/2" : "lg:w-full"} w-full`}>
              {showReview && pending ? (
                <ReviewPanel
                  pendingMarkdown={pending.newMd}
                  diffLines={diffLines}
                  onAccept={() => {
                    setMarkdown(pending.newMd);
                    acceptChanges();
                  }}
                  onDeny={denyChanges}
                  onDismiss={denyChanges}
                  showAI={showAI}
                />
              ) : (
                <MarkdownEditor
                  markdown={markdown}
                  onChange={setMarkdown}
                  showAI={showAI}
                />
              )}
            </div>

            {/* Preview Panel - Fluid Transition */}
            <div className={`transition-all duration-500 ease-in-out flex flex-col ${showPreview
                ? "lg:w-1/2 opacity-100 scale-100"
                : "lg:w-0 opacity-0 scale-95 overflow-hidden h-0 lg:h-auto"
              } w-full`}>
              <div className="h-full w-full"> {/* Inner wrapper to maintain content width stability during shrink if needed, though overflow-hidden on parent handles most */}
                <MarkdownPreview
                  markdown={markdown}
                  showAI={showAI}
                  onClose={() => setShowPreview(false)}
                />
              </div>
            </div>
          </div>

          {/* AI Chat Section */}
          <AiAssistant
            showAI={showAI}
            setShowAI={setShowAI}
            messages={messages}
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}