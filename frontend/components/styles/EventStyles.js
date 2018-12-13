import styled from 'styled-components';

const EventStyles = styled.div`
  background: ${props => props.theme.offWhite};
  border: 1px solid ${props => props.theme.black};
  box-shadow: ${props => props.theme.boxShadow};
  position: relative;
  display: flex;
  flex-direction: column;
  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
  }

  p {
    font-size: 1.5rem;
    line-height: 2;
    font-weight: 400;
    flex-grow: 1;
    padding: 0 2.5rem;
  }

  .buttonList {
    display: grid;
    width: 100%;
    border-top: 1px solid ${props => props.theme.offWhite};
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    grid-gap: 1px;
    background: ${props => props.theme.offWhite};

    & > * {
      background: white;
      border: 0;
      font-size: 1rem;
      padding: 1rem;
    }
  }
`;

export default EventStyles;
