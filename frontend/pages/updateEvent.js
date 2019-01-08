import UpdateEvent from '../components/UpdateEvent';
import PleaseSignIn from '../components/PleaseSignIn';
import CheckPermissions from '../components/CheckPermissions';

const UpdateEventPage = props => (
  <PleaseSignIn>
    <CheckPermissions
      id={props.query.id}
      permissions={['ADMIN', 'EVENTUPDATE']}
      prePage="true"
    >
      <UpdateEvent id={props.query.id} />
    </CheckPermissions>
  </PleaseSignIn>
);

export default UpdateEventPage;
