import { Query } from 'react-apollo';
import { SINGLE_EVENT_QUERY } from './SingleEvent';
import User from './User';
import Router from 'next/router';

const CheckPermissions = props => (
  <User>
    {({ data: { me } }) => (
      <Query query={SINGLE_EVENT_QUERY} variables={{ id: props.id }}>
        {({ data, error, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (!data.event) return <h2>There is no event for ID {props.id}!</h2>;
          const permissions = data.event.eventAdmins.filter(
            eventAdmin => eventAdmin.user.id === me.id
          );
          console.log(permissions);
          if (permissions.length < 1) {
            return (
              <div>
                <h2>You don't have permission to do that!</h2>
                <button
                  type="button"
                  onClick={() => {
                    Router.back();
                  }}
                >
                  Go back
                </button>
              </div>
            );
          }
          return props.children;
        }}
      </Query>
    )}
  </User>
);

export default CheckPermissions;
