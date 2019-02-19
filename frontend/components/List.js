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
  position: absolute;
  background-color: white;
  border: 2px solid ${props => props => props.theme.softOcean};
  border-radius: 3px;
  margin: 1.2rem 0;
  width: 80%;
  overflow: hidden;
  display: block;
  visibility: ${props => (props.isEditing ? 'visible' : 'hidden')};
  outline: none;
  resize: none;
  font-size: 1.4rem;
  font-weight: 700;
  padding: 1rem;
  font-family: inherit;
  line-height: inherit;
  margin-left: 1rem;
  height: 5.2rem;
`;

const ListStyles = styled.div`
  display: grid;
  position: relative;
  grid-template-rows: minmax(auto, 7.6rem) minmax(auto, 1fr) auto;
  background-color: ${props => props.theme.paleOrange};
  margin: 0;
  max-height: calc(100vh - 11.8rem);
  border-radius: 0.3rem;
  margin-right: 1rem;
`;

const ListHeading = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  display: block;
  visibility: ${props => (props.isEditing ? 'hidden' : 'visible')};
  padding: 1rem 1rem;
  border: 2px solid transparent;
  width: 80%;
  margin: 1.2rem 0 1.2rem 1rem;
  white-space: pre-wrap;
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
    title: this.props.list.title
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    this.wrapperRef.addEventListener('input', this.autoResize, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    this.wrapperRef.removeEventListener('input', this.autoResize, false);
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  handleClickOutside = async e => {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      if (this.state.title !== '' && this.state.isEditing) {
        await this.props.setTitle(this.state.title);
        await this.props.updateList();
      }
      this.setState({ isEditing: false, title: this.props.list.title });
    }
  };

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  autoResize = () => {
    this.wrapperRef.style.height = '5.2rem';
    this.wrapperRef.style.height = this.wrapperRef.scrollHeight + 'px';
    this.listTitle.style.height = this.wrapperRef.style.height;
    this.wrapperRef.scrollTop = this.wrapperRef.scrollHeight;
  };

  render() {
    const { list, error, loading } = this.props;
    return (
      <ListStyles>
        <ListHeading
          ref={node => (this.listTitle = node)}
          onClick={() => {
            this.setState({ isEditing: true });
          }}
          isEditing={this.state.isEditing}
        >
          {list.title}
        </ListHeading>
        <Error error={error} />
        <EditNameInput
          ref={this.setWrapperRef}
          rows={this.state.rows}
          cols="50"
          name="title"
          isEditing={this.state.isEditing}
          value={this.state.title}
          onChange={this.handleChange}
        />
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

class MutationHelper extends Component {
  state = {
    title: this.props.list.title
  };

  setTitle = async title => {
    this.setState({ title });
  };

  render() {
    return (
      <Mutation
        mutation={UPDATE_LIST_MUTATION}
        variables={{
          id: this.props.list.id,
          title: this.state.title,
          event: this.props.event
        }}
        refetchQueries={[
          { query: SINGLE_BOARD_QUERY, variables: { id: this.props.board } }
        ]}
      >
        {(updateList, { loading, error }) => (
          <List
            updateList={updateList}
            loading={loading}
            error={error}
            setTitle={this.setTitle}
            {...this.props}
          />
        )}
      </Mutation>
    );
  }
}

export default MutationHelper;
