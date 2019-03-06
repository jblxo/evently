import React, { Component } from 'react';
import Modal from 'react-modal';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Link from 'next/link';
import { SINGLE_EVENT_QUERY } from './SingleEvent';
import Error from './Error';
import Title from './styles/Title';
import CreateBoard from './CreateBoard';
import ManageSideNav from './ManageSideNav';
import Management from './styles/Management';

const DELETE_BOARD_MUTATION = gql`
  mutation DELETE_BOARD_MUTATION($id: Int!, $event: Int!) {
    deleteBoard(id: $id, event: $event) {
      id
    }
  }
`;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    background: 'none',
    border: 'none',
    transform: 'translate(-50%, -50%)'
  }
};

const BoardsContainer = styled.div`
  width: 75%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  grid-auto-rows: minmax(90px, 1fr);
  margin-left: 40px;
`;

const Board = styled.div`
  border-radius: 3px;
  padding: 0.5rem 1rem;
  color: white;
  background-color: ${props => props.theme.paleOrange};
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  &::after {
    content: '';
    display: inline-block;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    transition: all 0.3s ease;
    position: absolute;
  }
  &:hover {
    &::after {
      background-color: rgba(0, 0, 0, 0.1);
      z-index: 99;
    }
  }
`;

const BoardContainer = styled.div`
  position: relative;
  width: 100%;

  &:hover .button {
    opacity: 1;
    z-index: 999;
  }
`;

const ButtonList = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 1rem;
  top: 1rem;

  .button {
    opacity: 0;
    text-align: center;
    transition: opacity 0.3s ease;
    background: transparent;
    border: none;
    padding: 0.5rem 1rem;
    transition: all 0.4s ease;
    color: ${props => props.theme.offWhite};
    cursor: pointer;
    border-radius: 3px;
    font-size: 1.2rem;

    &:not(:last-child) {
      margin-bottom: 0.4rem;
    }

    &:hover {
      background-color: ${props => props.theme.darkGreen};
    }
  }
`;

Modal.setAppElement('#__next');

class Manage extends Component {
  state = {
    modalIsOpen: false
  };

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  render() {
    return (
      <Mutation
        mutation={DELETE_BOARD_MUTATION}
        refetchQueries={[
          { query: SINGLE_EVENT_QUERY, variables: { id: this.props.id } }
        ]}
      >
        {(deleteBoard, { loading, error }) => (
          <Query query={SINGLE_EVENT_QUERY} variables={{ id: this.props.id }}>
            {({ data, error, loading }) => {
              if (error) return <Error error={error} />;
              if (loading) return <p>Loading</p>;
              const { event } = data;
              return (
                <>
                  <Title>Manage Event {event.title}</Title>
                  <Management>
                    <ManageSideNav id={this.props.id} />
                    <BoardsContainer>
                      {event.boards.map(board => (
                        <BoardContainer key={board.id}>
                          <Link
                            href={{
                              pathname: '/board',
                              query: { board: board.id, event: this.props.id }
                            }}
                          >
                            <a>
                              <Board>{board.title}</Board>
                            </a>
                          </Link>
                          <ButtonList>
                            <button
                              className="button"
                              onClick={async () => {
                                await deleteBoard({
                                  variables: {
                                    id: board.id,
                                    event: this.props.id
                                  }
                                });
                              }}
                            >
                              ❌
                            </button>
                            <Link
                              href={{
                                pathname: '/updateBoard',
                                query: {
                                  id: board.id,
                                  event: this.props.id
                                }
                              }}
                            >
                              <a className="button">Edit</a>
                            </Link>
                          </ButtonList>
                        </BoardContainer>
                      ))}
                      <BoardContainer>
                        <Board onClick={this.openModal}>Create New Board</Board>
                      </BoardContainer>
                    </BoardsContainer>
                  </Management>
                  <Modal
                    isOpen={this.state.modalIsOpen}
                    style={customStyles}
                    onRequestClose={this.closeModal}
                    contentLabel="Create New Board"
                  >
                    <CreateBoard id={this.props.id} />
                  </Modal>
                </>
              );
            }}
          </Query>
        )}
      </Mutation>
    );
  }
}

export default Manage;
