import React, { Component } from 'react';
import Header from './Header';
import Meta from './Meta';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

const theme = {
  maxWidth: '1000px',
  black: '#000',
  softLime: '#E9EFE1',
  offWhite: '#F2F2F2',
  paleOrange: '#F0D8CE',
  rose: '#EDA6A6',
  darkGreen: '#4A6146',
  ocean: '#60B89C',
  softOcean: '#9ED8C2',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
};

const StyledPage = styled.div`
  color: ${props => props.theme.black};
`;

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 5rem auto;
  padding: 2rem;
  color: ${props => props.theme.black};
`;

const GlobalStyle = createGlobalStyle`
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 300;
  src: url('../static/poppins-v5-latin-300.eot'); /* IE9 Compat Modes */
  src: local('Poppins Light'), local('Poppins-Light'),
       url('../static/poppins-v5-latin-300.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('../static/poppins-v5-latin-300.woff2') format('woff2'), /* Super Modern Browsers */
       url('../static/poppins-v5-latin-300.woff') format('woff'), /* Modern Browsers */
       url('../static/poppins-v5-latin-300.ttf') format('truetype'), /* Safari, Android, iOS */
       url('../static/poppins-v5-latin-300.svg#Poppins') format('svg'); /* Legacy iOS */
}
/* poppins-regular - latin */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  src: url('../static/poppins-v5-latin-regular.eot'); /* IE9 Compat Modes */
  src: local('Poppins Regular'), local('Poppins-Regular'),
       url('../static/poppins-v5-latin-regular.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('../static/poppins-v5-latin-regular.woff2') format('woff2'), /* Super Modern Browsers */
       url('../static/poppins-v5-latin-regular.woff') format('woff'), /* Modern Browsers */
       url('../static/poppins-v5-latin-regular.ttf') format('truetype'), /* Safari, Android, iOS */
       url('../static/poppins-v5-latin-regular.svg#Poppins') format('svg'); /* Legacy iOS */
}
/* poppins-500 - latin */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  src: url('../static/poppins-v5-latin-500.eot'); /* IE9 Compat Modes */
  src: local('Poppins Medium'), local('Poppins-Medium'),
       url('../static/poppins-v5-latin-500.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('../static/poppins-v5-latin-500.woff2') format('woff2'), /* Super Modern Browsers */
       url('../static/poppins-v5-latin-500.woff') format('woff'), /* Modern Browsers */
       url('../static/poppins-v5-latin-500.ttf') format('truetype'), /* Safari, Android, iOS */
       url('../static/poppins-v5-latin-500.svg#Poppins') format('svg'); /* Legacy iOS */
}
/* poppins-700 - latin */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  src: url('../static/poppins-v5-latin-700.eot'); /* IE9 Compat Modes */
  src: local('Poppins Bold'), local('Poppins-Bold'),
       url('../static/poppins-v5-latin-700.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('../static/poppins-v5-latin-700.woff2') format('woff2'), /* Super Modern Browsers */
       url('../static/poppins-v5-latin-700.woff') format('woff'), /* Modern Browsers */
       url('../static/poppins-v5-latin-700.ttf') format('truetype'), /* Safari, Android, iOS */
       url('../static/poppins-v5-latin-700.svg#Poppins') format('svg'); /* Legacy iOS */
}
/* poppins-900 - latin */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 900;
  src: url('../static/poppins-v5-latin-900.eot'); /* IE9 Compat Modes */
  src: local('Poppins Black'), local('Poppins-Black'),
       url('../static/poppins-v5-latin-900.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('../static/poppins-v5-latin-900.woff2') format('woff2'), /* Super Modern Browsers */
       url('../static/poppins-v5-latin-900.woff') format('woff'), /* Modern Browsers */
       url('../static/poppins-v5-latin-900.ttf') format('truetype'), /* Safari, Android, iOS */
       url('../static/poppins-v5-latin-900.svg#Poppins') format('svg'); /* Legacy iOS */
}

  html {
    box-sizing: border-box;
    font-size: 62.5%;
    height: 100%;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    background: ${props => props.theme.softLime};
    height: 100%;
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
    font-family: 'Poppins';
  }
  a {
    text-decoration: none;
    color: ${theme.black};
  }
`;

class Page extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <StyledPage>
          <GlobalStyle />
          <Header />
          <Meta />
          <Inner>{this.props.children}</Inner>
        </StyledPage>
      </ThemeProvider>
    );
  }
}

export default Page;
