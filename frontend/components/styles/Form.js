import styled from 'styled-components';

const Form = styled.form`
  width: 100%;
  padding: 5rem 7rem;

  fieldset {
    background: ${props => props.theme.offWhite};
    border: 2px solid ${props => props.theme.black};
    border-radius: 3px;
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0;

    label {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-weight: 300;
      font-size: 1.7rem;
      &:not(:last-child) {
        margin-bottom: 3rem;
      }

      input,
      textarea {
        padding: 5px;
        font-size: 1.5rem;
        border: none;
        outline: none;
        border-radius: 3px;
        transition: border 0.1s ease;

        &:focus {
          border: 1px solid ${props => props.theme.rose};
          box-shadow: 0 0 5px ${props => props.theme.rose};
        }
      }
    }
  }
`;

export default Form;
