import 'jest';
import createConfig from '../src/curi';
import InMemory from '@hickory/in-memory';

describe('route.pathOptions matching', () => {
  describe('default options', () => {
    it('sensitive = false', done => {
      const history = InMemory({ locations: ['/Here'] });
      const routes = [
        {
          name: 'Test',
          path: 'here'
        },
        {
          name: 'Not Found',
          path: '(.*)'
        }
      ];
      const config = createConfig(history, routes);
      config.respond(response => {
        expect(response.name).toBe('Test');
        done();
      });
    });

    it('strict = false', done => {
      const history = InMemory({ locations: ['/here/'] });
      const routes = [
        {
          name: 'Test',
          path: 'here'
        },
        {
          name: 'Not Found',
          path: '(.*)'
        }
      ];
      const config = createConfig(history, routes);
      config.respond(response => {
        expect(response.name).toBe('Test');
        done();
      });
    });

    it('end = true', done => {
      const history = InMemory({ locations: ['/here/again'] });
      const routes = [
        {
          name: 'Test',
          path: 'here'
        },
        {
          name: 'Not Found',
          path: '(.*)'
        }
      ];
      const config = createConfig(history, routes);
      config.respond(response => {
        expect(response.name).toBe('Not Found');
        done();
      });
    });
  });

  describe('user provided options', () => {
    it('sensitive = true', done => {
      const history = InMemory({ locations: ['/Here'] });
      const routes = [
        {
          name: 'Test',
          path: 'here',
          pathOptions: { sensitive: true }
        },
        {
          name: 'Not Found',
          path: '(.*)'
        }
      ];
      const config = createConfig(history, routes);
      config.respond(response => {
        expect(response.name).toBe('Not Found');
        done();
      });
    });

    it('strict = true', done => {
      const history = InMemory({ locations: ['/here/'] });
      const routes = [
        {
          name: 'Test',
          path: 'here',
          pathOptions: { strict: true }
        },
        {
          name: 'Not Found',
          path: '(.*)'
        }
      ];
      const config = createConfig(history, routes);
      config.respond(response => {
        expect(response.name).toBe('Not Found');
        done();
      });
    });

    it('end = false', done => {
      const history = InMemory({ locations: ['/here/again'] });
      const routes = [
        {
          name: 'Test',
          path: 'here',
          pathOptions: { end: false }
        },
        {
          name: 'Not Found',
          path: '(.*)'
        }
      ];
      const config = createConfig(history, routes);
      config.respond(response => {
        expect(response.name).toBe('Test');
        done();
      });
    });
  });
});
