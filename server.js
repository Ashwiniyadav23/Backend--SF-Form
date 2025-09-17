import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable.');
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const allowedOrigins = [
    'http://localhost:5173',
    'https://student-feedback-manager-hp.vercel.app'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed'));
        }
    }
}));

app.use(express.json());

// Routes
import feedbackRoutes from './routes/feedback.js';
app.use('/api/feedback', feedbackRoutes);

app.get('/', (_, res) => {
    res.send('Feedback API is running!');
});

app.use('/', (req, res) => {
    res.send('Feedback API is working!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
