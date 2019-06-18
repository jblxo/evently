import Head from 'next/head';

const Meta = props => (
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charSet="utf-8" />
    <link rel="stylesheet" href="/static/calendarStyles.css" />
    <link rel="shortcut icon" href="/static/favicon.png" />
    <title>Evently</title>
  </Head>
);

export default Meta;
