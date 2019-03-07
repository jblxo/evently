import React from 'react';
import moment from 'moment';
import ExpenseStyles from './styles/Expense';
import formatMoney from '../lib/formatMoney';

const Expense = ({ expense }) => {
  return (
    <ExpenseStyles>
      <div>
        <h3>{expense.title}</h3>
        <p>{expense.description}</p>
      </div>
      <div>
        <p>{formatMoney(expense.amount)}</p>
        <p>
          {moment(expense.createdAt)
            .utc()
            .format('DD.MM.YYYY')}
        </p>
      </div>
    </ExpenseStyles>
  );
};

export default Expense;
