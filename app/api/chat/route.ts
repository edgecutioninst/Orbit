import { streamText, convertToModelMessages } from "ai";
import { groq } from '@ai-sdk/groq';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, code, language } = await req.json();

    const dynamicSystemPrompt = `
    You are a helpful, expert coding assistant built directly into an IDE. 
    Help the user understand their code, find bugs, or write new features. Be concise and format your code blocks clearly.
    
    Here is the ${language} code currently open in the user's editor:
    \`\`\`${language}
    ${code}
    \`\`\`
    `;

    const result = streamText({
        model: groq('llama-3.3-70b-versatile'),
        system: dynamicSystemPrompt,
        messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
}