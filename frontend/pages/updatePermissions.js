import UpdatePermissions from '../components/UpdatePermissions';
import PleaseSignIn from '../components/PleaseSignIn';
import CheckPermissions from '../components/CheckPermissions';

const updatePermissionsPage = ({ query }) => (
  <CheckPermissions
    id={query.id}
    permissions={['ADMIN', 'PERMISSIONUPDATE']}
    prePage="true"
  >
    <PleaseSignIn>
      <UpdatePermissions id={query.id} />
    </PleaseSignIn>
  </CheckPermissions>
);

export default updatePermissionsPage;
