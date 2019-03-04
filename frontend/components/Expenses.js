import React from 'react';
import styled from 'styled-components';
import Management from './styles/Management';
import ManageSideNav from './ManageSideNav';
import Title from './styles/Title';

const ExpensesContainer = styled.div`
  width: 75%;
  height: 100%;
  margin-left: 4rem;
`;

const Expenses = props => {
  return (
    <>
      <Title>Manage Expenses</Title>
      <Management>
        <ManageSideNav id={props.id} />
        <ExpensesContainer />
      </Management>
    </>
  );
};

export default Expenses;
