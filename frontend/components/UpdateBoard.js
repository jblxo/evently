import React from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import PropTypes from 'prop-types';
import Error from './Error';
import Form from './styles/Form';
import Button from './styles/Button';
import { SINGLE_EVENT_QUERY } from './SingleEvent';
import { SINGLE_BOARD_QUERY } from './Board';

const UPDATE_BOARD_MUTATION = gql`
  mutation UPDATE_BOARD_MUTATION(
    $id: Int!
    $title: String
    $description: String
    $event: Int!
  ) {
    updateBoard(
      id: $id
      title: $title
      description: $description
      event: $event
    ) {
      id
      title
    }
  }
`;

class UpdateBoard extends React.Component {
  state = {};

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <Query query={SINGLE_BOARD_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <Error error={error} />;
          const { board } = data;
          return (
            <Mutation
              mutation={UPDATE_BOARD_MUTATION}
              variables={{
                ...this.state,
                id: this.props.id,
                event: this.props.event
              }}
              refetchQueries={[
                {
                  query: SINGLE_EVENT_QUERY,
                  variables: {
                    id: this.props.event
                  }
                },
                {
                  query: SINGLE_BOARD_QUERY,
                  variables: {
                    id: this.props.id
                  }
                }
              ]}
            >
              {(updateBoard, { loading, error }) => (
                <Form
                  onSubmit={async e => {
                    e.preventDefault();
                    const res = await updateBoard();
                    Router.push({
                      pathname: '/manage',
                      query: {
                        id: this.props.event
                      }
                    });
                  }}
                >
                  <fieldset disabled={loading} aria-busy={loading}>
                    <h2>Update {board.title}</h2>
                    <Error error={error} />
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Enter a title"
                        defaultValue={board.title}
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
                        defaultValue={board.description}
                        onChange={this.handleChange}
                      />
                    </label>
                    <Button type="submit">Update ✌</Button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

UpdateBoard.propTypes = {
  id: PropTypes.string.isRequired
};

export default UpdateBoard;
