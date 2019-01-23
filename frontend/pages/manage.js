import PleaseSignIn from '../components/PleaseSignIn';
import CheckPermissions from '../components/CheckPermissions';
import Manage from '../components/Manage';

const ManagePage = ({ query: { id } }) => (
  <PleaseSignIn>
    <CheckPermissions prePage="true" id={id} permissions={['STEWARD', 'ADMIN']}>
      <Manage id={id} />
    </CheckPermissions>
  </PleaseSignIn>
);

export default ManagePage;
