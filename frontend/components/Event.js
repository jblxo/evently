import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import formatMoney from '../lib/formatMoney';
import EventStyles from './styles/EventStyles';
import Title from './styles/Title';
import EntranceTag from './styles/EntranceTag';
import User from './User';

class Event extends Component {
  render() {
    const { event } = this.props;
    return (
      <User>
        {({ data: { me } }) => (
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
                eventAdmin => eventAdmin.event.id === event.id
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
                  <button>Join the Event!</button>
                </div>
              )}
          </EventStyles>
        )}
      </User>
    );
  }
}

Event.propTypes = {
  event: PropTypes.object.isRequired
};

export default Event;
