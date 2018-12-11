import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Link from 'next/link';
import Router from 'next/router';
import User from './User';
import Button from './styles/Button';

const USER_QUERY = gql`
  query USER_QUERY($id: Int!) {
    user(where: { id: $id }) {
      id
      firstName
      lastName
      username
      email
      eventAdmins {
        event {
          id
          title
        }
        permission {
          name
        }
      }
    }
  }
`;

const AccountStyles = styled.div`
  width: 100%;
  margin: 5rem auto;
  padding: 4rem;
  border: 2px solid ${props => props.theme.rose};
  border-radius: 3px;
  background-color: ${props => props.theme.offWhite};

  .AccountStyles__info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: nowrap;
    align-items: baseline;
    vertical-align: middle;
  }

  .AccountStyles__events {
    div {
      margin-left: 3rem;
    }
  }
`;

class Account extends Component {
  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <Query
            query={USER_QUERY}
            variables={{
              id: this.props.id
            }}
          >
            {({ data, error, loading }) => {
              if (error) return <Error error={error} />;
              if (loading) return <p>Loading...</p>;
              if (!data.user)
                return (
                  <AccountStyles>
                    <div className="AccountStyles__info">
                      <p>Sorry! 😓 No user for ID {this.props.id}</p>
                    </div>
                  </AccountStyles>
                );
              return (
                <AccountStyles>
                  <div className="AccountStyles__info">
                    <h2>Username</h2>
                    <p>{data.user.username}</p>
                  </div>
                  <div className="AccountStyles__info">
                    <h2>Full Name</h2>
                    <p>{`${data.user.firstName} ${me.lastName}`}</p>
                  </div>
                  <div className="AccountStyles__info">
                    <h2>Email</h2>
                    <p>{data.user.email}</p>
                  </div>
                  {data.user.eventAdmins.length > 0 ? (
                    <div className="AccountStyles__events">
                      <h2>Your Events</h2>
                      {data.user.eventAdmins.map(({ event: { id, title } }) => (
                        <div key={id}>
                          <Link href={`/event?id=${id}`}>
                            <a>
                              <h3>{title}</h3>
                            </a>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <h2>You are not part of any events!</h2>
                  )}
                  {me.id === data.user.id && (
                    <Button
                      onClick={e => {
                        Router.push({
                          pathname: '/updateUser',
                          query: { id: me.id }
                        });
                      }}
                    >
                      Update! 🖋
                    </Button>
                  )}
                </AccountStyles>
              );
            }}
          </Query>
        )}
      </User>
    );
  }
}

export default Account;
