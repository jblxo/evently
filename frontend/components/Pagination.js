import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import PaginationStyles from './styles/PaginationStyles.js';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    eventsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = props => {
  return (
    <Query query={PAGINATION_QUERY}>
      {({ data, loading }) => {
        if (loading) return <p>Loading...</p>;
        const count = data.eventsConnection.aggregate.count;
        const pages = Math.ceil(count / perPage);
        const page = props.page;
        console.log(page);
        return (
          <PaginationStyles>
            <Head>
              <title>
                Evently | Page {page} of {pages}
              </title>
            </Head>
            <Link
              href={{
                pathname: '/events',
                query: { page: page - 1 }
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
            <p>{count} Items Total</p>
            <Link
              href={{
                pathname: '/events',
                query: { page: page + 1 }
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
};

export default Pagination;
