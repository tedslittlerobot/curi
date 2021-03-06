require('@babel/register');

const generateStaticFiles = require('./generateStaticFiles');
const updatePackageVersions = require('./updatePackageVersions');

const createApp = require('../src/server/app');
const routes = require('../src/client/routes').default;
const packages = require('../src/client/constants/packages').default;
const guides = require('../src/client/constants/guides').default;
const examples = require('../src/client/constants/examples').default;
const tutorialsByName = require('../src/client/constants/tutorials').byName;

const packageNames = packages.map(p => ({ package: p.name }));
const guideNames = guides.map(p => ({ slug: p.slug }));
const exampleNames = examples.map(p => ({ slug: p.slug }));
const tutorialNames = Object.keys(tutorialsByName).map(name => ({ name }));

updatePackageVersions();

let server;
const app = createApp();
server = app.listen('8000', () => {
  generateStaticFiles(
    routes,
    {
      'Packages': {
        children: {
          'Package': {
            params: packageNames
          }
        }
      },
      'Guide': {
        params: guideNames
      },
      'Examples': {
        children: {
          'Example': {
            params: exampleNames
          }
        }
      },
      'Tutorial': {
        params: tutorialNames
      }
    }
  )
    .then(() => {
      server.close();
    });
});
