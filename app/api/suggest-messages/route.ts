import { streamText } from 'ai';
import { groq } from '@/lib/groq';

export async function POST() {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform. Avoid personal or sensitive topics and focus on universal, friendly themes. Example format: 'What’s a hobby you’ve recently started?||If you could visit any place in the world, where would you go?||What’s a small thing that makes your day better?' please generate only question not even your here is your questions and all I just want three questions i above specified styling";

    const result = streamText({
      model: groq('llama-3.1-8b-instant'),
      prompt,
      // temperature: 0.8,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Groq AI error:', error);
    throw error;
  }
}


// code for frontend ui as open ai key are paid we will use groq for free
/*
'use client';

import { useChat } from 'ai/react';

export default function Page() {
  const { messages, handleSubmit, input, handleInputChange } =
    useChat({
      api: '/api/ai',
    });

  return (
    <main style={{ padding: 20 }}>
      <form onSubmit={handleSubmit}>
        <button type="submit">Generate Questions</button>
      </form>

      <div style={{ marginTop: 20 }}>
        {messages.map((m) => (
          <div key={m.id}>
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>
    </main>
  );
}

*/