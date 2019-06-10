import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import NotificationsStyles from './styles/NotificationsStyles';
import CloseButton from './styles/CloseButton';

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

class NotificationsPage extends React.Component {
  componentDidMount() {
    this.props.subscribeToNewNotifications();
  }

  render() {
    return (
      <Mutation mutation={TOGGLE_NOTIFICATIONS_MUTATION}>
        {toggleNotifications => (
          <Query query={LOCAL_STATE_QUERY}>
            {({ data }) => (
              <NotificationsStyles open={data.notificationsOpen}>
                <header>
                  <CloseButton title="close" onClick={toggleNotifications}>
                    &times;
                  </CloseButton>
                  <h2>Notifications Page</h2>
                  <p>
                    You Have {this.props.data.notifications.length}{' '}
                    Notifications
                  </p>
                </header>
                <footer>
                  <ul>
                    {this.props.data.notifications.map((notification, i) => (
                      <li
                        key={i}
                        dangerouslySetInnerHTML={{ __html: notification.body }}
                      />
                    ))}
                  </ul>
                </footer>
              </NotificationsStyles>
            )}
          </Query>
        )}
      </Mutation>
    );
  }
}

export default NotificationsPage;
