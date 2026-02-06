"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import { extractMarkdown, extractExplanation } from "../../utils/markdownUtils";

const defaultResume = `# My tasks
- Go to the Gym
- Buy bread
- Help John with homework
`;

const WORKER_URL = "https://my-llama-xd.2409jmsousa.workers.dev";

export default function Home() {
	const [markdown, setMarkdown] = useState(defaultResume);
	const [showPreview, setShowPreview] = useState(true);
	const [showAI, setShowAI] = useState(true);
	const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [pendingMarkdown, setPendingMarkdown] = useState<string | null>(null);
	const [showReview, setShowReview] = useState(false);
	const [diffLines, setDiffLines] = useState<Array<{ type: "added" | "removed" | "unchanged"; content: string }>>([]);

	const extractExplanation = (text: string): string => {
		// Always return the text after the markdown block
		const match = text.match(/```markdown\n([\s\S]*?)```/);
		if (match) {
			return text.slice(match.index + match[0].length).trim();
		}
		const openBlock = text.match(/```markdown\n([\s\S]*)/);
		if (openBlock) {
			return text.slice(openBlock.index + openBlock[0].length).trim();
		}
		return "";
	};

	const handleSendMessage = async () => {
		if (!input.trim() || isLoading) return;

		setInput("");
		setMessages((prev) => [...prev, { role: "user", content: input }]);
		setIsLoading(true);

		try {
			const response = await fetch(WORKER_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					markdown,
					userMessage: input,
					chatHistory: messages,
				}),
			});
			const data = await response.json();
			const aiMessage = data.message;
			console.log("AI response:", aiMessage); // Debug output
			const newMarkdown = extractMarkdown(aiMessage);
			const explanation = extractExplanation(aiMessage);
			setMessages((prev) => [...prev, { role: "assistant", content: explanation }]);
			if (newMarkdown) {
				const diff = diffLinesLCS(normalizeMarkdown(markdown), normalizeMarkdown(newMarkdown));
				setPendingMarkdown(newMarkdown);
				setShowReview(true);
				setDiffLines(diff);
			}
		} catch (error) {
			setMessages((prev) => [
				...prev,
				{ role: "assistant", content: "Error connecting to AI. Please try again." },
			]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				<header className="mb-8 flex items-center justify-between">
					<div>
						<h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
							Markdown Editor
						</h1>
						<p className="text-slate-600 dark:text-slate-400">
							Edit your markdown documents easily
						</p>
					</div>
					<div className="flex items-center gap-3">
						<button
							onClick={() => setShowPreview(!showPreview)}
							className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${
								showPreview
									? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
									: "bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-white"
							}`}
							title={showPreview ? "Hide Preview" : "Show Preview"}
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
							</svg>
							{showPreview ? "Preview" : "Preview"}
						</button>
						<button
							onClick={exportMarkdown}
							className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
						>
							Export
						</button>
					</div>
				</header>

				{/* AI Edit Review Panel */}
				{showReview && pendingMarkdown && (
					<div className="mb-6">
						<div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-lg shadow-lg overflow-hidden">
							<div className="px-4 py-3 border-b border-yellow-200 dark:border-yellow-700 flex items-center justify-between">
								<h2 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">AI Proposed Changes</h2>
								<button
									onClick={() => { setShowReview(false); setPendingMarkdown(null); setDiffLines([]); }}
									className="text-yellow-500 hover:text-yellow-700 transition-colors"
									title="Dismiss review"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
							<div className="flex-1 overflow-auto p-8">
								{diffLines.length === 0 || diffLines.every(l => l.type === "unchanged") ? (
									<div className="text-yellow-900 dark:text-yellow-100 text-sm font-mono bg-yellow-100 dark:bg-yellow-800 rounded p-4">
										No changes detected.
									</div>
								) : (
									<pre className="text-sm font-mono bg-yellow-100 dark:bg-yellow-800 rounded p-4 overflow-x-auto">
										{diffLines.map((line, idx) => {
											if (line.type === "added") {
												return <div key={idx} className="text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900">+ {line.content}</div>;
											} else if (line.type === "removed") {
												return <div key={idx} className="text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900">- {line.content}</div>;
											} else {
												return <div key={idx} className="text-yellow-900 dark:text-yellow-100">  {line.content}</div>;
											}
										})}
									</pre>
								)}
							</div>
							<div className="border-t border-yellow-200 dark:border-yellow-700 p-4 flex gap-2 justify-end">
								<button
									onClick={() => {
										setMarkdown(pendingMarkdown);
										setShowReview(false);
										setPendingMarkdown(null);
										setDiffLines([]);
									}}
									className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
								>
									Accept Changes
								</button>
								<button
									onClick={() => {
										setShowReview(false);
										setPendingMarkdown(null);
										setDiffLines([]);
									}}
									className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
								>
									Deny Changes
								</button>
							</div>
						</div>
					</div>
				)}

				<div className={`grid gap-6 ${showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"} mb-6`}>
					{/* Editor Panel */}
					<div className="flex flex-col">
						<div className={`bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col ${showAI ? "h-[calc(50vh-80px)]" : "h-[calc(90vh-100px)]"}`}>
							<div className="bg-slate-800 dark:bg-slate-700 px-4 py-3 border-b border-slate-700">
								<h2 className="text-sm font-semibold text-white">Markdown Editor</h2>
							</div>
							<textarea
								value={markdown}
								onChange={(e) => setMarkdown(e.target.value)}
								className="flex-1 p-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
								placeholder="Write your resume in Markdown..."
							/>
						</div>
					</div>

					{/* Preview Panel */}
					{showPreview && (
						<div className="flex flex-col">
							<div className={`bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col ${showAI ? "h-[calc(50vh-80px)]" : "h-[calc(90vh-100px)]"}`}>
								<div className="bg-slate-800 dark:bg-slate-700 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
									<h2 className="text-sm font-semibold text-white">Preview</h2>
									<button
										onClick={() => setShowPreview(false)}
										className="text-slate-400 hover:text-white transition-colors"
										title="Hide preview"
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>
								<div className="flex-1 overflow-auto p-8">
									<Markdown
										components={{
											h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100" {...props} />,
											h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-2 text-gray-900 dark:text-gray-100" {...props} />,
											h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-4 mb-1 text-gray-900 dark:text-gray-100" {...props} />,
											p: ({ node, ...props }) => <p className="my-2 text-gray-800 dark:text-gray-200" {...props} />,
											strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900 dark:text-white" {...props} />,
											em: ({ node, ...props }) => <em className="italic" {...props} />,
											ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-2" {...props} />,
											ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-2" {...props} />,
											li: ({ node, ...props }) => <li className="my-1" {...props} />,
											hr: ({ node, ...props }) => <hr className="my-6 border-gray-300 dark:border-gray-600" {...props} />,
											code: ({ node, ...props }) => <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props} />,
										}}
									>
										{markdown}
									</Markdown>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* AI Chat Section */}
				{showAI ? (
					<div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
						<div className="bg-slate-800 dark:bg-slate-700 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
							<h2 className="text-sm font-semibold text-white">AI Assistant</h2>
							<button
								onClick={() => setShowAI(false)}
								className="text-slate-400 hover:text-white transition-colors"
								title="Hide AI Assistant"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						{/* Messages */}
						<div className="h-[calc(40vh-140px)] overflow-auto p-4 space-y-3">
							{messages.length === 0 ? (
								<p className="text-slate-500 dark:text-slate-400 text-center py-8">
									Ask the AI to help edit your resume... Try "Make my summary more professional"
								</p>
							) : (
								messages.map((msg, idx) => (
									<div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
										<div
											className={`max-w-[80%] rounded-lg px-4 py-2 ${
												msg.role === "user"
													? "bg-blue-600 text-white"
													: "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
											}`}
										>
											{msg.content}
										</div>
									</div>
								))
							)}
							{isLoading && (
								<div className="flex justify-start">
									<div className="bg-slate-200 dark:bg-slate-700 rounded-lg px-4 py-2 text-slate-500 dark:text-slate-400">
										Thinking...
									</div>
								</div>
							)}
						</div>

						{/* Input */}
						<div className="border-t border-slate-200 dark:border-slate-700 p-4">
							<div className="flex gap-2">
								<input
									type="text"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
									placeholder="Ask AI to help with your resume..."
									disabled={isLoading}
									className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 disabled:opacity-50"
								/>
								<button
									onClick={handleSendMessage}
									disabled={isLoading}
									className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
								>
									{isLoading ? "..." : "Send"}
								</button>
							</div>
						</div>
					</div>
				) : (
					<div className="flex items-center justify-center">
						<button
							onClick={() => setShowAI(true)}
							className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
						>
							Show AI Assistant
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
