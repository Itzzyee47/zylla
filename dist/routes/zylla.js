"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const chatHistory_1 = __importDefault(require("../chatHistory"));
const model_1 = require("../components/model");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
router.post('/text', async (req, res) => {
    const { question } = req.body;
    if (!question)
        return res.status(400).json({ error: 'Question is required' });
    try {
        const response = await (0, model_1.askZylla)(question, chatHistory_1.default);
        chatHistory_1.default.push({ role: 'user', parts: [{ text: question }] });
        chatHistory_1.default.push({ role: 'model', parts: [{ text: response }] });
        res.json({ response });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Zylla failed to respond' });
    }
});
router.post('/ask-audio', upload.single('audio'), async (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: 'Audio file is required' });
    const audioPath = path_1.default.resolve(req.file.path);
    try {
        // const transcription = await askZyllaWithAudio(audioPath);
        // fs.unlink(audioPath, () => {}); // delete file
        // res.json({ transcription });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to transcribe audio' });
    }
});
exports.default = router;
