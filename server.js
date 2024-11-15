import express, { json } from 'express';
import { Schema, model, connect } from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = 5000; 
const MONGO_URI = process.env.MONGO_URI; 

app.use(cors());
app.use(json());


const feedbackSchema = new Schema({
  name: { type: String, required: true },
  mail: { type: String, required: true },
  feedback: { type: String, required: true },
});

const Feedback = model('Feedback', feedbackSchema);


connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

app.get('/students', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedbacks' });
  }
});


app.post('/students', async (req, res) => {
  const { name, mail, feedback } = req.body;
  try {
    const newFeedback = new Feedback({ name, mail, feedback });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ message: 'Error creating feedback' });
  }
});


app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name, mail, feedback } = req.body;
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { name, mail, feedback },
      { new: true }
    );
    if (!updatedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ message: 'Error updating feedback' });
  }
});


app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(id);
    if (!deletedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json({ message: 'Feedback deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting feedback' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
