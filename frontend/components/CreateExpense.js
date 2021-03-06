import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './Error';
import { EVENT_EXPENSES_QUERY, ALL_EVENT_EXPENSES_QUERY } from './Expenses';
import Form from './styles/Form';
import Button from './styles/Button';

const CREATE_EXPENSE_MUTATION = gql`
  mutation CREATE_EXPENSE_MUTATION(
    $amount: Float!
    $description: String
    $event: Int!
    $title: String!
  ) {
    createExpense(
      amount: $amount
      description: $description
      event: $event
      title: $title
    ) {
      id
    }
  }
`;

class CreateExpense extends Component {
  state = {
    title: '',
    description: '',
    amount: 0
  };

  handleChange = e => {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  };

  handleAmountChange = e => {
    const amount = e.target.value;

    if (!amount || amount.match(/^\d{1,}(\.\d{0,2})?$/)) {
      this.setState({ amount });
    }
  };

  render() {
    return (
      <Mutation
        mutation={CREATE_EXPENSE_MUTATION}
        variables={{ event: this.props.event, ...this.state }}
        refetchQueries={[
          {
            query: EVENT_EXPENSES_QUERY,
            variables: { event: this.props.event }
          },
          {
            query: ALL_EVENT_EXPENSES_QUERY,
            variables: { event: this.props.event }
          }
        ]}
      >
        {(createExpense, { loading, error }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault();
              const amountToStore = this.state.amount * 100;
              const res = await createExpense({
                variables: { amount: amountToStore }
              });
            }}
          >
            <fieldset disabled={loading} aria-disabled={loading}>
              <h2>Create Expense</h2>
              <Error error={error} />
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Expense title"
                  value={this.state.title}
                  onChange={this.handleChange}
                  required
                />
              </label>
              <label htmlFor="description">
                Description
                <input
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Description"
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="amount">
                Amount
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  placeholder="250"
                  value={this.state.amount}
                  onChange={this.handleAmountChange}
                />
              </label>
              <Button type="submit">Create ➕</Button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateExpense;
