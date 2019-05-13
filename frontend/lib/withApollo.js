import withApollo from 'next-with-apollo';
import { createHttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, concat } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { GRAPHQL_URL } from '../config';

const httpLink = createHttpLink({
  uri: GRAPHQL_URL
});

const authMiddleware = headers =>
  new ApolloLink((operation, forward) => {
    operation.setContext({
      fetchOptions: {
        credentials: 'include'
      },
      headers
    });

    return forward(operation);
  });

export default withApollo(
  ({ headers }) =>
    new ApolloClient({
      link: concat(authMiddleware(headers), httpLink),
      cache: new InMemoryCache()
    })
);
