import React from 'react';
import gql from 'graphql-tag';
import { Subscription } from 'react-apollo';

const CARD_CREATED_SUBSCRIPTION = gql`
  subscription CARD_CREATED_SUBSCRIPTION {
    cardCreated {
      id
      title
    }
  }
`;

const Notifications = props => (
  <Subscription
    subscription={CARD_CREATED_SUBSCRIPTION}
    shouldResubscribe={true}
  >
    {({ data, loading }) => (
      <>
        {console.log(data)}
        <p>
          New card: {!loading && data.cardCreated && data.cardCreated.title}
        </p>
      </>
    )}
  </Subscription>
);

export default Notifications;
