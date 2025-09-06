import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import feedbackRoutes from './routes/feedback.js'; 

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json()); 
app.use('/api/feedback', feedbackRoutes);

app.get('/', (_, res) => {
    res.send('Feedback API is running!');
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});