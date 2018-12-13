import UpdateEvent from '../components/UpdateEvent';
import PleaseSignIn from '../components/PleaseSignIn';

const UpdateEventPage = props => (
  <PleaseSignIn>
    <UpdateEvent id={props.query.id} />
  </PleaseSignIn>
);

export default UpdateEventPage;
