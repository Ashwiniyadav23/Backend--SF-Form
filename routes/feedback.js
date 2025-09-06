import express from 'express';
const router = express.Router();
import Feedback from '../models/Feedback.js';

router.get('/', async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedback);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', async (req, res) => {
    const { name, email, course, faculty, rating, comment, feedbackDate } = req.body;

    if (!name || !email || !course || !faculty || !rating || !feedbackDate) {
        return res.status(400).json({ message: 'Please enter all required fields.' });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    try {
        const newFeedback = new Feedback({
            name,
            email,
            course,
            faculty,
            rating,
            comment,
            feedbackDate: new Date(feedbackDate)
        });

        const feedback = await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully!', feedback });
    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).send('Server Error');
    }
});

router.get('/faculty-stats', async (req, res) => {
    try {
        const stats = await Feedback.aggregate([
            {
                $group: {
                    _id: '$faculty',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        res.json(stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
export default router;
