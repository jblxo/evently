import React, { Component } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import CreateCard from './CreateCard';
import Card from './Card';
import { SINGLE_BOARD_QUERY } from './Board';
import Error from './Error';

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

const EditNameInput = styled.textarea`
  background-color: ${props => (props.isEditing ? 'white' : 'transparent')};
  border: 2px solid
    ${props => (props.isEditing ? props.theme.softOcean : 'transparent')};
  height: ${props => props.height};
  border-radius: 3px;
  position: absolute;
  top: 2.4rem;
  left: 1rem;
  width: 80%;
  overflow: hidden;
  display: ${props => (props.isEditing ? 'block' : 'none')};
  outline: none;
  resize: none;
  font-size: 1.4rem;
  font-weight: 700;
  padding: 1rem;
`;

const ListStyles = styled.div`
  display: grid;
  position: relative;
  grid-template-rows: auto minmax(auto, 1fr) auto;
  background-color: ${props => props.theme.paleOrange};
  margin: 0;
  max-height: calc(100vh - 11.8rem);
  border-radius: 0.3rem;
  margin-right: 1rem;

  & h3 {
    font-size: 1.4rem;
    font-weight: 700;
    display: ${props => (props.isEditing ? 'none' : 'block')};
    padding: 1rem;
    width: 80%;
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

const UPDATE_LIST_MUTATION = gql`
  mutation UPDATE_LIST_MUTATION($id: Int!, $title: String!, $event: Int!) {
    updateList(id: $id, title: $title, event: $event) {
      title
      description
    }
  }
`;

class List extends Component {
  state = {
    modalIsOpen: false,
    isEditing: false,
    title: this.props.list.title,
    height: 0
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    const height = this.listTitle.clientHeight;
    this.setState({ height });
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  handleChange = async e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  handleClickOutside = e => {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.setState({ isEditing: false });
    }
  };

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  render() {
    const { list } = this.props;
    return (
      <Mutation
        mutation={UPDATE_LIST_MUTATION}
        variables={{
          id: list.id,
          title: this.state.title,
          event: this.props.event
        }}
        refetchQueries={[
          { query: SINGLE_BOARD_QUERY, variables: { id: this.props.board } }
        ]}
      >
        {(updateList, { loading, error }) => (
          <ListStyles>
            <h3
              ref={node => (this.listTitle = node)}
              onClick={() => {
                this.setState({ isEditing: true });
              }}
            >
              {list.title}
            </h3>
            <Error error={error} />
            <EditNameInput
              ref={this.setWrapperRef}
              height={`${this.state.height}px`}
              rows="1"
              cols="50"
              name="title"
              isEditing={this.state.isEditing}
              value={this.state.title}
              onChange={async e => {
                e.preventDefault();
                e.persist();
                await this.handleChange(e);
                if (this.state.isEditing) {
                  await updateList();
                }

                this.setState({ height: this.listTitle.style.height });
              }}
            />
            <CardsContainer>
              {list.cards.map(card => (
                <Card key={card.id} card={card} />
              ))}

              <AddCardButton onClick={this.openModal}>
                Add New Card!
              </AddCardButton>
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
        )}
      </Mutation>
    );
  }
}

export default List;