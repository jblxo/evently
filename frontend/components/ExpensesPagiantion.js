import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import { expensesPerPage } from '../config';
import PaginationStyles from './styles/PaginationStyles';

const EXPENSES_PAGINATION_QUERY = gql`
  query EXPENSES_PAGINATION_QUERY($event: Int!) {
    expensesConnection(where: { event: { id: $event } }) {
      aggregate {
        count
      }
    }
  }
`;

const ExpensesPagiantion = props => (
  <Query query={EXPENSES_PAGINATION_QUERY} variables={{ event: props.event }}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>;
      const count = data.expensesConnection.aggregate.count;
      const pages = Math.ceil(count / expensesPerPage);
      const page = props.page;
      return (
        <PaginationStyles>
          <Head>
            <title>Evently | Expenses</title>
          </Head>
          <Link
            href={{
              pathname: '/expenses',
              query: { id: props.event, page: page - 1 }
            }}
            prefetch
          >
            <a className="prev" aria-disabled={page <= 1}>
              ⬅ Prev
            </a>
          </Link>
          <p>
            Page {page} of {pages}
          </p>
          <p>{count} Expenses Total</p>
          <Link
            href={{
              pathname: '/expenses',
              query: { id: props.event, page: page + 1 }
            }}
            prefetch
          >
            <a className="prev" aria-disabled={page >= pages}>
              Next ➡
            </a>
          </Link>
        </PaginationStyles>
      );
    }}
  </Query>
);

export default ExpensesPagiantion;
