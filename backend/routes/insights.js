const express = require('express');
const axios = require('axios');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');
const router = express.Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

// @route   GET /api/insights/budget-prediction
// @desc    Get AI-powered budget prediction
// @access  Private
router.get('/budget-prediction', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id })
      .sort({ date: 1 });

    if (expenses.length < 3) {
      return res.json({
        prediction: null,
        message: 'Need at least 3 expenses for prediction'
      });
    }

    // Prepare data for ML model
    const expenseData = expenses.map(exp => ({
      amount: exp.amount,
      category: exp.category,
      date: exp.date,
      month: new Date(exp.date).getMonth() + 1,
      year: new Date(exp.date).getFullYear()
    }));

    try {
      const response = await axios.post(`${AI_SERVICE_URL}/predict-budget`, {
        expenses: expenseData
      });

      res.json(response.data);
    } catch (aiError) {
      console.error('AI service error:', aiError.message);
      res.status(503).json({
        message: 'AI service unavailable',
        fallback: calculateSimplePrediction(expenses)
      });
    }
  } catch (error) {
    console.error('Budget prediction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/insights/spending-patterns
// @desc    Get spending pattern analysis using K-means clustering
// @access  Private
router.get('/spending-patterns', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id })
      .sort({ date: 1 });

    if (expenses.length < 5) {
      return res.json({
        patterns: null,
        message: 'Need at least 5 expenses for pattern analysis'
      });
    }

    const expenseData = expenses.map(exp => ({
      amount: exp.amount,
      category: exp.category,
      date: exp.date,
      month: new Date(exp.date).getMonth() + 1
    }));

    try {
      const response = await axios.post(`${AI_SERVICE_URL}/analyze-patterns`, {
        expenses: expenseData
      });

      res.json(response.data);
    } catch (aiError) {
      console.error('AI service error:', aiError.message);
      res.status(503).json({
        message: 'AI service unavailable',
        fallback: calculateSimplePatterns(expenses)
      });
    }
  } catch (error) {
    console.error('Spending patterns error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/insights/anomalies
// @desc    Detect spending anomalies
// @access  Private
router.get('/anomalies', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id })
      .sort({ date: 1 });

    if (expenses.length < 5) {
      return res.json({
        anomalies: [],
        message: 'Need at least 5 expenses for anomaly detection'
      });
    }

    const expenseData = expenses.map(exp => ({
      amount: exp.amount,
      category: exp.category,
      date: exp.date
    }));

    try {
      const response = await axios.post(`${AI_SERVICE_URL}/detect-anomalies`, {
        expenses: expenseData
      });

      res.json(response.data);
    } catch (aiError) {
      console.error('AI service error:', aiError.message);
      res.status(503).json({
        message: 'AI service unavailable',
        fallback: detectSimpleAnomalies(expenses)
      });
    }
  } catch (error) {
    console.error('Anomaly detection error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fallback functions
function calculateSimplePrediction(expenses) {
  const monthlyAvg = expenses.reduce((sum, exp) => sum + exp.amount, 0) / 
    Math.max(1, (new Date(expenses[expenses.length - 1].date) - new Date(expenses[0].date)) / (1000 * 60 * 60 * 24 * 30));
  return {
    predictedMonthlyBudget: monthlyAvg,
    confidence: 0.7,
    method: 'simple_average'
  };
}

function calculateSimplePatterns(expenses) {
  const byCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
  return {
    clusters: Object.keys(byCategory).map(cat => ({
      category: cat,
      totalAmount: byCategory[cat],
      averageAmount: byCategory[cat] / expenses.filter(e => e.category === cat).length
    })),
    method: 'simple_grouping'
  };
}

function detectSimpleAnomalies(expenses) {
  const amounts = expenses.map(e => e.amount);
  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const variance = amounts.reduce((sum, amt) => sum + Math.pow(amt - mean, 2), 0) / amounts.length;
  const stdDev = Math.sqrt(variance);
  const threshold = mean + 2 * stdDev;

  return {
    anomalies: expenses
      .map((exp, idx) => ({ expense: exp, index: idx }))
      .filter(({ expense }) => expense.amount > threshold)
      .map(({ expense, index }) => ({
        index,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        reason: `Amount exceeds mean + 2σ (${threshold.toFixed(2)})`
      })),
    method: 'statistical_threshold'
  };
}

module.exports = router;
