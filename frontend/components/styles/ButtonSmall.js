import styled from 'styled-components';

const Button = styled.button`
  border: none;
  background: ${props => props.theme.darkGreen};
  font-family: inherit;
  padding: 1rem 1.5rem;
  margin-top: 1rem;
  border-radius: 3px;
  font-weight: 300;
  font-size: 1rem;
  text-transform: uppercase;
  color: ${props => props.theme.offWhite};
`;

export default Button;
