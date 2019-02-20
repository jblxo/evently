import styled from 'styled-components';

const CardStyles = styled.div`
  background: ${props => props.theme.offWhite};
  width: 50%;
  margin: 0 auto;
  padding: 7rem;
  border-radius: 3px;
  box-shadow: ${props => props.theme.boxShadow};

  p {
    font-size: 1.4rem;
    line-height: 2;
    font-weight: 400;
    flex-grow: 1;
    padding: 0 2.5rem;
  }

  h4 {
    display: block;
    width: 100%;
    border-bottom: 1px solid ${props => props.theme.black};
  }
`;

export default CardStyles;
