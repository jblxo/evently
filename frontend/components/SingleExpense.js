import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import Link from 'next/link';
import Router from 'next/router';
import Error from './Error';
import formatMoney from '../lib/formatMoney';
import CardStyles from './styles/CardStyles';
import Title from './styles/Title';
import ButtonList from './styles/ButtonList';
import CardButton from './styles/CardButton';
import ButtonSmall from './styles/ButtonSmall';

const SINGLE_EXPENSE_QUERY = gql`
  query SINGLE_EXPENSE_QUERY($id: Int) {
    expense(where: { id: $id }) {
      title
      description
      amount
      createdAt
      user {
        id
        username
      }
    }
  }
`;

const DELETE_EXPENSE_MUTATION = gql`
  mutation DELETE_EXPENSE_MUTATION($id: Int!, $event: Int!) {
    deleteExpense(id: $id, event: $event) {
      id
    }
  }
`;

class SingleExpense extends Component {
  render() {
    return (
      <Query query={SINGLE_EXPENSE_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <Error error={error} />;
          const { expense } = data;
          return (
            <Mutation
              mutation={DELETE_EXPENSE_MUTATION}
              variables={{ id: this.props.id, event: this.props.event }}
            >
              {(deleteExpense, { loading, error }) => (
                <CardStyles>
                  <Title>{expense.title}</Title>
                  <ButtonList>
                    <CardButton
                      onClick={async () => {
                        await deleteExpense();
                        Router.back();
                      }}
                    >
                      ❌
                    </CardButton>
                    <CardButton
                      onClick={() => {
                        Router.push({
                          pathname: '/updateExpense',
                          query: { id: this.props.id, event: this.props.event }
                        });
                      }}
                    >
                      Edit
                    </CardButton>
                  </ButtonList>
                  <h4>Description</h4>
                  {expense.description.length > 0 ? (
                    <p>{expense.description}</p>
                  ) : (
                    <p>No Description 😓.</p>
                  )}
                  <h4>Amount</h4>
                  <p>{formatMoney(expense.amount)}</p>
                  <h4>Creator</h4>
                  {expense.user.username && (
                    <Link
                      href={{
                        pathname: '/user',
                        query: { id: expense.user.id }
                      }}
                    >
                      <a>
                        <ButtonSmall>{expense.user.username}</ButtonSmall>
                      </a>
                    </Link>
                  )}
                  <h4>Created</h4>
                  <p>{moment(expense.createdAt).format('DD.MM.YYYY')}</p>
                </CardStyles>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default SingleExpense;
export { SINGLE_EXPENSE_QUERY };
