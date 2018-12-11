import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Button from './styles/Button';
import { CURRENT_USER_QUERY } from './User';
import Error from './Error';

const SINGUP_MUTATION = gql`
  mutation SINGUP_MUTATION(
    $email: String!
    $firstName: String!
    $lastName: String!
    $password: String!
    $confirmPassword: String!
    $username: String!
  ) {
    signup(
      email: $email
      firstName: $firstName
      lastName: $lastName
      password: $password
      confirmPassword: $confirmPassword
      username: $username
    ) {
      id
      email
      username
    }
  }
`;

class Signup extends Component {
  state = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    username: ''
  };

  saveToState = e => {
    const { name, type, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <Mutation
        mutation={SINGUP_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signup, { error, loading }) => (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await signup();
              this.setState({
                email: '',
                firstName: '',
                lastName: '',
                password: '',
                confirmPassword: '',
                username: ''
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              {error && <Error error={error} />}
              <h2>Sign Up For an Account!</h2>
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.saveToState}
                  required
                />
              </label>
              <label htmlFor="username">
                Username
                <input
                  type="text"
                  name="username"
                  placeholder="JohnWick420"
                  value={this.state.username}
                  onChange={this.saveToState}
                  required
                />
              </label>
              <label htmlFor="firstName">
                First Name
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={this.state.firstName}
                  onChange={this.saveToState}
                  required
                />
              </label>
              <label htmlFor="lastName">
                Last Name
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={this.state.lastName}
                  onChange={this.saveToState}
                  required
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.saveToState}
                  required
                />
              </label>
              <label htmlFor="confirmPassword">
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Cofnirm Password"
                  value={this.state.confirmPassword}
                  onChange={this.saveToState}
                  required
                />
              </label>
            </fieldset>
            <Button type="submit">Sign Up!</Button>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signup;
