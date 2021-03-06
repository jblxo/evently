import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';
import { findDOMNode } from 'react-dom';
import { Mutation } from 'react-apollo';
import { TOGGLE_NOTIFICATIONS_MUTATION } from './NotificationsPage';

class Nav extends React.Component {
  state = {
    lastScrollY: 0
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const node = findDOMNode(this);
    const rect = node.getBoundingClientRect();
    const windowScrollY = window.scrollY;

    if (windowScrollY > rect.height) {
      node.style.backgroundColor = '#4A6146';
    } else {
      node.style.backgroundColor = 'transparent';
    }
  };

  render() {
    return (
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
                <Link
                  href={{
                    pathname: '/user',
                    query: { id: me.id }
                  }}
                >
                  <a>Account</a>
                </Link>
                <Link href="/create">
                  <a>Create Your Own Event</a>
                </Link>
                <Mutation mutation={TOGGLE_NOTIFICATIONS_MUTATION}>
                  {toggleNotificationsMutation => (
                    <button onClick={toggleNotificationsMutation}>
                      Notifications
                    </button>
                  )}
                </Mutation>
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
  }
}

export default Nav;
