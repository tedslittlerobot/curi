require('@babel/register');
const PathToRegexp = require('path-to-regexp');
const request = require('request-promise-native');
const fs = require('fs');
const join = require('path').join;

const BASE_DIR = join(__dirname, '..', 'gh-pages');

function generatePaths(routes, params, parent) {
  if (!parent) {
    parent = '/';
  }

  return routes.reduce((acc, curr) => {
    const p = joinSegments(parent, curr.path);
    const routeParams = params  && params[curr.name] ? params[curr.name] : {};
    const paths = compilePath(p, routeParams.params);
    acc = acc.concat(paths);
    if (curr.children) {
      acc = acc.concat(generatePaths(curr.children, routeParams.children, p));
    }
    return acc;
  }, []);
}

function joinSegments(base, newSegment) {
  return base.charAt(base.length-1) === '/'
    ? base + newSegment
    : base + '/' + newSegment;
}

function localURI(path) {
  return `http://localhost:8000${path}`
}

function compilePath(path, params) {
  if (!params) {
    return path;
  }
  const compiler = PathToRegexp.compile(path);
  return params.map(compiler);
}

function makeDirs(base, dirPath) {
  // save an extra attempt at making the root folder
  if (dirPath.charAt(0) === '/') {
    dirPath = dirPath.slice(1);
  }
  const segments = dirPath.split('/');
  let current = base;
  segments.forEach(segment => {
    current = join(current, segment);
    if (!fs.existsSync(current)) {
      fs.mkdirSync(current);
    }
  });
  return current;
}

module.exports = function generateStaticFiles(routes, params) {
  return Promise.all(
    generatePaths(routes, params).map(p => (
      request(localURI(p))
        .then(html => {
          const outputDir = makeDirs(BASE_DIR, p);
          fs.writeFile(
            join(outputDir, 'index.html'),
            html,
            function(err) {
              if (err) {
                console.error('something went wrong with path', p);
                console.error(err);
              }
            }
          )
          console.log(p);
          
        })
        .catch(err => {
          throw Error(err);
        })
    ))
  );
}
