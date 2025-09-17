import { API_URL, TokenService } from "../api/auth";

export async function streamMessage(
  chatId: string,
  content: string,
  onChunk: (text: string) => void
): Promise<void> {
  const url = `${API_URL}/chat/${chatId}/messages/submit/`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${TokenService.getToken()}`
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    console.error(`Error ${response.status}: ${response.statusText}`);
    return;
  }

  if (!response.body) {
    console.error('Streaming not supported by this browser.');
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              onChunk(data.text);
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }
  } catch (err) {
    console.error('Stream error:', err);
  }
}