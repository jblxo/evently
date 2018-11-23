import Link from 'next/link';

const Header = () => (
  <div>
    <h1>Hi this is Header</h1>
    <p>Welcome to this page</p>
    <Link href="/">
      <a>Home</a>
    </Link>
    <Link href="/about">
      <a>About</a>
    </Link>
  </div>
);

export default Header;
