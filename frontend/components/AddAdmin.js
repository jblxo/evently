import React, { Component } from 'react';
import Downshift from 'downshift';
import Router from 'next/router';
import { ApolloConsumer, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import Error from './Error';
import Title from './styles/Title';
import { Dropdown, DropdownInput, DropdownContent } from './styles/Dropdown';

const SEARCH_USERS_QUERY = gql`
  query SEARCH_USERS_QUERY($search: String!) {
    users(
      where: {
        OR: [
          { username_contains: $search }
          { firstName_contains: $search }
          { lastName_contains: $search }
        ]
      }
    ) {
      id
      username
      email
    }
  }
`;

const ADD_USER_AS_STEWARD = gql`
  mutation ADD_USER_AS_STEWARD(
    $eventId: Int!
    $userId: Int!
    $permissions: [String] = ["STEWARD"]
  ) {
    updateEventAdmins(
      permissions: $permissions
      userId: $userId
      eventId: $eventId
    ) {
      id
      username
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

class AutoComplete extends Component {
  state = {
    users: [],
    loading: false
  };

  onChange = debounce(async (e, client) => {
    this.setState({ loading: true });
    const res = await client.query({
      query: SEARCH_USERS_QUERY,
      variables: { search: e.target.value }
    });
    this.setState({ users: res.data.users, loading: false });
  }, 350);

  render() {
    console.log(this.props);
    return (
      <Mutation mutation={ADD_USER_AS_STEWARD}>
        {(updateEventAdmins, { loading, error }) => {
          if (error) return <Error error={error} />;
          return (
            <Downshift
              onChange={async user => {
                const res = await updateEventAdmins({
                  variables: { eventId: this.props.id, userId: user.id }
                });
                Router.push({
                  pathname: '/updatePermissions',
                  query: { id: this.props.id }
                });
              }}
              itemToString={user => (user === null ? '' : user.username)}
            >
              {({
                getInputProps,
                getItemProps,
                isOpen,
                inputValue,
                highlightedIndex
              }) => (
                <div>
                  <ApolloConsumer>
                    {client => (
                      <DropdownInput
                        {...getInputProps({
                          type: 'search',
                          placeholder: 'Search for a user',
                          id: 'search',
                          className: this.state.loading ? 'lodaing' : '',
                          onChange: e => {
                            e.persist();
                            this.onChange(e, client);
                          }
                        })}
                      />
                    )}
                  </ApolloConsumer>
                  {isOpen && (
                    <Dropdown>
                      {this.state.users.map((user, i) => (
                        <DropdownContent
                          {...getItemProps({
                            key: user.id,
                            index: i,
                            item: user,
                            highlighted: i === highlightedIndex
                          })}
                        >
                          {user.username}
                        </DropdownContent>
                      ))}
                    </Dropdown>
                  )}
                </div>
              )}
            </Downshift>
          );
        }}
      </Mutation>
    );
  }
}

class AddAdmin extends Component {
  render() {
    return (
      <div>
        <Title>Add Admin Page</Title>
        <AutoComplete id={this.props.id} />
      </div>
    );
  }
}

export default AddAdmin;
