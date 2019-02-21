import React, { Component } from 'react';
import Modal from 'react-modal';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import CreateList from './CreateList';
import List from './List';

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
    background-color: ${props => props.theme.rose};
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
    addListModalIsOpen: false,
    selectedList: null
  };

  openAddListModal = () => {
    this.setState({ addListModalIsOpen: true });
  };

  closeAddListModal = () => {
    this.setState({ addListModalIsOpen: false });
  };

  onDragEnd = result => {
    // TODO: reorder our column
  };

  render() {
    return (
      <Query query={SINGLE_BOARD_QUERY} variables={{ id: this.props.board }}>
        {({ data: { board }, loading, error }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>Loading...</p>;
          return (
            <DragDropContext onDragEnd={this.onDragEnd}>
              <BoardContainer>
                <ListsContainer>
                  {board.lists.map(list => (
                    <List
                      key={list.id}
                      list={list}
                      board={this.props.board}
                      event={this.props.event}
                    />
                  ))}
                </ListsContainer>
                <AddListButton onClick={this.openAddListModal}>
                  Add List
                </AddListButton>
              </BoardContainer>
              <Modal
                isOpen={this.state.addListModalIsOpen}
                style={customStyles}
                onRequestClose={this.closeAddListModal}
                contentLabel="Create New List"
              >
                <CreateList event={this.props.event} board={this.props.board} />
              </Modal>
            </DragDropContext>
          );
        }}
      </Query>
    );
  }
}

export default Board;
export { SINGLE_BOARD_QUERY };
