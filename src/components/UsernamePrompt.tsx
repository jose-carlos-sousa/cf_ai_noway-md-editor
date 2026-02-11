import React, { useState } from "react";

interface UsernamePromptProps {
  onSubmit: (username: string) => void;
}

export function UsernamePrompt({ onSubmit }: UsernamePromptProps) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username);
    } else {
      alert("Please enter a username.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-zinc-950">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl shadow-2xl border border-zinc-800 w-full max-w-md ring-1 ring-white/5"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-white">Welcome Back</h2>
          <p className="text-zinc-400 text-sm">Enter your username to access your workspace.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wide">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ex: jsmith"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-700 text-zinc-100 placeholder-zinc-600 transition-all font-mono text-sm"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg transition-colors font-semibold text-sm shadow-sm"
          >
            Continue to Editor
          </button>
        </div>
      </form>
    </div>
  );
}