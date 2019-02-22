import PleaseSignIn from '../components/PleaseSignIn';
import CheckPermissions from '../components/CheckPermissions';
import UpdateCard from '../components/UpdateCard';

const CardPage = ({ query: { id, event } }) => (
  <PleaseSignIn>
    <CheckPermissions
      prePage="true"
      id={event}
      permissions={['STEWARD', 'ADMIN']}
    >
      <UpdateCard id={id} event={event} />
    </CheckPermissions>
  </PleaseSignIn>
);

export default CardPage;
