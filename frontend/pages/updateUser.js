import UpdateUser from '../components/UpdateUser';
import PleaseSignIn from '../components/PleaseSignIn';

const UpdateUserPage = props => (
  <PleaseSignIn>
    <UpdateUser id={props.query.id} />
  </PleaseSignIn>
);

export default UpdateUserPage;
