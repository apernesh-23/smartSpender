import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import './Insights.css';

const Insights = () => {
  const [budgetPrediction, setBudgetPrediction] = useState(null);
  const [spendingPatterns, setSpendingPatterns] = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  const [loading, setLoading] = useState({ prediction: false, patterns: false, anomalies: false });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllInsights = async () => {
      fetchBudgetPrediction();
      fetchSpendingPatterns();
      fetchAnomalies();
    };
    fetchAllInsights();
  }, []);

  const fetchBudgetPrediction = async () => {
    setLoading(prev => ({ ...prev, prediction: true }));
    try {
      const response = await api.get('/insights/budget-prediction');
      setBudgetPrediction(response.data);
    } catch (err) {
      setError('Failed to load budget prediction');
    } finally {
      setLoading(prev => ({ ...prev, prediction: false }));
    }
  };

  const fetchSpendingPatterns = async () => {
    setLoading(prev => ({ ...prev, patterns: true }));
    try {
      const response = await api.get('/insights/spending-patterns');
      setSpendingPatterns(response.data);
    } catch (err) {
      setError('Failed to load spending patterns');
    } finally {
      setLoading(prev => ({ ...prev, patterns: false }));
    }
  };

  const fetchAnomalies = async () => {
    setLoading(prev => ({ ...prev, anomalies: true }));
    try {
      const response = await api.get('/insights/anomalies');
      setAnomalies(response.data);
    } catch (err) {
      setError('Failed to load anomalies');
    } finally {
      setLoading(prev => ({ ...prev, anomalies: false }));
    }
  };

  return (
    <div className="container">
      <h1>AI-Powered Insights</h1>
      {error && <div className="error">{error}</div>}

      <div className="insights-grid">
        <div className="card insight-card">
          <h2>📊 Budget Prediction</h2>
          {loading.prediction ? (
            <p>Loading prediction...</p>
          ) : budgetPrediction?.prediction ? (
            <div>
              <div className="prediction-value">
                ${budgetPrediction.prediction.predictedMonthlyBudget?.toFixed(2) || 'N/A'}
              </div>
              <p className="prediction-label">Predicted Monthly Budget</p>
              {budgetPrediction.prediction.confidence && (
                <p className="confidence">
                  Confidence: {(budgetPrediction.prediction.confidence * 100).toFixed(0)}%
                </p>
              )}
            </div>
          ) : (
            <p>{budgetPrediction?.message || 'Not enough data for prediction'}</p>
          )}
        </div>

        <div className="card insight-card">
          <h2>🔍 Spending Patterns</h2>
          {loading.patterns ? (
            <p>Analyzing patterns...</p>
          ) : spendingPatterns?.clusters ? (
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={spendingPatterns.clusters}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="averageAmount" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p>{spendingPatterns?.message || 'Not enough data for pattern analysis'}</p>
          )}
        </div>

        <div className="card insight-card">
          <h2>⚠️ Anomaly Detection</h2>
          {loading.anomalies ? (
            <p>Detecting anomalies...</p>
          ) : anomalies?.anomalies && anomalies.anomalies.length > 0 ? (
            <div className="anomalies-list">
              <p className="anomalies-count">{anomalies.anomalies.length} anomaly(ies) detected</p>
              <ul>
                {anomalies.anomalies.slice(0, 5).map((anomaly, idx) => (
                  <li key={idx}>
                    <strong>${anomaly.amount?.toFixed(2)}</strong> - {anomaly.category}
                    {anomaly.reason && <span className="reason"> ({anomaly.reason})</span>}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="no-anomalies">✅ No anomalies detected. Your spending looks normal!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Insights;
