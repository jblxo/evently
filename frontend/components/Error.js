import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ErrorStyles = styled.div`
  border-right: 1rem solid ${props => props.theme.rose};
  border-left: 1rem solid ${props => props.theme.paleOrange};
  font-size: 1.7rem;
  margin: 2rem 0;
  background-color: ${props => props.theme.offWhite};
  padding: 1.5rem 2.5rem;

  strong {
    margin-right: 1.5rem;
  }

  p {
    margin: 0;
    font-weight: 100;
  }
`;

const DisplayError = ({ error }) => {
  if (!error && !error.message) return null;
  if (
    error.networkError &&
    error.networkError.result &&
    error.networkError.result.errors.length
  ) {
    return error.networkError.result.errors.map((error, i) => (
      <ErrorStyles key={i}>
        <p data-test="graphql-error">
          <strong>Whooops!</strong>
          {error.message.replace('GraphQL error: ', '')}
        </p>
      </ErrorStyles>
    ));
  }
  return (
    <ErrorStyles>
      <p data-test="graphql-error">
        <strong>Whooops!</strong>
        {error.message.replace('GraphQL error: ', '')}
      </p>
    </ErrorStyles>
  );
};

DisplayError.defaultProps = {
  error: ''
};

DisplayError.propTypes = {
  error: PropTypes.object
};

export default DisplayError;
