const express = require('express');
const router = express.Router();
const Category = require('../model/categorySchema'); // Adjust the path as necessary

// Route to get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
});

// Route to create a new category
router.post('/categories', async (req, res) => {
  const { name } = req.body;
  try {
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({ name });
    await category.save();
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
});

// Optional: Route to delete a category
router.delete('/categories/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
});

module.exports = router;
