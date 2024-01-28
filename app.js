require('dotenv').config();
const express = require('express');
const app = express();

const mongoose = require('mongoose');

const Comment = require('./models/Comment.js');

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/comments', async (req, res) => {
  try {
    const allComments = await Comment.find();
    res.status(200).json(allComments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/comment', async (req, res) => {
  try {
    const { name, comment } = req.body;
    const newComment = new Comment({ name, comment });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/comment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, comment } = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { name, comment },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/comment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment successfully deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
