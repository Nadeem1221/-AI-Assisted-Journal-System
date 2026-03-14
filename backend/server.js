import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import journalRoutes from './routes/journalRoutes.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Rate Limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { error: 'Too many requests, please try again after a minute.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Middleware
app.use(limiter);
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/journal', journalRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
