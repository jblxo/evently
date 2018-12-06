import styled from 'styled-components';

const Form = styled.form`
  width: 100%;
  padding: 5rem 7rem;

  fieldset {
    border: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0;
    padding: 0;

    label {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      &:not(:last-child) {
        margin-bottom: 2rem;
      }
      input {
        padding: 3px;
        font-size: 1.5rem;
      }
    }
  }
`;

export default Form;
