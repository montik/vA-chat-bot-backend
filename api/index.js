import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors({
  origin: 'http://localhost',
  allowedHeaders: ['Content-Type']
}));

// Middleware to parse JSON
app.use(express.json());

// ChatGPT API endpoint
app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  try {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user",
                content: prompt,
            },
        ],
        store: true,
    });

    res.json({ reply: "Test " + completion.choices[0].message.content });
  } catch (error) {
    console.error("Error communicating with ChatGPT API:", error);
    // res.status(500).send("Error communicating with ChatGPT API");
    res.json({ reply: `Error! ${error}`})
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});