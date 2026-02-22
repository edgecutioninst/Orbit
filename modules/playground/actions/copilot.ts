"use server";

import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function getInlineCompletion(codeBeforeCursor: string, language: string) {
    if (!codeBeforeCursor || codeBeforeCursor.trim() === "") {
        return { completion: "" };
    }

    try {
        const { text } = await generateText({
            model: groq("llama-3.1-8b-instant"),
            system: `You are an expert ${language} coding assistant acting as an inline autocomplete (like GitHub Copilot). 
            The user will provide the code up to their cursor. 
            You must predict and provide ONLY the exact next logical characters or lines of code. 
            CRITICAL RULES:
            - DO NOT wrap the code in markdown blocks (like \`\`\`cpp).
            - DO NOT provide any conversational text, explanations, or greetings.
            - Just output the raw code completion. Nothing else.`,
            prompt: codeBeforeCursor.slice(-1500),
            temperature: 0.2,
        });

        return { completion: text };
    } catch (error) {
        console.error("Copilot AI Error:", error);
        return { completion: "" };
    }
}