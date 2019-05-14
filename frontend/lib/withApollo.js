import withApollo from 'next-with-apollo';
import { createHttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, concat, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import { GRAPHQL_URL, GRAPHQL_URL_WS } from '../config';

const wsLink = process.browser
  ? new WebSocketLink({
      uri: GRAPHQL_URL_WS,
      options: {
        reconnect: true
      }
    })
  : () => console.log('SSR');

const httpLink = createHttpLink({
  uri: GRAPHQL_URL
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

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
      link: concat(authMiddleware(headers), link),
      cache: new InMemoryCache()
    })
);
