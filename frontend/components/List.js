import React, { Component } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import CreateCard from './CreateCard';
import Card from './Card';

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

const ListStyles = styled.div`
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
  padding: 0 0.6rem 0.5rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 1.2rem;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c4c9cc;
  }
`;

const AddCardButton = styled.button`
  font-family: inherit;
  cursor: pointer;
  width: 100%;
  margin: 0;
  display: block;
  border: none;
  background-color: ${props => props.theme.darkGreen};
  color: #fff;
  padding: 0.65rem 0.6rem;
  border-radius: 3px;
  position: relative;
  outline: none;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    width: 100%;
    height: 100%;
    transition: all 0.2s;
  }

  &:hover {
    &::after {
      z-index: 999;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
`;

class List extends Component {
  state = {
    modalIsOpen: false
  };

  openModal = listId => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  render() {
    const { list } = this.props;
    return (
      <ListStyles>
        <h3>{list.title}</h3>
        <CardsContainer>
          {list.cards.map(card => (
            <Card key={card.id} card={card} />
          ))}

          <AddCardButton onClick={this.openModal}>Add New Card!</AddCardButton>
        </CardsContainer>
        <Modal
          isOpen={this.state.modalIsOpen}
          style={customStyles}
          onRequestClose={this.closeModal}
          contentLabel="Create New Card"
        >
          <CreateCard
            event={this.props.event}
            list={list.id}
            board={this.props.board}
          />
        </Modal>
      </ListStyles>
    );
  }
}

export default List;
