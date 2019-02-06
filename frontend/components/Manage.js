import React, { Component } from 'react';
import Modal from 'react-modal';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import Link from 'next/link';
import { SINGLE_EVENT_QUERY } from './SingleEvent';
import Error from './Error';
import Title from './styles/Title';
import CreateBoard from './CreateBoard';

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

const Management = styled.div`
  margin-top: 5rem;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const SideNav = styled.nav`
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  a {
    margin: 0.3rem 0;
    display: block;
    padding: 0.5rem 2rem;
    border-radius: 3px;
    transition: all 0.2s ease-out;
    &:hover {
      background-color: ${props => props.theme.softOcean};
    }
  }
`;

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
  &::after {
    content: '';
    display: inline-block;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    transition: all 0.4s;
    position: absolute;
  }
  &:hover {
    &::after {
      background-color: rgba(0, 0, 0, 0.1);
      z-index: 999;
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
      <Query query={SINGLE_EVENT_QUERY} variables={{ id: this.props.id }}>
        {({ data, error, loading }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>Loading</p>;
          const { event } = data;
          return (
            <>
              <Title>Manage Event{event.title}</Title>
              <Management>
                <SideNav>
                  <a>🏠 Home</a>
                  <a>💳 Expenses</a>
                </SideNav>
                <BoardsContainer>
                  {event.boards.map(board => (
                    <Link
                      href={{
                        pathname: '/board',
                        query: { id: board.id }
                      }}
                    >
                      <a>
                        <Board key={board.id}>{board.title}</Board>
                      </a>
                    </Link>
                  ))}
                  <Board onClick={this.openModal}>Create New Board</Board>
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
    );
  }
}

export default Manage;
