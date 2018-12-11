import styled from 'styled-components';

const Form = styled.form`
  width: 100%;
  padding: 5rem 7rem;
  margin: 0 auto;

  fieldset {
    background: ${props => props.theme.offWhite};
    border: 2px solid ${props => props.theme.black};
    border-radius: 3px;
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0;

    h2 {
      text-align: center;
      transition: all 0.2s ease-out;

      &:hover {
        transform: scale(1.1) skewY(-3deg) translateY(-5px);
        color: ${props => props.theme.rose};
        text-shadow: 2px 4px 2rem rgba(0, 0, 0, 0.3);
      }
    }

    label {
      flex: 1 1 auto;
      font-weight: 500;
      font-size: 1.7rem;
      margin: 2.5rem;

      &:not(:last-child) {
        margin-bottom: 2rem;
      }
    }

    input,
    textarea {
      display: block;
      margin: 0 auto;
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
`;

export default Form;
