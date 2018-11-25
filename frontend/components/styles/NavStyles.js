import styled from 'styled-components';

const NavStyles = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  justify-self: end;
  background-color: ${props => props.theme.softGreen};
  a,
  button {
    position: relative;
    display: block;
    padding: 1rem 2rem;
    text-decoration: none;
    color: ${props => props.theme.offWhite};
    cursor: pointer;
    transition: all 0.3s;

    &:not(:last-child) {
      margin-right: 2rem;
    }

    &:hover {
      background-color: ${props => props.theme.offWhite};
      transform: skewY(-3deg);
      color: ${props => props.theme.black};
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
