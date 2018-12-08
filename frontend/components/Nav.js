import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyles>
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/about">
          <a>About</a>
        </Link>
        <Link href="/events">
          <a>Events</a>
        </Link>
        {me && (
          <>
            <Link href="/account">
              <a>Account</a>
            </Link>
            <Link href="/create">
              <a>Create Your Own Event</a>
            </Link>
            <Signout />
          </>
        )}

        {!me && (
          <Link href="/signup">
            <a>Sign Up</a>
          </Link>
        )}
      </NavStyles>
    )}
  </User>
);

export default Nav;
