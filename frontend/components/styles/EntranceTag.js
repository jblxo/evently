import styled from 'styled-components';

const EntranceTag = styled.span`
  background: ${props => props.theme.darkGreen};
  transform: rotate(5deg);
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  padding: 7.5px;
  line-height: 1;
  display: inline-block;
  position: absolute;
  top: -3px;
  right: -3px;
`;

export default EntranceTag;
