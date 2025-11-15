import { GoogleGenAI, Type } from "@google/genai";
import type { GenerationOptions, HashtagOptions, Caption, Hashtag } from '../types';

// FIX: Initialize GoogleGenAI client according to guidelines.
// The API key must be obtained exclusively from `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const captionSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      text: {
        type: Type.STRING,
        description: 'The generated caption text.',
      },
    },
    required: ['text'],
  },
};

const hashtagSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            tag: {
                type: Type.STRING,
                description: "The generated hashtag, without the '#' symbol.",
            },
            score: {
                type: Type.NUMBER,
                description: 'A relevance score from 0 to 100.',
            },
            rationale: {
                type: Type.STRING,
                description: 'A brief explanation for why this hashtag was chosen.',
            }
        },
        required: ['tag', 'score', 'rationale'],
    }
};

export const generateCaptionsFromGemini = async (options: GenerationOptions): Promise<Caption[]> => {
  const { topic, platform, tone, length, settings } = options;

  const systemInstruction = `You are CaptionChef. Write 3 short, punchy captions for creators. Return a JSON array of 3 captions, each being an object with a "text" property. No hashtags. Respect voice keywords and banned words. Keep text concise.`;

  const userPrompt = `Topic: ${topic}\nPlatform: ${platform}\nTone: ${tone}\nLength: ${length}\nVoice Keywords: ${settings.voiceKeywords}\nBanned Words: ${settings.bannedWords}\nReturn JSON only.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: userPrompt }] },
      config: {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        responseMimeType: 'application/json',
        responseSchema: captionSchema,
        temperature: 0.8,
        topP: 0.9,
      }
    });
    
    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);
    return parsed as Caption[];

  } catch (error) {
    console.error("Error generating captions:", error);
    throw new Error("Failed to generate captions. Please check your API key and try again.");
  }
};

export const generateHashtagsFromGemini = async (options: HashtagOptions): Promise<Hashtag[]> => {
    const { caption, niche } = options;

    const systemInstruction = `You are TagMaster. Generate 15 relevant, non-spammy hashtags. Return a JSON array of objects: {tag, score, rationale}.`;
    const userPrompt = `Caption: ${caption}\nNiche: ${niche}\nReturn 15 hashtags in JSON only.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: userPrompt }] },
            config: {
                systemInstruction: { parts: [{ text: systemInstruction }] },
                responseMimeType: 'application/json',
                responseSchema: hashtagSchema,
                temperature: 0.7,
            }
        });

        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString);
        return parsed as Hashtag[];

    } catch (error) {
        console.error("Error generating hashtags:", error);
        throw new Error("Failed to generate hashtags. Please check your API key and try again.");
    }
};