import PleaseSignIn from '../components/PleaseSignIn';
import CheckPermissions from '../components/CheckPermissions';
import Expenses from '../components/Expenses';

const ExpensesPage = ({ query: { id, page } }) => (
  <PleaseSignIn>
    <CheckPermissions prePage="true" id={id} permissions={['STEWARD', 'ADMIN']}>
      <Expenses id={id} page={page} />
    </CheckPermissions>
  </PleaseSignIn>
);

export default ExpensesPage;
