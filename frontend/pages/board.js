import CheckPermissions from '../components/CheckPermissions';
import PleaseSignIn from '../components/PleaseSignIn';
import Board from '../components/Board';

const BoardPage = ({ query: { board, event } }) => (
  <PleaseSignIn>
    <CheckPermissions
      prePage="true"
      id={event}
      permissions={['STEWARD', 'ADMIN']}
    >
      <Board board={board} event={event} />
    </CheckPermissions>
  </PleaseSignIn>
);

export default BoardPage;
