import React, { Component } from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { expensesPerPage } from '../config';
import Management from './styles/Management';
import ManageSideNav from './ManageSideNav';
import Title from './styles/Title';
import Error from './Error';
import Expense from './Expense';

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
                      <Expense key={expense.id} expense={expense} />
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
