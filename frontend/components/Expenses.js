import React, { Component } from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { expensesPerPage } from '../config';
import Management from './styles/Management';
import ManageSideNav from './ManageSideNav';
import Title from './styles/Title';
import Error from './Error';

const EVENT_EXPENSES_QUERY = gql`
  query EVENT_EXPENSES_QUERY($event: Int!, $skip: Int = 0, $first: Int = ${expensesPerPage}) {
    expenses(where: { event: {id: $event} }, skip: $skip, first: $first, orderBy: createdAt_DESC) {
    id
    amount
    title
    description
    }
  }
`;

const ExpensesContainer = styled.div`
  width: 75%;
  height: 100%;
  display: grid;
  grid-template-columns: 1;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  grid-auto-rows: minmax(90px, 1fr);
  margin-left: 40px;
`;

const Expense = styled.div`
  border-radius: 3px;
  padding: 0.5rem 1rem;
  color: white;
  background-color: ${props => props.theme.softOcean};
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;

  p {
    margin: 0;
  }

  h3 {
    margin: 0;
  }

  .left {
    float: left;
  }

  .right {
    float: right;
  }

  &::after {
    content: '';
    display: inline-block;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    transition: all 0.3s ease;
    position: absolute;
  }
  &:hover {
    &::after {
      background-color: rgba(255, 255, 255, 0.2);
      z-index: 99;
    }
  }
`;

class Expenses extends Component {
  render() {
    return (
      <>
        <Title>Manage Expenses</Title>
        <Management>
          <ManageSideNav id={this.props.id} />

          <Query
            query={EVENT_EXPENSES_QUERY}
            variables={{
              event: this.props.id,
              skip: this.props.page * expensesPerPage - expensesPerPage
            }}
          >
            {({ data, loading, error }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <Error error={error} />;
              const { expenses } = data;
              return (
                <ExpensesContainer>
                  {expenses.length > 0 ? (
                    expenses.map(expense => (
                      <Expense key={expense.id}>
                        <div className="left">
                          <h3>{expense.title}</h3>
                        </div>
                        <div className="right">
                          <p>{expense.description}</p>
                          <p>{expense.amount}</p>
                        </div>
                      </Expense>
                    ))
                  ) : (
                    <p>No Expenses</p>
                  )}
                </ExpensesContainer>
              );
            }}
          </Query>
        </Management>
      </>
    );
  }
}

export default Expenses;
