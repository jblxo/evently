import Nav from './Nav';
import Notifications from './Notifications';
import User from './User';

const Header = () => (
  <div>
    <Nav />
    <User>{({ data: { me } }) => <>{me && <Notifications />}</>}</User>
  </div>
);

export default Header;
