import styled from 'styled-components';

const ButtonList = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  grid-gap: 1px;
`;

export default ButtonList;
