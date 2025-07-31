import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import chatHistory from '../chatHistory';
import { askZylla, askZyllaWithAudio } from '../components/model';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/text', async (req: Request, res: Response) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required' });

  try {
    const response = await askZylla(question, chatHistory);
    chatHistory.push({ role: 'user', parts: [{ text: question }] });
    chatHistory.push({ role: 'model', parts: [{ text: response }] });
    res.json({ response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Zylla failed to respond' });
  }
});

router.post('/ask-audio', upload.single('audio'), async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'Audio file is required' });

  const audioPath = path.resolve(req.file.path);

  try {
    // const transcription = await askZyllaWithAudio(audioPath);
    // fs.unlink(audioPath, () => {}); // delete file
    // res.json({ transcription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

export default router;
