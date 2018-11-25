import styled from 'styled-components';
import Link from 'next/link';
import NavStyles from './styles/NavStyles';

const Nav = () => (
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
    <Link href="/login">
      <a>Log In</a>
    </Link>
    <Link href="/account">
      <a>Account</a>
    </Link>
    <Link href="/create">
      <a>Create Your Own Event</a>
    </Link>
  </NavStyles>
);

export default Nav;
