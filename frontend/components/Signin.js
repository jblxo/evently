import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Button from './styles/Button';
import { CURRENT_USER_QUERY } from './User';

const SINGIN_MUTATION = gql`
  mutation SINGIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      username
    }
  }
`;

class Signin extends Component {
  state = {
    email: '',
    password: ''
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
        mutation={SINGIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signin, { error, loading }) => (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await signin();
              this.setState({
                email: '',
                password: ''
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign In!</h2>
              <p>{console.log(error)}</p>
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.saveToState}
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
                />
              </label>
            </fieldset>
            <Button type="submit">Sign In!</Button>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signin;
