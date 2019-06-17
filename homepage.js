const React = require('react');
const ReactDOMServer = require('react-dom/server');

function HomePage({ dbRoutes }) {
  return React.createElement(
    'div',
    {},
    React.createElement(
      'ul',
      { className: 'nes-list is-disc' },
      dbRoutes.map(route =>
        React.createElement(
          'li',
          { key: route },
          React.createElement('a', { href: route }, route)
        )
      )
    )
  );
}

module.exports = function createHomePage(dbRoutes) {
  const links = ReactDOMServer.renderToStaticMarkup(
    React.createElement(HomePage, { dbRoutes })
  );

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link href="https://unpkg.com/nes.css@2.2.0/css/nes.min.css" rel="stylesheet" />
      <title>Pokemon Server</title>
    </head>
    <body>
      <div class="nes-container with-title is-centered">
        <h1 class="title">Pokemon Server</h1>
        <p>The following endpoints are available.</p>
        ${links}
      </div>
    </body>
  </html>`;
};
