import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import { GRAPHQL_URL } from '../config';

export default withApollo(
  ({ headers }) =>
    new ApolloClient({
      uri: GRAPHQL_URL,
      request: operation => {
        operation.setContext({
          fetchOptions: {
            credentials: 'include'
          },
          headers
        });
      }
    })
);
