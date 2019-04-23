import withApollo from 'next-with-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { GRAPHQL_URL } from '../config';

export default withApollo(
  ({ headers }) =>
    new ApolloClient({
      link: ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors)
            graphQLErrors.map(({ message, locations, path }) =>
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
              )
            );
          if (networkError) console.log(`[Network error]: ${networkError}`);
        }),
        new HttpLink({
          uri: GRAPHQL_URL,
          credentials: 'include',
          request: operation => {
            operation.setContext({
              fetchOptions: {
                credentials: 'include'
              },
              headers
            });
          }
        }),
        new HttpLink({
          uri: GRAPHQL_URL,
          credentials: 'same-origin'
        })
      ]),
      cache: new InMemoryCache()
    })
);
