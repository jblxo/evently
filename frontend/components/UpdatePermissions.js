import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import Link from 'next/link';
import uniqueUserArr from '../lib/uniqueUserArr';
import ButtonSmall from './styles/ButtonSmall';
import Button from './styles/Button';
import Table from './styles/Table';

const possiblePermissions = ['EVENTUPDATE', 'EVENTDELETE', 'PERMISSIONUPDATE'];

const EVENT_ADMINS_QUERY = gql`
  query EVENT_ADMINS_QUERY($id: Int!) {
    eventAdmins(where: { event: { id: $id } }) {
      user {
        id
        username
        email
      }
      permission {
        name
      }
    }
  }
`;

const UPDATE_PERMISSION_MUTATION = gql`
  mutation UPDATE_PERMISSION_MUTATION(
    $permissions: [String]
    $userId: Int!
    $eventId: Int!
  ) {
    updateEventAdmins(
      permissions: $permissions
      userId: $userId
      eventId: $eventId
    ) {
      eventAdmins {
        id
        event {
          id
        }
        permission {
          id
          name
        }
        user {
          id
        }
      }
    }
  }
`;

class UpdatePermissions extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  render() {
    return (
      <Query query={EVENT_ADMINS_QUERY} variables={{ id: this.props.id }}>
        {({ data, error, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <Error error={error} />;
          const { eventAdmins } = data;
          const userArr = uniqueUserArr(eventAdmins);
          const userPerms = [];
          for (let i = 0; i < userArr.length; i++) {
            userPerms[i] = userArr[i];
            const permissions = [];
            for (let j = 0; j < eventAdmins.length; j++) {
              if (eventAdmins[j].user === userArr[i]) {
                permissions.push(eventAdmins[j].permission.name);
              }
            }
            userPerms[i]['permissions'] = permissions;
          }

          return (
            <div>
              <h2>Manage Permissions</h2>
              <Link
                href={{
                  pathname: '/addAdmin',
                  query: { id: this.props.id }
                }}
              >
                <Button>Add Admin</Button>
              </Link>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    {possiblePermissions.map(permission => (
                      <th key={permission}>{permission}</th>
                    ))}
                    <th>👇</th>
                  </tr>
                </thead>
                <tbody>
                  {userPerms.map(user => (
                    <Admin key={user.id} user={user} eventId={this.props.id} />
                  ))}
                </tbody>
              </Table>
            </div>
          );
        }}
      </Query>
    );
  }
}

class Admin extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.number,
      permissions: PropTypes.array
    }).isRequired,
    eventId: PropTypes.string.isRequired
  };

  state = {
    permissions: this.props.user.permissions
  };

  handlePermissionChange = e => {
    const checkbox = e.target;
    let updatedPermissions = [...this.state.permissions];
    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(
        permission => permission != checkbox.value
      );
    }

    this.setState({
      permissions: updatedPermissions
    });
  };

  render() {
    const user = this.props.user;
    return (
      <Mutation
        mutation={UPDATE_PERMISSION_MUTATION}
        variables={{
          permissions: this.state.permissions,
          userId: this.props.user.id,
          eventId: this.props.eventId
        }}
      >
        {(updateEventAdmins, { loading, error }) => (
          <>
            {error && (
              <tr>
                <td colSpan="9">
                  <Error error={error} />
                </td>
              </tr>
            )}
            <tr>
              <td>{user.username}</td>
              <td>{user.email}</td>
              {possiblePermissions.map(permission => (
                <td key={permission}>
                  <label htmlFor={`${user.id}-permission-${permission}`}>
                    <input
                      id={`${user.id}-permission-${permission}`}
                      type="checkbox"
                      checked={this.state.permissions.includes(permission)}
                      value={permission}
                      onChange={this.handlePermissionChange}
                    />
                  </label>
                </td>
              ))}
              <td>
                <ButtonSmall
                  type="submit"
                  disabled={loading}
                  onClick={updateEventAdmins}
                >
                  Updat{loading ? 'ing' : 'e'}
                </ButtonSmall>
              </td>
            </tr>
          </>
        )}
      </Mutation>
    );
  }
}

export default UpdatePermissions;
export { Admin };
