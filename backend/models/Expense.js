const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  note: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['income', 'expense'], default: 'expense' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
