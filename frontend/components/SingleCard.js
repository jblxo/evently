import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import CardStyles from './styles/CardStyles';
import Title from './styles/Title';
import ButtonSmall from './styles/ButtonSmall';
import { SINGLE_BOARD_QUERY } from './Board';

const SINGLE_CARD_QUERY = gql`
  query SINGLE_CARD_QUERY($id: Int!) {
    card(where: { id: $id }) {
      id
      title
      description
      order
      user {
        id
        username
      }
    }
  }
`;

const DELETE_CARD_MUTATION = gql`
  mutation DELETE_CARD_MUTATION($id: Int!, $event: Int!, $list: Int!) {
    deleteCard(id: $id, event: $event, list: $list) {
      id
    }
  }
`;

const DeleteCardButton = styled.button`
  font-family: inherit;
  display: block;
  margin: 0.7rem auto;
  border-radius: 3px;
  padding: 1rem 2.5rem;
  text-align: center;
  color: ${props => props.theme.offWhite};
  cursor: pointer;
  background-color: ${props => props.theme.ocean};
  border: none;
`;

class SingleCard extends Component {
  render() {
    return (
      <Query query={SINGLE_CARD_QUERY} variables={{ id: this.props.id }}>
        {({ data: { card }, loading, error }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <Error error={error} />;
          return (
            <Mutation
              mutation={DELETE_CARD_MUTATION}
              variables={{
                id: card.id,
                event: this.props.event,
                list: this.props.list
              }}
              refetchQueries={[
                {
                  query: SINGLE_BOARD_QUERY,
                  variables: { id: this.props.board }
                }
              ]}
            >
              {(deleteCard, { lodaing, error }) => (
                <CardStyles>
                  <Title>{card.title}</Title>
                  <DeleteCardButton
                    onClick={async () => {
                      await deleteCard();
                      Router.back();
                    }}
                  >
                    ❌
                  </DeleteCardButton>
                  <h4>Description</h4>
                  {card.description.length > 0 ? (
                    <p>{card.description}</p>
                  ) : (
                    <p>No Description 😓.</p>
                  )}
                  <h4>Creator</h4>
                  {card.user.username && (
                    <Link
                      href={{ pathname: '/user', query: { id: card.user.id } }}
                    >
                      <a>
                        <ButtonSmall>{card.user.username}</ButtonSmall>
                      </a>
                    </Link>
                  )}
                </CardStyles>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default SingleCard;
