import withApollo from 'next-with-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { GRAPHQL_URL } from '../config';

const link = createHttpLink({
  uri: GRAPHQL_URL,
  credentials: 'same-origin'
});

export default withApollo(
  ({ headers }) =>
    new ApolloClient({
      cache: new InMemoryCache(),
      link
    })
);
