import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './Error';
import Form from './styles/Form';
import Button from './styles/Button';
import { SINGLE_BOARD_QUERY } from './Board';

const CREATE_CARD_MUTATION = gql`
  mutation CREATE_CARD_MUTATION(
    $title: String!
    $description: String
    $event: Int!
    $list: Int!
  ) {
    addCard(
      title: $title
      description: $description
      event: $event
      list: $list
    ) {
      id
      title
      list {
        id
      }
    }
  }
`;

class CreateCard extends React.Component {
  state = {
    title: 'New Card',
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
        mutation={CREATE_CARD_MUTATION}
        variables={{
          ...this.state,
          event: this.props.event,
          list: this.props.list
        }}
        refetchQueries={[
          { query: SINGLE_BOARD_QUERY, variables: { id: this.props.board } }
        ]}
      >
        {(addList, { loading, error }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault();
              const res = await addList();
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Create New Card!</h2>
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

export default CreateCard;
