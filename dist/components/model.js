"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askZyllaWithAudio = askZyllaWithAudio;
exports.askZylla = askZylla;
// zylla-ai.ts
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ai = new genai_1.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
const model = 'gemini-2.5-flash';
const config = {
    temperature: 0.2,
    responseMimeType: 'text/plain',
};
// Detect whether a message contains factual data
function isFactual(text) {
    const keywords = ['fee', 'campus', 'admission', 'program', 'department', 'location', 'HOD', 'president', 'semester', 'buea', 'xaf', 'scholarship'];
    return keywords.some(kw => text.toLowerCase().includes(kw));
}
// Extract factual info from previous responses
function extractFactualContext(chatHistory) {
    return chatHistory
        .filter(msg => msg.role === 'model')
        .map(msg => msg.parts.map((p) => p.text).join('\n'))
        .filter(isFactual)
        .join('\n\n');
}
async function askZyllaWithAudio(audioBlob) {
    try {
        // 1. Upload the audio file to Gemini
        const audioFile = await ai.files.upload({
            file: audioBlob,
            config: { mimeType: "audio/webm" }, // or "audio/mpeg" depending on your recording format
        });
        // 2. Create the transcription request
        if (!audioFile.uri || !audioFile.mimeType) {
            throw new Error("Failed to upload audio file: URI or MIME type missing.");
        }
        const mimeType = audioFile.mimeType; // Ensure mimeType is treated as string
        // 2. Create the transcription request
        const transcriptionResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: (0, genai_1.createUserContent)([
                (0, genai_1.createPartFromUri)(audioFile.uri, mimeType),
                "Transcribe this audio message exactly as spoken, including filler words like 'um' and 'ah'. Only return the raw transcription without any additional commentary or formatting.",
            ])
        });
        // 3. Extract the transcription text
        const transcription = transcriptionResponse.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (!transcription) {
            throw new Error("Empty transcription response");
        }
        return transcription;
    }
    catch (error) {
        console.error("Audio transcription error:", error);
        throw new Error("Could not transcribe audio message");
    }
}
// ✅ Reusable function to get Zylla's response
async function askZylla(userQuestion, chatHistory) {
    const factualContext = extractFactualContext(chatHistory);
    const systemText = `
You are Zylla, the official Landmark student assistant (LSA) chatbot for Landmark Metropolitan University Institute (LMUI), Buea.
Help students by answering questions about:
- Tuition fees, programs, admissions, scholarships, campus life, departments, and infrastructure.
- Educational or research-related questions.

Use these facts from prior messages:

${factualContext || 'No confirmed facts yet. If unsure, refer the student to https://landmark.cm or the admissions office.'}

Always reply with a friendly tone, keep your responds short and to the point unless asked to expatiate and refer to the university as "we" or "our".
And try to decipher what the user asked and only then can you use the content related to the university, keep the conversation as humanly as possible.
`;
    const contents = [
        {
            role: 'model',
            parts: [{ text: systemText }]
        },
        ...chatHistory,
        {
            role: 'user',
            parts: [{ text: userQuestion }]
        }
    ];
    const result = await ai.models.generateContent({
        model,
        config,
        contents
    });
    // ✅ Correct way to extract text
    const candidates = result.candidates;
    const finalText = candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sorry, I had trouble generating a response.';
    return finalText;
}
