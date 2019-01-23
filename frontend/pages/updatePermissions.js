import UpdatePermissions from '../components/UpdatePermissions';
import PleaseSignIn from '../components/PleaseSignIn';
import CheckPermissions from '../components/CheckPermissions';

const updatePermissionsPage = ({ query }) => (
  <PleaseSignIn>
    <CheckPermissions
      id={query.id}
      permissions={['ADMIN', 'PERMISSIONUPDATE']}
      prePage="true"
    >
      <UpdatePermissions id={query.id} />
    </CheckPermissions>
  </PleaseSignIn>
);

export default updatePermissionsPage;
