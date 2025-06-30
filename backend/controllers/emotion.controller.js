import axios from 'axios';
import EmotionTip from '../models/emotionTip.model.js';

// Get emotion and tips from Flask API
export const getEmotionTips = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }

    const flaskResponse = await axios.post('http://127.0.0.1:3000/process', {
      input,
    });

    const { emotion, tips } = flaskResponse.data;
    console.log('Flask response:', flaskResponse.data);

    res.status(200).json({ emotion, tips });
  } catch (error) {
    console.error('Error fetching from Flask:', error.message);
    if (error.response) {
      console.error('Flask error response:', error.response.data);
    }
    res.status(500).json({
      error: 'Failed to get recommendations from emotion service',
    });
  }
};

// Save each emotion tip as an individual document
export const saveEmotionTips = async (req, res) => {
  try {
    const { emotion, tips } = req.body;

    if (!emotion || !Array.isArray(tips)) {
      return res.status(400).json({ message: 'Emotion and tips are required' });
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
    console.error('Error saving emotion tips:', error);
    res.status(500).json({ message: 'Failed to save emotion tips' });
  }
};

// Get all saved emotion tips for the user
export const getSavedEmotionTips = async (req, res) => {
  try {
    const tips = await EmotionTip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tips);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tips' });
  }
};

// Delete a tip by its ID
export const deleteEmotionTip = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await EmotionTip.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Tip not found or unauthorized' });
    }

    res.status(200).json({ message: 'Tip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete tip' });
  }
};
