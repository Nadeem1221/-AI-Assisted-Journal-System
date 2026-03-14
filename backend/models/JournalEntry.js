import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  ambience: {
    type: String,
    default: 'forest',
  },
  analysis: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('JournalEntry', journalEntrySchema);
