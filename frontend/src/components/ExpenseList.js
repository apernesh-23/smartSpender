import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { format } from 'date-fns';
import './ExpenseList.css';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses');
      setExpenses(response.data);
    } catch (err) {
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter(exp => exp._id !== id));
    } catch (err) {
      alert('Failed to delete expense');
    }
  };

  if (loading) return <div className="container">Loading expenses...</div>;
  if (error) return <div className="container error">{error}</div>;

  return (
    <div className="container">
      <div className="card">
        <h2>Your Expenses</h2>
        {expenses.length === 0 ? (
          <p>No expenses yet. Add your first expense above!</p>
        ) : (
          <div className="expense-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(expense => (
                  <tr key={expense._id}>
                    <td>{format(new Date(expense.date), 'MMM dd, yyyy')}</td>
                    <td>
                      <span className={`category-badge category-${expense.category.toLowerCase()}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td>{expense.description || '-'}</td>
                    <td className="amount">${expense.amount.toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
