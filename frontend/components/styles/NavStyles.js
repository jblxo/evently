import styled from 'styled-components';

const NavStyles = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  justify-self: end;
  background-color: ${props => props.theme.darkGreen};
  flex-direction: row-reverse;
  position: fixed;
  width: 100%;

  a,
  button {
    border: none;
    background: none;
    font-family: inherit;
    font-size: inherit;
    font-weight: 400;
    position: relative;
    display: block;
    padding: 1rem 2rem;
    text-decoration: none;
    color: ${props => props.theme.black};
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: ${props => props.theme.ocean};
      transform: skewY(-3deg);
      color: ${props => props.theme.paleOrange};
    }

    &:after {
      content: '';
      position: absolute;
      width: 1rem;
      height: 100%;
      color: white;
    }
  }
`;

export default NavStyles;
