import AddAdmin from '../components/AddAdmin';
import CheckPermissions from '../components/CheckPermissions';
import PleaseSignIn from '../components/PleaseSignIn';

const AddAdminPage = ({ query }) => (
  <PleaseSignIn>
    <CheckPermissions
      id={query.id}
      permissions={['ADMIN', 'PERMISSIONUPDATE']}
      prePage="true"
    >
      <AddAdmin id={query.id} />
    </CheckPermissions>
  </PleaseSignIn>
);

export default AddAdminPage;
