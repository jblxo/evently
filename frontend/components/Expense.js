import React from 'react';
import ExpenseStyles from './styles/Expense';
import formatMoney from '../lib/formatMoney';

const Expense = ({ expense }) => {
  return (
    <ExpenseStyles>
      <div>
        <h3>{expense.title}</h3>
        <p>{expense.description}</p>
      </div>

      <p>{formatMoney(expense.amount)}</p>
    </ExpenseStyles>
  );
};

export default Expense;
