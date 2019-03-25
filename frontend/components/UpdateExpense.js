import React, { Component } from 'react';
import Router from 'next/router';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { SINGLE_EXPENSE_QUERY } from './SingleExpense';
import Error from './Error';
import Form from './styles/Form';
import Button from './styles/Button';

const UPDATE_EXPENSE_MUTATION = gql`
  mutation UPDATE_EXPENSE_MUTATION(
    $id: Int!
    $amount: Float
    $description: String
    $event: Int!
    $title: String
  ) {
    updateExpense(
      id: $id
      amount: $amount
      description: $description
      event: $event
      title: $title
    ) {
      id
    }
  }
`;

class UpdateExpense extends Component {
  state = {};

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
      <Query
        query={SINGLE_EXPENSE_QUERY}
        variables={{ id: this.props.id, event: this.props.event }}
      >
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <Error error={error} />;
          const { expense } = data;
          return (
            <Mutation
              mutation={UPDATE_EXPENSE_MUTATION}
              variables={{
                id: this.props.id,
                event: this.props.event,
                ...this.state
              }}
            >
              {(updateExpense, { loading, error }) => (
                <Form
                  onSubmit={async e => {
                    e.preventDefault();
                    const amountToStore = this.state.amount * 100;
                    const res = await updateExpense({
                      variables: { amount: amountToStore }
                    });

                    Router.back();
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
                        defaultValue={expense.title}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="description">
                      Description
                      <input
                        type="text"
                        id="description"
                        name="description"
                        placeholder="Description"
                        defaultValue={expense.description}
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
                        defaultValue={expense.amount / 100}
                        onChange={this.handleAmountChange}
                      />
                    </label>
                    <Button type="submit">Update!</Button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateExpense;
