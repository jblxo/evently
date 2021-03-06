import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';
import EventStyles from './styles/EventStyles';
import Title from './styles/Title';
import EntranceTag from './styles/EntranceTag';
import User from './User';

const DELETE_EVENT_MUTATION = gql`
  mutation DELETE_EVENT_MUTATION($id: Int!) {
    deleteEvent(id: $id) {
      id
    }
  }
`;

const Button = styled.button`
  cursor: pointer;
`;

class Event extends Component {
  render() {
    const { event } = this.props;
    return (
      <User>
        {({ data: { me } }) => (
          <Mutation
            mutation={DELETE_EVENT_MUTATION}
            variables={{ id: event.id }}
          >
            {(deleteEvent, { error, loading }) => (
              <EventStyles>
                {event.imageSmall && (
                  <img src={event.imageSmall} alt={event.title} />
                )}
                <Title>
                  <Link
                    href={{
                      pathname: '/event',
                      query: { id: event.id }
                    }}
                  >
                    <a>{event.title}</a>
                  </Link>
                </Title>
                <EntranceTag>{formatMoney(event.entranceTax)}</EntranceTag>
                <p>{event.description}</p>
                {me &&
                  me.eventAdmins.filter(
                    eventAdmin =>
                      eventAdmin.event.id === event.id &&
                      eventAdmin.permission.name !== 'USER'
                  ).length > 0 && (
                    <div className="buttonList">
                      <Link
                        href={{
                          pathname: '/updateEvent',
                          query: { id: event.id }
                        }}
                      >
                        <a>Update 🖋</a>
                      </Link>
                      <Button onClick={deleteEvent}>Delete 😓</Button>
                    </div>
                  )}
              </EventStyles>
            )}
          </Mutation>
        )}
      </User>
    );
  }
}

Event.propTypes = {
  event: PropTypes.object.isRequired
};

export default Event;
