import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const SideNav = styled.nav`
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  a {
    margin: 0.3rem 0;
    display: block;
    padding: 0.5rem 2rem;
    border-radius: 3px;
    transition: all 0.2s ease-out;
    &:hover {
      background-color: ${props => props.theme.softOcean};
    }
  }
`;

const ManageSideNav = props => (
  <SideNav>
    <Link
      href={{
        pathname: '/manage',
        query: { id: props.id }
      }}
    >
      <a>🏠 Home</a>
    </Link>
    <Link
      href={{
        pathname: '/expenses',
        query: { id: props.id }
      }}
    >
      <a>💳 Expenses</a>
    </Link>
  </SideNav>
);

export default ManageSideNav;
