const Budget = require('../models/Budget');

// @desc    Get budget for a specific month and year
// @route   GET /api/budgets
// @access  Private
const getBudget = async (req, res) => {
  const { month, year } = req.query;
  
  try {
    const query = { user: req.user._id };
    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }
    
    // Get latest budget if no month/year provided
    const budgets = await Budget.find(query).sort({ year: -1, month: -1 }).limit(1);
    
    res.json(budgets[0] || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set or update budget
// @route   POST /api/budgets
// @access  Private
const setBudget = async (req, res) => {
  const { amount, month, year } = req.body;

  try {
    let budget = await Budget.findOne({ user: req.user._id, month, year });

    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = await Budget.create({
        user: req.user._id,
        amount,
        month,
        year
      });
    }

    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getBudget, setBudget };
