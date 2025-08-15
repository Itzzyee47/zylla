import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/zylla';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json()); 

app.use('/askZylla', router);

app.get('/', (_req, res) => res.send('Zylla AI (TS + @google/genai) running!'));

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
