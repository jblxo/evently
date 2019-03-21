import styled from 'styled-components';

const CardButton = styled.button`
  font-family: inherit;
  display: block;
  margin: 0.7rem;
  border-radius: 3px;
  padding: 1rem 2.5rem;
  text-align: center;
  color: ${props => props.theme.offWhite};
  cursor: pointer;
  background-color: ${props => props.theme.ocean};
  border: none;
`;

export default CardButton;
