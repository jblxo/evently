import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { perPage } from '../config';
import Error from './Error';
import Pagination from './Pagination';
import Event from './Event';

const ALL_EVENTS_QUERY = gql`
  query ALL_EVENTS_QUERY(
    $skip: Int = 0, $first: Int = ${perPage}
  ) {
    events(skip: $skip, first: $first, orderBy: createdAt_DESC) {
      id
      title
      description
      createdAt
      entranceTax
      imageSmall
      imageLarge
    }
  }
`;

const Center = styled.div`
  text-align: center;
  margin-top: 5rem;
`;

const EventsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 6rem;
  max-width: ${props => props.theme.maxWidth};
  margin: 3rem auto;
`;

class Events extends Component {
  render() {
    return (
      <Center>
        <Query
          query={ALL_EVENTS_QUERY}
          variables={{ skip: this.props.page * perPage - perPage }}
        >
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <Error error={error} />;
            if (data.events.length < 1)
              return <p>Sorry, we currently register no events 😓</p>;

            return (
              <div>
                <Pagination page={this.props.page} />
                <EventsList>
                  {data.events.map(event => (
                    <Event key={event.id} event={event} />
                  ))}
                </EventsList>
                <Pagination page={this.props.page} />
              </div>
            );
          }}
        </Query>
      </Center>
    );
  }
}

export default Events;
