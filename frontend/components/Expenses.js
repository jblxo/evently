import React, { Component } from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Modal from 'react-modal';
import { expensesPerPage } from '../config';
import Management from './styles/Management';
import ManageSideNav from './ManageSideNav';
import Title from './styles/Title';
import Error from './Error';
import Expense from './Expense';
import customStyles from './styles/ModalStyles';
import CreateExpense from './CreateExpense';
import getTotal from '../lib/getTotal';
import formatMoney from '../lib/formatMoney';
import ExpensesPagiantion from './ExpensesPagiantion';

const EVENT_EXPENSES_QUERY = gql`
  query EVENT_EXPENSES_QUERY($event: Int!, $skip: Int = 0, $first: Int = ${expensesPerPage}) {
    expenses(where: { event: {id: $event} }, skip: $skip, first: $first, orderBy: createdAt_DESC) {
    id
    amount
    title
    description
    createdAt
    }
  }
`;

const ALL_EVENT_EXPENSES_QUERY = gql`
  query ALL_EVENT_EXPENSES_QUERY($event: Int!) {
    expenses(where: { event: { id: $event } }) {
      amount
    }
  }
`;

const ExpensesContainer = styled.div`
  width: 75%;
  height: 100%;
  display: grid;
  grid-auto-columns: 1;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  grid-template-rows: 3.5rem;
  grid-auto-rows: minmax(90px, 1fr);
  margin-left: 40px;
`;

const Summary = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(1, 3rem);
  grid-column-gap: 6%;
`;

const Total = styled.p`
  margin: 0;
  width: 20rem;
  text-align: center;
  background-color: ${props => props.theme.rose};
  display: block;
  border-radius: 3px;
  color: white;
  padding: 0 1rem;
`;

const AddExpenseButton = styled.button`
  width: 20rem;
  font-family: inherit;
  color: white;
  padding: 0.5rem 1rem;
  margin: 0;
  cursor: pointer;
  background-color: ${props => props.theme.paleOrange};
  border: none;
  outline: none;
  border-radius: 3px;
`;

Modal.setAppElement('#__next');

class Expenses extends Component {
  state = {
    modalIsOpen: false
  };

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  render() {
    return (
      <>
        <Title>Manage Expenses</Title>
        <Management>
          <ManageSideNav id={this.props.id} />
          <Query
            query={ALL_EVENT_EXPENSES_QUERY}
            variables={{ event: this.props.id }}
          >
            {({ data, loading, error }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <Error error={error} />;
              const { expenses: allExpenses } = data;
              return (
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
                        <Summary>
                          <AddExpenseButton onClick={this.openModal}>
                            Add Expense
                          </AddExpenseButton>
                          <Total>
                            All Total: {formatMoney(getTotal(allExpenses))}
                          </Total>
                          <Total>
                            Visible Total:{' '}
                            {formatMoney(getTotal(data.expenses))}
                          </Total>
                        </Summary>
                        {expenses.length > 0 ? (
                          expenses.map(expense => (
                            <Expense key={expense.id} expense={expense} />
                          ))
                        ) : (
                          <p>No Expenses</p>
                        )}
                        <ExpensesPagiantion
                          event={this.props.id}
                          page={parseFloat(this.props.page)}
                        />
                      </ExpensesContainer>
                    );
                  }}
                </Query>
              );
            }}
          </Query>
        </Management>
        <Modal
          isOpen={this.state.modalIsOpen}
          style={customStyles}
          onRequestClose={this.closeModal}
          contentLabel="Create New Expense"
        >
          <CreateExpense event={this.props.id} />
        </Modal>
      </>
    );
  }
}

export default Expenses;
export { EVENT_EXPENSES_QUERY, ALL_EVENT_EXPENSES_QUERY };
