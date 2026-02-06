"use client";

import { useState } from "react";
import Markdown from "react-markdown";

const defaultResume = `# Your Name

**Email:** your.email@example.com | **Phone:** (123) 456-7890 | **LinkedIn:** linkedin.com/in/yourprofile

---

## Summary

Write a brief professional summary here...

---

## Experience

### Job Title | Company Name
*Month Year - Present*

- Achievement or responsibility
- Another achievement
- Key project or initiative

### Previous Job Title | Previous Company
*Month Year - Month Year*

- Achievement or responsibility
- Another achievement

---

## Education

### Degree Name | University Name
*Graduation Year*

- GPA: 3.X/4.0
- Relevant coursework

---

## Skills

**Technical:** Skill 1, Skill 2, Skill 3
**Languages:** Language 1, Language 2
`;

export default function Home() {
	const [markdown, setMarkdown] = useState(defaultResume);
	const [showPreview, setShowPreview] = useState(true);
	const [showAI, setShowAI] = useState(true);
	const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
	const [input, setInput] = useState("");

	const exportMarkdown = () => {
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

	const handleSendMessage = () => {
		if (!input.trim()) return;

		setMessages([...messages, { role: "user", content: input }]);

		setTimeout(() => {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: "AI integration coming soon! I will help you edit your resume.",
				},
			]);
		}, 500);

		setInput("");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				<header className="mb-8 flex items-center justify-between">
					<div>
						<h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
							Resume Editor
						</h1>
						<p className="text-slate-600 dark:text-slate-400">
							Edit your resume in Markdown format
						</p>
					</div>
					<button
						onClick={exportMarkdown}
						className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
					>
						Export
					</button>
				</header>

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
					{showPreview ? (
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
					) : (
						<div className="flex items-center justify-center">
							<button
								onClick={() => setShowPreview(true)}
								className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
							>
								Show Preview
							</button>
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
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</button>
						</div>

						{/* Messages */}
						<div className="h-[calc(40vh-140px)] overflow-auto p-4 space-y-3">
							{messages.length === 0 ? (
								<p className="text-slate-500 dark:text-slate-400 text-center py-8">
									Start chatting with the AI to get help editing your resume...
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
									className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
								/>
								<button
									onClick={handleSendMessage}
									className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
								>
									Send
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
