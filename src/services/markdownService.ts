export const markdownService = {
  async save(username: string, markdown: string) {
    const response = await fetch(`/api/markdown`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, markdown }),
    });
    
    if (!response.ok) throw new Error('Failed to save');
    return response;
  },
  
  async load(username: string) {
    const res = await fetch(`/api/markdown?username=${encodeURIComponent(username)}`);
    return res.ok ? await res.text() : null;
  },
};