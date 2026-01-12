import React, { useState } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';

const ExpensesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleExpenseAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <ExpenseForm onExpenseAdded={handleExpenseAdded} />
      <ExpenseList key={refreshKey} />
    </>
  );
};

export default ExpensesPage;
