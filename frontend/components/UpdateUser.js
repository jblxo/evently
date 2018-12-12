import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import Button from './styles/Button';
import { CURRENT_USER_QUERY } from './User';
import Error from './Error';

const UPDATE_USER_MUTATION = gql`
  mutation UPDATE_USER_MUTATION(
    $id: Int!
    $email: String
    $username: String
    $firstName: String
    $lastName: String
  ) {
    updateUser(
      id: $id
      email: $email
      username: $username
      firstName: $firstName
      lastName: $lastName
    ) {
      id
    }
  }
`;

const SIGNLE_USER_QUERY = gql`
  query SINGLE_USER_QUERY($id: Int!) {
    user(where: { id: $id }) {
      email
      username
      firstName
      lastName
    }
  }
`;

class UpdateUser extends Component {
  state = {};

  saveToState = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <Query query={SIGNLE_USER_QUERY} variables={{ id: this.props.id }}>
        {({ data, error, loading }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>Loading...</p>;
          if (!data.user) return <p>No User Found for ID {data.user.id}</p>;
          return (
            <Mutation mutation={UPDATE_USER_MUTATION} variables={this.state}>
              {(updateUser, { error, loading }) => (
                <Form
                  method="post"
                  onSubmit={async e => {
                    e.preventDefault();
                    const res = await updateUser({
                      variables: {
                        id: this.props.id,
                        ...this.state
                      }
                    });

                    Router.push({
                      pathname: '/updateUser',
                      query: { id: res.data.updateUser.id }
                    });
                  }}
                >
                  <fieldset disabled={loading} aria-busy={loading}>
                    <Error error={error} />
                    <h2>Update {data.user.username}!</h2>
                    <label htmlFor="email">
                      Email
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        defaultValue={data.user.email}
                        onChange={this.saveToState}
                        required
                      />
                    </label>
                    <label htmlFor="username">
                      Username
                      <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username"
                        defaultValue={data.user.username}
                        onChange={this.saveToState}
                        required
                      />
                    </label>
                    <label htmlFor="firstName">
                      First Name
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="First Name"
                        defaultValue={data.user.firstName}
                        onChange={this.saveToState}
                        required
                      />
                    </label>
                    <label htmlFor="lastName">
                      Last Name
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Last Name"
                        defaultValue={data.user.lastName}
                        onChange={this.saveToState}
                        required
                      />
                    </label>
                  </fieldset>
                  <Button type="submit">Updat{loading ? 'ing' : 'e'}!</Button>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateUser;
