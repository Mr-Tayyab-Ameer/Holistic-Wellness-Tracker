import express from 'express'; 
import { getEmotionTips } from '../controllers/emotion.controller.js';
import auth from '../middelwares/user.auth.js';
import EmotionTip from '../models/emotionTip.model.js';

const router = express.Router();

// POST: Process emotion and get tips from Flask
router.post('/', auth, getEmotionTips);

// ✅ NEW: Save tips to database
router.post('/save', auth, async (req, res) => {
  try {
    const { emotion, tips } = req.body;

    if (!emotion || !Array.isArray(tips)) {
      return res.status(400).json({ error: 'Emotion and tips are required' });
    }

    const savedTips = await Promise.all(
      tips.map((tip) =>
        EmotionTip.create({
          userId: req.user.id,
          emotion,
          title: tip.title,
          link: tip.link,
          description: tip.description,
        })
      )
    );

    res.status(201).json({ message: 'Tips saved successfully', tips: savedTips });
  } catch (error) {
    console.error('Save error:', error.message);
    res.status(500).json({ error: 'Failed to save tips' });
  }
});

// ✅ NEW: Get all saved emotion tips for the logged-in user
router.get('/saved', auth, async (req, res) => {
  try {
    const tips = await EmotionTip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch saved emotion tips' });
  }
});

// ✅ NEW: Delete a specific tip by its ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const tip = await EmotionTip.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!tip) {
      return res.status(404).json({ error: 'Tip not found or unauthorized' });
    }

    res.status(200).json({ message: 'Tip deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete tip' });
  }
});

export default router;
