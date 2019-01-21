import styled from 'styled-components';

const Dropdown = styled.div`
  position: relative;
  display: block;
  width: 100%;
  margin: 0;
`;

const DropdownInput = styled.input`
  display: block;
  width: 100%;
  margin: 5px;
  padding: 1rem;
  font-size: 1.7rem;
`;

const DropdownContent = styled.div`
  display: block;
  background-color: #f9f9f9;
  width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 12px 16px;
  z-index: 1;
  border: 2px solid
    ${props => (props.highlighted ? props.theme.paleOrange : 'white')};
  &:hover {
    background-color: ${props => props.theme.softOcean};
  }
`;

export { Dropdown, DropdownInput, DropdownContent };
