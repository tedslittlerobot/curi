import React from 'react';
import { renderToString } from 'react-dom/server';
import { InMemory } from 'hickory';
import createConfig from 'curi';
import { Navigator } from 'curi-react';
import createActiveAddon from 'curi-addon-active';
import routes from '../client/routes';
import renderFunction from '../client/render';

export default function createHandler() {
  return function(req, res) {
    const history = InMemory({
      locations: [ req.url ]
    });

    const config = createConfig(history, routes, {
      addons: [createActiveAddon]
    });

    config.ready()
      .then((response) => {
        const markup = renderToString(
          <Navigator response={response} config={config} children={renderFunction} />
        );
        res.send(renderFullPage(markup, response.title));
      })
      .catch(err => {
        console.log('uh oh', err);
      })
  }
}

function renderFullPage(html, title) {
  return `<!doctype html>
<html>
  <head>
    <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon"> 
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} | Curi Documentation</title>
    <link href="https://fonts.googleapis.com/css?family=Zilla+Slab:300,400" rel="stylesheet">
    <link href="/static/css/index.css" rel="stylesheet">
  </head>
  <body>
    <div id="root">${html}</div>
    <script src="https://unpkg.com/react@15.6.1/dist/react.min.js"></script>
    <script src="https://unpkg.com/react-dom@15.6.1/dist/react-dom.min.js"></script>
    <script src="//static/js/prism.js"></script>
    <script src="//static/js/vendor.js"></script>
    <script src="/static/js/bundle.js"></script>
  </body>
</html>
`;
}
