import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import User from './User';
import NotificationsPage from './NotificationsPage';

const NOTIFICATIONS_QUERY = gql`
  query NOTIFICATIONS_QUERY($user: Int!) {
    notifications(where: { user: { id: $user }, viewed: false }) {
      id
      body
      viewed
    }
  }
`;

const NOTIFICATIONS_SUBSCRIPTION = gql`
  subscription NOTIFICATIONS_SUBSCRIPTION($user: Int!) {
    notificationAdded(user: $user) {
      id
      body
      viewed
    }
  }
`;

const Notifications = props => (
  <User>
    {({ data: { me } }) => (
      <Query query={NOTIFICATIONS_QUERY} variables={{ user: me.id }}>
        {({ subscribeToMore, ...result }) => (
          <NotificationsPage
            {...result}
            subscribeToNewNotifications={() =>
              subscribeToMore({
                document: NOTIFICATIONS_SUBSCRIPTION,
                variables: { user: me.id },
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) return prev;
                  const newFeedItem = subscriptionData.data.notificationAdded;

                  return Object.assign({}, prev, {
                    notifications: [newFeedItem, ...prev.notifications]
                  });
                }
              })
            }
          />
        )}
      </Query>
    )}
  </User>
);

export default Notifications;
