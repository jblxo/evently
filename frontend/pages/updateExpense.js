import PleaseSignIn from '../components/PleaseSignIn';
import CheckPermissions from '../components/CheckPermissions';
import UpdateExpense from '../components/UpdateExpense';

const UpdateExpensePage = ({ query: { id, event } }) => (
  <PleaseSignIn>
    <CheckPermissions
      prePage="true"
      id={event}
      permissions={['STEWARD', 'ADMIN']}
    >
      <UpdateExpense id={id} event={event} />
    </CheckPermissions>
  </PleaseSignIn>
);

export default UpdateExpensePage;
