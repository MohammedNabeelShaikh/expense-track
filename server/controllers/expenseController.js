const Expense = require('../models/Expense');

// @desc    Get all expenses for a user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
  const { title, amount, category, date, note, paymentMethod } = req.body;

  try {
    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date,
      note,
      paymentMethod
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this expense' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getExpenses, createExpense, deleteExpense };
