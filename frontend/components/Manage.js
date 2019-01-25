import React, { Component } from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import { SINGLE_EVENT_QUERY } from './SingleEvent';
import Error from './Error';
import Title from './styles/Title';

const Management = styled.div`
  margin: 5rem auto;
  width: 100%;
  border-radius: 3px;
  background-color: ${props => props.theme.softOcean};
`;

const Event = styled.span`
  color: ${props => props.theme.rose};
  transition: transfrom 0.3s ease;
  &:hover {
    transform: skewX(-3deg);
  }
`;

class Manage extends Component {
  render() {
    return (
      <Query query={SINGLE_EVENT_QUERY} variables={{ id: this.props.id }}>
        {({ data, error, loading }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>Loading</p>;
          const { event } = data;
          return (
            <Management>
              <Title>
                Manage Event <Event>{event.title}</Event>
              </Title>
            </Management>
          );
        }}
      </Query>
    );
  }
}

export default Manage;
