import React from 'react';
import Expense from '../components/SingleExpense';
import PlesaseSingIn from '../components/PleaseSignIn';
import CheckPermissions from '../components/CheckPermissions';

const ExpensePage = ({ query: { id, event } }) => (
  <PlesaseSingIn>
    <CheckPermissions
      prePage="true"
      id={event}
      permissions={['STEWARD', 'ADMIN']}
    >
      <Expense id={id} event={event} />
    </CheckPermissions>
  </PlesaseSingIn>
);

export default ExpensePage;
