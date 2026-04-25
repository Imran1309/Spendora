const express = require('express');
const { Expense } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all expenses for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Add a new expense
router.post('/', auth, async (req, res) => {
  try {
    const { amount, category, note, date, type } = req.body;

    if (!amount || !category) {
      return res.status(400).json({ message: 'Amount and category are required.' });
    }

    const newExpense = new Expense({
      amount,
      category,
      note,
      date: date || Date.now(),
      type: type || 'expense',
      userId: req.user,
    });
    
    await newExpense.save();
    res.json(newExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update an expense
router.put('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found.' });
    }

    const { amount, category, note, date, type } = req.body;
    
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (note !== undefined) expense.note = note;
    if (date !== undefined) expense.date = date;
    if (type !== undefined) expense.type = type;

    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete an expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found.' });
    }

    res.json({ message: 'Expense deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
