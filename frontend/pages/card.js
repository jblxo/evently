import PleaseSignIn from '../components/PleaseSignIn';
import CheckPermissions from '../components/CheckPermissions';
import Card from '../components/SingleCard';

const CardPage = ({ query: { card, event, board, list } }) => (
  <PleaseSignIn>
    <CheckPermissions
      prePage="true"
      id={event}
      permissions={['STEWARD', 'ADMIN']}
    >
      <Card id={card} event={event} board={board} list={list} />
    </CheckPermissions>
  </PleaseSignIn>
);

export default CardPage;
