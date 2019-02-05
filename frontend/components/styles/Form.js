import styled from 'styled-components';

const Form = styled.form`
  fieldset {
    background: ${props => props.theme.offWhite};
    border: 2px solid ${props => props.theme.black};
    border-radius: 3px;
    padding: 2.5rem;
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
      font-weight: 700;
      font-size: 1.2rem;
      margin-left: 1rem;
      margin-top: 0.7rem;
      display: block;
      transition: all 0.3s;

      &:not(:last-child) {
        margin-bottom: 2rem;
      }
    }

    input,
    textarea {
      color: inherit;
      display: block;
      width: 90%;
      margin: 0 auto;
      font-family: inherit;
      padding: 1.5rem 2rem;
      font-size: 1.5rem;
      border: none;
      border-bottom: 3px solid transparent;
      border-radius: 3px;
      transition: all 0.3s;

      &:focus {
        outline: none;
        border-bottom: 3px solid ${props => props.theme.rose};
        box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
        &:invalid {
          border-bottom: 3px solid ${props => props.theme.rose};
        }
      }
    }

    textarea {
      height: 5rem;
      resize: vertical;
    }
  }
`;

export default Form;
