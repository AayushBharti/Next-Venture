import {
  GoogleGenerativeAI,
  type Schema,
  SchemaType,
} from "@google/generative-ai";
import { env } from "@workspace/env/server";
import { Logger } from "@workspace/logger";
import { z } from "zod/v4";

const logger = new Logger("gemini");

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

/** Zod schema to validate Gemini's JSON response. */
const geminiResponseSchema = z.object({
  clarity: z.object({
    score: z.number().int().min(0).max(100),
    feedback: z.string().min(1).max(1000),
  }),
  marketPositioning: z.object({
    score: z.number().int().min(0).max(100),
    feedback: z.string().min(1).max(1000),
  }),
  uniqueness: z.object({
    score: z.number().int().min(0).max(100),
    feedback: z.string().min(1).max(1000),
  }),
  suggestions: z.array(z.string().min(1).max(800)).min(2).max(3),
});

/** The structured schema for Gemini's responseSchema config. */
const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    clarity: {
      type: SchemaType.OBJECT,
      properties: {
        score: { type: SchemaType.INTEGER },
        feedback: { type: SchemaType.STRING },
      },
      required: ["score", "feedback"],
    },
    marketPositioning: {
      type: SchemaType.OBJECT,
      properties: {
        score: { type: SchemaType.INTEGER },
        feedback: { type: SchemaType.STRING },
      },
      required: ["score", "feedback"],
    },
    uniqueness: {
      type: SchemaType.OBJECT,
      properties: {
        score: { type: SchemaType.INTEGER },
        feedback: { type: SchemaType.STRING },
      },
      required: ["score", "feedback"],
    },
    suggestions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
  },
  required: ["clarity", "marketPositioning", "uniqueness", "suggestions"],
};

const SYSTEM_PROMPT = `You are a startup pitch analyst. Evaluate the following startup pitch on three dimensions. Be honest, constructive, and specific.

Scoring rubric (0-100 for each):

**Clarity**: How well does the pitch communicate the problem, solution, and value proposition? Is it easy to understand? Free of jargon? A score of 80+ means crystal clear to any reader. Below 40 means confusing or vague.

**Market Positioning**: How well does it articulate the target market, problem severity, and competitive landscape? 80+ means compelling market thesis. Below 40 means no clear market understanding.

**Uniqueness**: How differentiated is this from existing solutions? Does it have a clear moat or novel approach? 80+ means truly novel. Below 40 means indistinguishable from competitors.

**Suggestions**: Provide exactly 2-3 specific, actionable improvements. Be constructive, not generic. Reference specific parts of the pitch.`;

interface PitchInput {
  title: string;
  description: string;
  category: string;
  pitch: string;
}

interface AnalysisResult {
  overallScore: number;
  clarity: { score: number; feedback: string };
  marketPositioning: { score: number; feedback: string };
  uniqueness: { score: number; feedback: string };
  suggestions: string[];
  analyzedAt: string;
}

/**
 * Analyze a startup pitch using Gemini 2.0 Flash.
 * Returns structured analysis or null on any failure.
 */
export async function analyzePitch(
  input: PitchInput
): Promise<AnalysisResult | null> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema,
      },
      systemInstruction: SYSTEM_PROMPT,
    });

    const truncatedPitch = input.pitch.slice(0, 5000);

    const prompt = `Analyze this startup pitch:

**Title:** ${input.title}
**Category:** ${input.category}
**Description:** ${input.description}

**Full Pitch:**
${truncatedPitch}`;

    const result = await model.generateContent(
      { contents: [{ role: "user", parts: [{ text: prompt }] }] },
      { timeout: 10_000 }
    );

    const text = result.response.text();
    const raw: unknown = JSON.parse(text);
    const parsed = geminiResponseSchema.parse(raw);

    const overallScore = Math.round(
      parsed.clarity.score * 0.35 +
        parsed.marketPositioning.score * 0.35 +
        parsed.uniqueness.score * 0.3
    );

    return {
      overallScore,
      clarity: parsed.clarity,
      marketPositioning: parsed.marketPositioning,
      uniqueness: parsed.uniqueness,
      suggestions: parsed.suggestions,
      analyzedAt: new Date().toISOString(),
    };
  } catch (error) {
    logger.error("Pitch analysis failed", { error });
    return null;
  }
}
