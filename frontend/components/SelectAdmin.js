import React, { Component } from 'react';
import Downshift from 'downshift';
import { ApolloConsumer, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import Error from './Error';
import Title from './styles/Title';
import { Dropdown, DropdownInput, DropdownContent } from './styles/Dropdown';
import { SINGLE_CARD_QUERY } from './SingleCard';

const SEARCH_USERS_QUERY = gql`
  query SEARCH_USERS_QUERY($search: String!, $event: Int!) {
    eventAdmins(
      where: {
        user: {
          OR: [
            { username_contains: $search }
            { firstName_contains: $search }
            { lastName_contains: $search }
          ]
        }
        event: { id: $event }
      }
    ) {
      user {
        id
        username
        email
      }
    }
  }
`;

const ASSIGN_USER_TO_TASK_MUTATION = gql`
  mutation ASSIGN_USER_TO_TASK_MUTATION(
    $user: Int!
    $event: Int!
    $card: Int!
  ) {
    assignUserToTask(user: $user, event: $event, card: $card) {
      id
      list {
        board {
          event {
            id
          }
        }
      }
    }
  }
`;

class AdminAutoComplete extends Component {
  state = {
    admins: [],
    loading: false
  };

  onChange = debounce(async (e, client) => {
    this.setState({ loading: true });
    const res = await client.query({
      query: SEARCH_USERS_QUERY,
      variables: { search: e.target.value, event: this.props.id }
    });
    const admins = res.data.eventAdmins.map(admin => admin.user);
    const uniqueAdmins = Array.from(new Set(admins.map(admin => admin.id))).map(
      id => {
        return {
          id: id,
          username: admins.find(a => a.id === id).username
        };
      }
    );
    this.setState({ admins: uniqueAdmins, loading: false });
  }, 350);

  render() {
    return (
      <Mutation
        mutation={ASSIGN_USER_TO_TASK_MUTATION}
        refetchQueries={[
          {
            query: SINGLE_CARD_QUERY,
            variables: { id: this.props.card, user: this.props.user }
          }
        ]}
      >
        {(assignUserToTask, { loading, error }) => {
          if (error) return <Error error={error} />;
          return (
            <Downshift
              onChange={async user => {
                const res = await assignUserToTask({
                  variables: {
                    user: user.id,
                    event: this.props.id,
                    card: this.props.card
                  }
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
                        disabled={loading}
                        {...getInputProps({
                          type: 'search',
                          placeholder: 'Search for a admin',
                          id: 'search',
                          className: this.state.loading ? 'loading' : '',
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
                      {this.state.admins.map((admin, i) => (
                        <DropdownContent
                          {...getItemProps({
                            key: admin.id,
                            index: i,
                            item: admin,
                            highlighted: i === highlightedIndex
                          })}
                        >
                          {admin.username}
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

class SelectAdmin extends Component {
  render() {
    return (
      <div>
        <Title>Assign Admin</Title>
        <AdminAutoComplete
          id={this.props.id}
          card={this.props.card}
          user={this.props.user}
        />
      </div>
    );
  }
}

export default SelectAdmin;
