import React, { Component } from 'react';
import Modal from 'react-modal';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import CreateList from './CreateList';

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

const BoardContainer = styled.section`
  display: flex;
  flex: 1 1;
`;

const AddListButton = styled.button`
  width: 15rem;
  height: 5rem;
  font-size: inherit;
  background-color: ${props => props.theme.paleOrange};
  border: none;
  border-radius: 3px;
  position: relative;
  cursor: pointer;
  outline: none;
  margin-left: 1rem;

  &::after {
    position: absolute;
    display: inline-block;
    content: '';
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    border: none;
    border-radius: 4px;
    transition: all 0.4s;
  }

  &:hover {
    &::after {
      z-index: 999;
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
`;

const ListsContainer = styled.div`
  display: grid;
  grid-auto-columns: 27rem;
  grid-auto-flow: column;
  grid-column-gap: 1rem;
  padding: 0 0.8rem 0.8rem;
  overflow-x: auto;
  height: calc(100vh - 8.6rem);

  &::-webkit-scrollbar {
    height: 2.4rem;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #66a3c7;
    border: 0.8rem solid #0079bf;
    border-top-width: 0;
  }
`;

const List = styled.div`
  display: grid;
  grid-template-rows: auto minmax(auto, 1fr) auto;
  background-color: ${props => props.theme.paleOrange};
  margin: 0;
  max-height: calc(100vh - 11.8rem);
  border-radius: 0.3rem;
  margin-right: 1rem;

  & h3 {
    font-size: 1.4rem;
    font-weight: 700;
    color: #333;
    padding: 1rem;
  }
`;

const CardsContainer = styled.ul`
  /* display: grid;
  grid-row-gap: 0.6rem; */
  padding: 0 0.6rem 0.5rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 1.2rem;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c4c9cc;
  }
`;

const Card = styled.li`
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.3;
  background-color: #fff;
  padding: 0.65rem 0.6rem;
  color: #4d4d4d;
  border-bottom: 0.1rem solid #ccc;
  border-radius: 0.3rem;
  margin-bottom: 0.6rem;
  word-wrap: break-word;
  cursor: pointer;
  margin: 0;
  margin-bottom: 0;

  &:hover {
    background-color: #eee;
  }

  &:not(:last-child) {
    margin-bottom: 0.6rem;
  }
`;

const SINGLE_BOARD_QUERY = gql`
  query SINGLE_BOARD_QUERY($id: Int!) {
    board(where: { id: $id }) {
      id
      description
      lists {
        id
        title
        description
        cards {
          id
          title
          description
          order
        }
      }
      title
    }
  }
`;

Modal.setAppElement('#__next');

class Board extends Component {
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
      <Query query={SINGLE_BOARD_QUERY} variables={{ id: this.props.board }}>
        {({ data: { board }, loading, error }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>Loading...</p>;
          return (
            <>
              <BoardContainer>
                <ListsContainer>
                  {board.lists.map(list => (
                    <List key={list.id}>
                      <h3>{list.title}</h3>
                      <CardsContainer>
                        {list.cards.map(card => (
                          <Card key={card.id}>{card.title}</Card>
                        ))}
                      </CardsContainer>
                    </List>
                  ))}
                </ListsContainer>
                <AddListButton onClick={this.openModal}>Add List</AddListButton>
              </BoardContainer>
              <Modal
                isOpen={this.state.modalIsOpen}
                style={customStyles}
                onRequestClose={this.closeModal}
                contentLabel="Create New List"
              >
                <CreateList event={this.props.event} board={this.props.board} />
              </Modal>
            </>
          );
        }}
      </Query>
    );
  }
}

export default Board;
export { SINGLE_BOARD_QUERY };
