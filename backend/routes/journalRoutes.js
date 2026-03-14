import express from 'express';
import JournalEntry from '../models/JournalEntry.js';
import Groq from 'groq-sdk';
const router = express.Router();
let groq;
router.post('/analyze', async (req, res) => {
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
    return res.status(500).json({ error: 'Please update your .env file with a valid GROQ_API_KEY' });
  }
  
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }

  try {
    const existing = await JournalEntry.findOne({ text });
    if (existing && existing.analysis) {
      return res.json(existing.analysis);
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an AI emotion analyzer. Analyze the provided text and strictly return a JSON object with three keys: "emotion" (a single string representing the primary emotion context), "keywords" (an array of upto 3 strings), and "summary" (a single descriptive sentence).',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const aiResponse = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
    res.json(aiResponse);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to analyze text' });
  }
});
router.get('/insights/:userId', async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.params.userId }).sort({ createdAt: -1 });

    const emotionCounts = {};
    const ambienceCounts = {};
    const recentKeywordsSet = new Set();
    
    entries.forEach((entry, index) => {
      const emotion = entry.analysis?.emotion;
      if (emotion) {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      }
      
      const ambience = entry.ambience;
      if (ambience) {
        ambienceCounts[ambience] = (ambienceCounts[ambience] || 0) + 1;
      }
      
      if (index < 5 && entry.analysis?.keywords) {
        entry.analysis.keywords.forEach(kw => {
          if (kw) recentKeywordsSet.add(kw.toLowerCase());
        });
      }
    });

    const topEmotion = Object.keys(emotionCounts).reduce((a, b) => emotionCounts[a] > emotionCounts[b] ? a : b, null);
    const mostUsedAmbience = Object.keys(ambienceCounts).reduce((a, b) => ambienceCounts[a] > ambienceCounts[b] ? a : b, null);

    res.json({
      totalEntries: entries.length,
      topEmotion: topEmotion || 'none',
      mostUsedAmbience: mostUsedAmbience || 'none',
      recentKeywords: Array.from(recentKeywordsSet).slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/:userId', async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId = '123', text, ambience, analysis } = req.body;
    const newEntry = new JournalEntry({ userId, text, ambience, analysis });
    const savedEntry = await newEntry.save();
    res.json(savedEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
