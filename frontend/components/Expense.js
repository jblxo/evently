import React from 'react';
import moment from 'moment';
import Link from 'next/link';
import ExpenseStyles from './styles/Expense';
import formatMoney from '../lib/formatMoney';

const Expense = ({ expense }) => {
  return (
    <Link
      href={{
        pathname: '/expense',
        query: { id: expense.id, event: expense.event.id }
      }}
    >
      <a>
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
            <p>
              {expense.user.username} ({expense.user.firstName}{' '}
              {expense.user.lastName})
            </p>
          </div>
        </ExpenseStyles>
      </a>
    </Link>
  );
};

export default Expense;
