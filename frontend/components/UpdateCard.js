import React from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Error from './Error';
import Form from './styles/Form';
import Button from './styles/Button';
import { SINGLE_CARD_QUERY } from './SingleCard';

const UPDATE_CARD_MUTATION = gql`
  mutation UPDATE_CARD_MUTATION(
    $title: String
    $description: String
    $event: Int!
    $id: Int!
  ) {
    updateCard(
      title: $title
      description: $description
      event: $event
      id: $id
    ) {
      id
    }
  }
`;

class UpdateCard extends React.Component {
  state = {};

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <Query query={SINGLE_CARD_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (!data.card) return <p>No Card Of ID {this.props.id}</p>;
          return (
            <Mutation
              mutation={UPDATE_CARD_MUTATION}
              variables={{
                ...this.state,
                event: this.props.event,
                id: this.props.id
              }}
              refetchQueries={[
                { query: SINGLE_CARD_QUERY, variables: { id: this.props.id } }
              ]}
            >
              {(updateCard, { loading, error }) => (
                <Form
                  onSubmit={async e => {
                    e.preventDefault();
                    const res = await updateCard();

                    Router.back();
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
                        defaultValue={data.card.title}
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
                        defaultValue={data.card.description}
                        onChange={this.handleChange}
                      />
                    </label>
                    <Button type="submit">Update</Button>
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

export default UpdateCard;
