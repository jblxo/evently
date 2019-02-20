import React, { Component } from 'react';
import Link from 'next/link';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import CardStyles from './styles/CardStyles';
import Title from './styles/Title';
import ButtonSmall from './styles/ButtonSmall';

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

class SingleCard extends Component {
  render() {
    return (
      <Query query={SINGLE_CARD_QUERY} variables={{ id: this.props.id }}>
        {({ data: { card }, loading, error }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <Error error={error} />;
          return (
            <CardStyles>
              <Title>{card.title}</Title>
              <h4>Description</h4>
              {card.description.length > 0 ? (
                <p>{card.description}</p>
              ) : (
                <p>No Description 😓.</p>
              )}
              <h4>Creator</h4>
              {card.user.username && (
                <Link href={{ pathname: '/user', query: { id: card.user.id } }}>
                  <a>
                    <ButtonSmall>{card.user.username}</ButtonSmall>
                  </a>
                </Link>
              )}
            </CardStyles>
          );
        }}
      </Query>
    );
  }
}

export default SingleCard;
