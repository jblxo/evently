import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import NotificationsStyles from './styles/NotificationsStyles';
import CloseButton from './styles/CloseButton';
import { NOTIFICATIONS_QUERY } from './Notifications';
import User from './User';

export const LOCAL_STATE_QUERY = gql`
  query {
    notificationsOpen @client
  }
`;

export const TOGGLE_NOTIFICATIONS_MUTATION = gql`
  mutation {
    toggleNotifications @client
  }
`;

const SET_NOTIFICATION_VIEWED = gql`
  mutation SET_NOTIFICATION_VIEWED($notification: Int!) {
    setNotificationViewed(notification: $notification) {
      id
      body
      viewed
    }
  }
`;

class NotificationsPage extends React.Component {
  componentDidMount() {
    this.props.subscribeToNewNotifications();
  }

  render() {
    console.log(this.props);

    return (
      <User>
        {({ data: { me } }) => (
          <>
            {me && (
              <Mutation mutation={TOGGLE_NOTIFICATIONS_MUTATION}>
                {toggleNotifications => (
                  <Query query={LOCAL_STATE_QUERY}>
                    {({ data }) => (
                      <Mutation
                        mutation={SET_NOTIFICATION_VIEWED}
                        refetchQueries={[
                          {
                            query: NOTIFICATIONS_QUERY,
                            variables: { user: me.id },
                            fetchPolicy: 'cache-and-network'
                          }
                        ]}
                      >
                        {(setNotificationViewed, { loading }) => (
                          <NotificationsStyles open={data.notificationsOpen}>
                            <header>
                              <CloseButton
                                title="close"
                                onClick={toggleNotifications}
                              >
                                &times;
                              </CloseButton>
                              <h2>Notifications Page</h2>
                              <p>
                                You Have{' '}
                                {this.props.data.notifications
                                  ? this.props.data.notifications.length
                                  : 0}{' '}
                                Notifications
                              </p>
                            </header>
                            <footer>
                              <ul>
                                {this.props.data.notifications &&
                                  this.props.data.notifications.map(
                                    notification => (
                                      <li key={notification.id}>
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: notification.body
                                          }}
                                        />
                                        <span
                                          key={notification.id}
                                          onClick={async e => {
                                            e.preventDefault();
                                            await setNotificationViewed({
                                              variables: {
                                                notification: notification.id
                                              }
                                            });
                                          }}
                                        >
                                          🗑
                                        </span>
                                      </li>
                                    )
                                  )}
                              </ul>
                            </footer>
                          </NotificationsStyles>
                        )}
                      </Mutation>
                    )}
                  </Query>
                )}
              </Mutation>
            )}
          </>
        )}
      </User>
    );
  }
}

export default NotificationsPage;
