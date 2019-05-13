import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import SelectAdmin from './SelectAdmin';
import CardStyles from './styles/CardStyles';
import Title from './styles/Title';
import ButtonSmall from './styles/ButtonSmall';
import { SINGLE_BOARD_QUERY } from './Board';
import ButtonList from './styles/ButtonList';
import CardButton from './styles/CardButton';
import User from './User';

const SelectAdminContainer = styled.div`
  margin-top: 3.5rem;
`;

const SINGLE_CARD_QUERY = gql`
  query SINGLE_CARD_QUERY($id: Int!, $user: Int!) {
    card(where: { id: $id }) {
      id
      title
      description
      order
      user {
        id
        username
      }
      assignedUser {
        id
        username
      }
      cardNotificationAlerts(where: { user: { id: $user } }) {
        id
      }
    }
  }
`;

const DELETE_CARD_MUTATION = gql`
  mutation DELETE_CARD_MUTATION($id: Int!, $event: Int!, $list: Int!) {
    deleteCard(id: $id, event: $event, list: $list) {
      id
      order
    }
  }
`;

const CHANGE_NOTIFICATION_ALERT_MUTATION = gql`
  mutation CHANGE_NOTIFICATION_ALERT_MUTATION($user: Int!, $card: Int!) {
    changeCardNotificationAlert(user: $user, card: $card) {
      message
    }
  }
`;

class SingleCard extends Component {
  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <Query
            query={SINGLE_CARD_QUERY}
            variables={{ id: this.props.id, user: me.id }}
          >
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
                    <Mutation
                      mutation={CHANGE_NOTIFICATION_ALERT_MUTATION}
                      variables={{ user: me.id, card: card.id }}
                      refetchQueries={[
                        {
                          query: SINGLE_CARD_QUERY,
                          variables: { id: this.props.id, user: me.id }
                        }
                      ]}
                    >
                      {(changeCardNotificationAlert, { loading, error }) => (
                        <CardStyles>
                          <Title>{card.title}</Title>
                          <ButtonList>
                            <CardButton
                              onClick={async () => {
                                await deleteCard();
                                Router.back();
                              }}
                            >
                              ❌
                            </CardButton>
                            <CardButton
                              onClick={() => {
                                Router.push({
                                  pathname: '/updateCard',
                                  query: {
                                    id: card.id,
                                    event: this.props.event
                                  }
                                });
                              }}
                            >
                              Edit
                            </CardButton>
                          </ButtonList>
                          <h4>Description</h4>
                          {card.description.length > 0 ? (
                            <p>{card.description}</p>
                          ) : (
                            <p>No Description 😓.</p>
                          )}
                          <h4>Notify me</h4>
                          {card.cardNotificationAlerts.length > 0 ? (
                            <input
                              onChange={async () => {
                                await changeCardNotificationAlert();
                              }}
                              disabled={loading}
                              type="checkbox"
                              checked
                            />
                          ) : (
                            <input
                              onChange={async () => {
                                await changeCardNotificationAlert();
                              }}
                              disabled={loading}
                              type="checkbox"
                            />
                          )}
                          <h4>Creator</h4>
                          {card.user.username && (
                            <Link
                              href={{
                                pathname: '/user',
                                query: { id: card.user.id }
                              }}
                            >
                              <a>
                                <ButtonSmall>{card.user.username}</ButtonSmall>
                              </a>
                            </Link>
                          )}
                          <h4>Assigned Admin</h4>
                          {card.assignedUser && (
                            <Link
                              href={{
                                pathname: '/user',
                                query: { id: card.assignedUser.id }
                              }}
                            >
                              <a>
                                <ButtonSmall>
                                  {card.assignedUser.username}
                                </ButtonSmall>
                              </a>
                            </Link>
                          )}
                          <SelectAdminContainer>
                            <SelectAdmin
                              id={this.props.event}
                              card={this.props.id}
                              user={me.id}
                            />
                          </SelectAdminContainer>
                        </CardStyles>
                      )}
                    </Mutation>
                  )}
                </Mutation>
              );
            }}
          </Query>
        )}
      </User>
    );
  }
}

export default SingleCard;
export { SINGLE_CARD_QUERY };
