import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import PropTypes from 'prop-types';
import Error from './Error';
import Form from './styles/Form';
import Button from './styles/Button';
import { SINGLE_EVENT_QUERY } from './SingleEvent';

const CREATE_BOARD_MUTATION = gql`
  mutation CREATE_BOARD_MUTATION(
    $id: Int!
    $title: String!
    $description: String
  ) {
    createBoard(id: $id, title: $title, description: $description) {
      id
      title
    }
  }
`;

class CreateBoard extends React.Component {
  state = {
    title: 'New Board',
    description: ''
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <Mutation
        mutation={CREATE_BOARD_MUTATION}
        variables={{ ...this.state, id: this.props.id }}
        refetchQueries={[
          { query: SINGLE_EVENT_QUERY, variables: { id: this.props.id } }
        ]}
      >
        {(createBoard, { loading, error }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault();
              const res = await createBoard();
              Router.push({
                pathname: '/board',
                query: { board: res.data.createBoard.id, event: this.props.id }
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Create New Board!</h2>
              <Error error={error} />
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter a title"
                  value={this.state.title}
                  onChange={this.handleChange}
                  required
                />
              </label>
              <label htmlFor="description">
                Description
                <input
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Enter a description"
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label>
              <Button type="submit">Create ➕</Button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

CreateBoard.propTypes = {
  id: PropTypes.string.isRequired
};

export default CreateBoard;
