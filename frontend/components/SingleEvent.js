import React, { Component } from 'react';
import moment from 'moment';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';
import styled from 'styled-components';
import User from './User';
import Error from './Error';
import Title from './styles/Title';
import CheckPermissions from './CheckPermissions';
import ButtonSmall from './styles/ButtonSmall';
import uniqueUserArr from '../lib/uniqueUserArr';

const SINGLE_EVENT_QUERY = gql`
  query SINGLE_EVENT_QUERY($id: Int!) {
    event(where: { id: $id }) {
      id
      address1
      address2
      address3
      boards {
        id
        title
      }
      city
      comments {
        id
        user {
          id
        }
        content
      }
      country
      createdAt
      description
      entranceTax
      eventAdmins {
        user {
          id
          username
          firstName
          lastName
        }
        permission {
          name
        }
      }
      eventDate
      expenses {
        id
        amount
      }
      imageLarge
      reviews {
        rating
        user {
          id
        }
      }
      state
      title
      zip
    }
  }
`;

const Event = styled.div`
  width: 75%;
  background-color: ${props => props.theme.offWhite};
  margin: 0 auto;
  padding: 7rem;
  border-radius: 3px;
  box-shadow: ${props => props.theme.boxShadow};

  img {
    width: 100%;
  }

  h4 {
    display: block;
    width: 100%;
    border-bottom: 1px solid ${props => props.theme.black};
  }

  p {
    font-size: 1.7rem;
    font-weight: 500;
  }

  .event__admins {
    a {
      background-color: ${props => props.theme.darkGreen};
      padding: 5px;
      color: white;

      &:not(:last-child) {
        margin-right: 0.5rem;
      }
    }
  }
`;

class SingleEvent extends Component {
  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <Query query={SINGLE_EVENT_QUERY} variables={{ id: this.props.id }}>
            {({ data, error, loading }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <Error error={error} />;
              const { event } = data;
              const uniqueAdmins = uniqueUserArr(event.eventAdmins);
              return (
                <Event>
                  <Title>
                    <a>{event.title}</a>
                  </Title>
                  <img src={event.imageLarge} alt={event.title} />
                  <h4>Description</h4>
                  <p>{event.description}</p>
                  <h4>Created</h4>
                  <p>
                    {moment(event.createdAt)
                      .utc()
                      .format('DD.MM.YYYY')}
                  </p>
                  <h4>When?</h4>
                  <p>
                    {moment(event.eventDate)
                      .utc()
                      .format('DD.MM.YYYY HH:mm')}
                  </p>
                  <h4>Address</h4>
                  <ul>
                    <li>{event.address1}</li>
                    {event.address2 && <li>{event.address2}</li>}
                    {event.address3 && <li>{event.address3}</li>}
                    <li>{event.city}</li>
                    <li>{event.state}</li>
                    <li>{event.country}</li>
                    <li>{event.zip}</li>
                  </ul>
                  <div className="event__admins">
                    <h4>Admins</h4>
                    {uniqueAdmins.map(user => (
                      <Link
                        href={{
                          pathname: '/user',
                          query: { id: user.id }
                        }}
                        key={user.id}
                      >
                        <a>{user.username}</a>
                      </Link>
                    ))}
                  </div>
                  <div>
                    <CheckPermissions
                      id={event.id}
                      permissions={['ADMIN', 'PERMISSIONUPDATE']}
                      prePage={false}
                    >
                      <Link
                        href={{
                          pathname: '/updatePermissions',
                          query: { id: event.id }
                        }}
                      >
                        <a>
                          <ButtonSmall className="btn--small">
                            Update!
                          </ButtonSmall>
                        </a>
                      </Link>
                    </CheckPermissions>
                  </div>
                </Event>
              );
            }}
          </Query>
        )}
      </User>
    );
  }
}

export default SingleEvent;
export { SINGLE_EVENT_QUERY };
