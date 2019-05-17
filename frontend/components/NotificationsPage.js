import React from 'react';

class NotificationsPage extends React.Component {
  componentDidMount() {
    this.props.subscribeToNewNotifications();
  }

  render() {
    return (
      <>
        <p>Notifications Page</p>
        {this.props.data.notifications.map((notification, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: notification.body }} />
        ))}
      </>
    );
  }
}

export default NotificationsPage;
