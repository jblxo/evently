import styled from 'styled-components';

const Title = styled.h3`
  margin: 0 auto;
  text-align: center;
  font-weight: 500;
  a {
    background: ${props => props.theme.darkGreen};
    display: inline;
    line-height: 1.5;
    font-size: 3rem;
    text-align: center;
    color: white;
    padding: 0 1rem;
  }
`;

export default Title;
