import PleaseSignIn from '../components/PleaseSignIn';
import CheckPermissions from '../components/CheckPermissions';
import Expenses from '../components/Expenses';

const ExpensesPage = ({ query: { id } }) => (
  <PleaseSignIn>
    <CheckPermissions prePage="true" id={id} permissions={['STEWARD', 'ADMIN']}>
      <Expenses id={id} />
    </CheckPermissions>
  </PleaseSignIn>
);

export default ExpensesPage;
