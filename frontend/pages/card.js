import PleaseSignIn from '../components/PleaseSignIn';
import CheckPermissions from '../components/CheckPermissions';
import Card from '../components/SingleCard';

const CardPage = ({ query: { card, event, board } }) => (
  <PleaseSignIn>
    <CheckPermissions
      prePage="true"
      id={event}
      permissions={['STEWARD', 'ADMIN']}
    >
      <Card id={card} event={event} board={board} />
    </CheckPermissions>
  </PleaseSignIn>
);

export default CardPage;
