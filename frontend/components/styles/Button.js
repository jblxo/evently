import styled from 'styled-components';

const Button = styled.button`
  border: none;
  background: ${props => props.theme.darkGreen};
  font-family: inherit;
  padding: 1.5rem 2rem;
  margin-top: 2rem;
  border-radius: 3px;
  font-weight: 500;
  font-size: 1.5rem;
  text-transform: uppercase;
  transition: transform 0.3s ease;
  color: ${props => props.theme.offWhite};
  cursor: pointer;
  &:hover {
    transform: scale(1.2);
  }
`;

export default Button;
