import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Draggable } from 'react-beautiful-dnd';

const CardStyles = styled.li`
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.3;
  background-color: #fff;
  padding: 0.65rem 0.6rem;
  color: #4d4d4d;
  border-bottom: 0.1rem solid #ccc;
  border-radius: 0.3rem;
  margin-bottom: 0;
  word-wrap: break-word;
  cursor: pointer;
  margin: 0;
  margin-bottom: 0;
  list-style: none;

  &:hover {
    background-color: #eee;
  }

  &:not(:last-child) {
    margin-bottom: 0.6rem;
  }
`;

const Card = ({ card, event, board, index, list }) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {provided => (
        <Link
          href={{
            pathname: '/card',
            query: { card: card.id, event: event, board: board, list: list }
          }}
        >
          <CardStyles
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <a>{card.title}</a>
          </CardStyles>
        </Link>
      )}
    </Draggable>
  );
};

export default Card;
