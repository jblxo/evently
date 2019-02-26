import PleaseSignIn from '../components/PleaseSignIn';
import CheckPermissions from '../components/CheckPermissions';
import UpdateBoard from '../components/UpdateBoard';

const UpdateBoardPage = ({ query: { id, event } }) => {
  return (
    <PleaseSignIn>
      <CheckPermissions
        prePage="true"
        id={event}
        permissions={['STEWARD', 'ADMIN']}
      >
        <UpdateBoard id={id} event={event} />
      </CheckPermissions>
    </PleaseSignIn>
  );
};

export default UpdateBoardPage;
