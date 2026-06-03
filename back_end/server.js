import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are a creative, practical chef. Given a list of ingredients, suggest exactly 3 recipes the user can make RIGHT NOW with what they have.

Rules:
- Only use ingredients the user has (minor pantry staples like salt, oil, water are allowed)
- Be specific and realistic — no "go buy X" suggestions
- Keep steps clear and concise

Respond ONLY with valid JSON in this exact format:
{
  "recipes": [
    {
      "title": "Recipe Name",
      "description": "One sentence about the dish",
      "time": "20 mins",
      "difficulty": "Easy",
      "ingredientsUsed": ["ingredient1", "ingredient2"],
      "steps": ["Step 1 description", "Step 2 description", "Step 3 description"]
    }
  ]
}`;

app.post('/api/recipes', upload.single('image'), async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients) {
      return res.status(400).json({ error: 'Please provide ingredients.' });
    }

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `I have these ingredients: ${ingredients}. What 3 recipes can I make?` },
      ],
    });

    const data = JSON.parse(response.choices[0].message.content);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Something went wrong.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
