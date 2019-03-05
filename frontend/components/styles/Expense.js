import styled from 'styled-components';

const Expense = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 3px;
  padding: 0.5rem 1rem;
  color: white;
  background-color: ${props => props.theme.softOcean};
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  text-decoration: none;

  p {
    margin: 0;
  }

  h3 {
    margin: 0;
    word-break: break-all;
  }

  &::after {
    content: '';
    display: inline-block;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    transition: all 0.3s ease;
    position: absolute;
  }
  &:hover {
    &::after {
      background-color: rgba(255, 255, 255, 0.2);
      z-index: 99;
    }
  }

  &:not(:last-child) {
    margin-bottom: 0.3rem;
  }
`;

export default Expense;
