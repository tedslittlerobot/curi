import 'jest';
import createConfig from '../src/curi';
import InMemory from '@hickory/in-memory';
import { Addon } from '../src/interface';
import { Response } from '../src/response';

describe('createConfig', () => {
  let history;

  beforeEach(() => {
    history = InMemory();
  });

  describe('constructor', () => {
    // these tests rely on the fact that the pathname generator
    // is a default addon
    it('registers routes', () => {
      const routes = [
        { name: 'Home', path: '' },
        { name: 'About', path: 'about' },
        { name: 'Contact', path: 'contact' }
      ];
      const config = createConfig(history, routes);

      const names = ['Home', 'About', 'Contact'];
      names.forEach(n => {
        expect(config.addons.pathname(n)).toBeDefined();
      });
    });

    it('registers nested routes', () => {
      const routes = [
        { name: 'Home', path: '' },
        { name: 'About', path: 'about' },
        {
          name: 'Contact',
          path: 'contact',
          children: [
            { name: 'Email', path: 'email' },
            { name: 'Phone', path: 'phone' }
          ]
        }
      ];
      const config = createConfig(history, routes);
      const names = ['Email', 'Phone'];
      names.forEach(n => {
        expect(config.addons.pathname(n)).toBeDefined();
      });
    });

    it('makes addons available through return object', () => {
      const routes = [{ name: 'Home', path: '' }];
      const createFakeAddon = () => ({
        name: 'fake',
        register: () => {},
        reset: () => {},
        get: () => {}
      });
      const config = createConfig(history, routes, {
        addons: [createFakeAddon()]
      });
      expect(config.addons.fake).toBeDefined();
    });

    describe('options', () => {
      describe('addons', () => {
        it('includes pathname addon by default', () => {
          const routes = [{ name: 'Home', path: '' }];
          const config = createConfig(history, routes);
          expect(config.addons.pathname).toBeDefined();
        });

        it('includes pathname addon even when other addons are provided', () => {
          const firstAddonCache = {};
          const createFirstAddon = () => {
            return {
              name: 'first',
              register: (route, extra) => {
                firstAddonCache[route.name] = route.path;
              },
              get(route) {},
              reset() {}
            };
          };

          const routes = [{ name: 'Home', path: '' }];
          const config = createConfig(history, routes, {
            addons: [createFirstAddon()]
          });
          expect(config.addons.pathname).toBeDefined();
        });

        it('registers all of the routes with all of the addons', () => {
          // this might be a bit convoluted, but it ensures that the addons
          // are registered as expected
          const firstAddonCache = {};
          const secondAddonCache = {};
          const createFirstAddon = () => {
            return {
              name: 'first',
              register: (route, extra) => {
                firstAddonCache[route.name] = route.path;
              },
              get(route) {},
              reset() {}
            };
          };

          const createSecondAddon = () => {
            return {
              name: 'second',
              register: (route, extra) => {
                secondAddonCache[route.name] = `${extra ? extra : 'None'} + ${
                  route.name
                }`;
                return route.name;
              },
              get(route) {},
              reset() {}
            };
          };

          const routes = [
            {
              name: 'Grandparent',
              path: 'grandparent',
              children: [
                {
                  name: 'Parent',
                  path: 'parent',
                  children: [{ name: 'Child', path: 'child' }]
                }
              ]
            },
            {
              name: 'Cousin',
              path: 'cousin'
            }
          ];

          const config = createConfig(history, routes, {
            addons: [createFirstAddon(), createSecondAddon()]
          });
          const expected = {
            Grandparent: {
              first: 'grandparent',
              second: 'None + Grandparent'
            },
            Parent: {
              first: 'parent',
              second: 'Grandparent + Parent'
            },
            Child: {
              first: 'child',
              second: 'Parent + Child'
            },
            Cousin: {
              first: 'cousin',
              second: 'None + Cousin'
            }
          };
          const keys = ['Grandparent', 'Parent', 'Child', 'Cousin'];
          keys.forEach(key => {
            expect(firstAddonCache[key]).toBe(expected[key].first);
            expect(secondAddonCache[key]).toBe(expected[key].second);
          });
        });
      });

      describe('sideEffects', () => {
        it('calls side effect methods after a response is generated, passing them response and action', done => {
          const routes = [{ name: 'All', path: ':all+' }];
          const sideEffect = jest.fn();

          const config = createConfig(history, routes, {
            sideEffects: [{ fn: sideEffect }]
          });
          config.respond(response => {
            expect(sideEffect.mock.calls.length).toBe(1);
            expect(sideEffect.mock.calls[0][0]).toBe(response);
            expect(sideEffect.mock.calls[0][1]).toBe('PUSH');
            done();
          });
        });

        it('calls side effects WITHOUT "after: true" property before response handlers', done => {
          const routes = [{ name: 'All', path: ':all+' }];

          const sideEffect1 = jest.fn();
          const sideEffect2 = jest.fn();

          const config = createConfig(history, routes, {
            sideEffects: [
              { fn: sideEffect1, after: false },
              { fn: sideEffect2 }
            ]
          });

          expect.assertions(2);
          config.respond(response => {
            expect(sideEffect1.mock.calls.length).toBe(1);
            expect(sideEffect2.mock.calls.length).toBe(1);
            done();
          });
        });

        it('calls side effects WITH "after: true" property after response handlers', done => {
          const routes = [{ name: 'All', path: ':all+' }];
          const responseHandler = jest.fn();
          const sideEffect = function() {
            expect(responseHandler.mock.calls.length).toBe(1);
            done();
          };

          const config = createConfig(history, routes, {
            sideEffects: [{ fn: sideEffect, after: true }]
          });
          config.respond(responseHandler);
        });
      });

      describe('cache', () => {
        it('returns cached response for same key on subsequent calls if cache is provided', done => {
          const routes = [
            {
              name: 'All',
              path: '(.*)',
              match: {
                response: ({ set }) => {
                  set.data(Math.random());
                }
              }
            }
          ];
          const createSimpleCache = () => {
            const cache = {};

            return {
              get: ({ key }) => cache[key],
              set: response => {
                const { key } = response.location;
                cache[key] = response;
              }
            };
          };

          const config = createConfig(history, routes, {
            cache: createSimpleCache()
          });

          let calls = 0;
          let randomValue;
          const steps = [
            r => {
              randomValue = r.data;
              history.push('/new-location');
            },
            r => {
              expect(r.data).not.toEqual(randomValue);
              history.go(-1);
            },
            r => {
              expect(r.data).toEqual(randomValue);
              done();
            }
          ];

          function responseHandler(response) {
            let fn = steps[calls++];
            if (fn) {
              fn(response);
            }
          }
          config.respond(responseHandler);
        });

        it('generates new response for same key on subsequent calls if cache is not provided', done => {
          const routes = [
            {
              name: 'All',
              path: '(.*)',
              match: {
                response: ({ set }) => {
                  set.data(Math.random());
                }
              }
            }
          ];
          const config = createConfig(history, routes);

          let calls = 0;
          let randomValue;
          const steps = [
            r => {
              randomValue = r.data;
              history.push('/new-location');
            },
            r => {
              expect(r.data).not.toEqual(randomValue);
              history.go(-1);
            },
            r => {
              expect(r.data).not.toEqual(randomValue);
              done();
            }
          ];

          function responseHandler(response) {
            steps[calls++](response);
          }

          config.respond(responseHandler);
        });
      });
    });
  });

  describe('refresh', () => {
    const err = console.error;

    beforeEach(() => {
      console.error = jest.fn();
    });

    afterEach(() => {
      console.error = err;
    });

    it('resets and replaces registered routes', () => {
      const englishRoutes = [
        { name: 'Home', path: '' },
        { name: 'About', path: 'about' },
        { name: 'Contact', path: 'contact' }
      ];
      const spanishRoutes = [
        { name: 'Casa', path: '' },
        { name: 'Acerca De', path: 'acerca-de' },
        { name: 'Contacto', path: 'contacto' }
      ];

      const config = createConfig(history, englishRoutes);

      config.refresh(spanishRoutes);

      const englishNames = ['Home', 'About', 'Contact'];
      englishNames.forEach(n => {
        expect(config.addons.pathname(n)).toBeUndefined();
      });

      const spanishNames = ['Casa', 'Acerca De', 'Contacto'];
      spanishNames.forEach(n => {
        expect(config.addons.pathname(n)).toBeDefined();
      });
    });
  });

  describe('respond', () => {
    describe('initial call', () => {
      it('does not immediately calls response handler when there is not a response', () => {
        const history = InMemory({
          locations: ['/']
        });
        const routes = [{ name: 'Home', path: '' }];
        const sub = jest.fn();
        const config = createConfig(history, routes);

        config.respond(sub);
        expect(sub.mock.calls.length).toBe(0);
      });

      it('immediately calls response handler when there is already a response', done => {
        const history = InMemory({
          locations: ['/']
        });
        const routes = [{ name: 'Home', path: '' }];
        const sub = jest.fn();
        const config = createConfig(history, routes);
        setTimeout(() => {
          config.respond(sub);
          expect(sub.mock.calls.length).toBe(1);
          done();
        }, 50);
      });
    });

    describe('response handler options', () => {
      describe('once', () => {
        it('calls the response handler function only one time', done => {
          const history = InMemory({
            locations: ['/']
          });
          const routes = [{ name: 'Home', path: '' }];
          const oneTime = jest.fn();
          let called = false;
          const responseHandler = jest.fn(() => {
            if (called) {
              expect(oneTime.mock.calls.length).toBe(1);
              expect(responseHandler.mock.calls.length).toBe(2);
              done();
            } else {
              called = true;
              // trigger another navigation to verify that the once sub
              // is not called again
              config.history.push('/another-one');
            }
          });
          const config = createConfig(history, routes);

          config.respond(oneTime, { once: true });
          config.respond(responseHandler);
        });

        it('calls the response handler function immediately if a response has already resolved', done => {
          const history = InMemory({
            locations: ['/']
          });
          const routes = [{ name: 'Home', path: '' }];
          const oneTime = jest.fn();
          const config = createConfig(history, routes);
          setTimeout(() => {
            config.respond(oneTime, { once: true });
            expect(oneTime.mock.calls.length).toBe(1);
            expect(oneTime.mock.calls[0][0].location.pathname).toBe('/');
            done();
          }, 50);
        });

        it('when subscribed, the function is called AFTER regular response handlers', done => {
          const history = InMemory({
            locations: ['/']
          });
          const routes = [{ name: 'Home', path: '' }];
          const oneTime = jest.fn();
          let called = false;
          const responseHandler = jest.fn(() => {
            if (called) {
              expect(oneTime.mock.calls.length).toBe(1);
              expect(responseHandler.mock.calls.length).toBe(2);
              done();
            } else {
              called = true;
              expect(oneTime.mock.calls.length).toBe(0);
              expect(responseHandler.mock.calls.length).toBe(1);
              // trigger another navigation to verify that the once sub
              // is not called again
              config.history.push('/another-one');
            }
          });
          const config = createConfig(history, routes);

          config.respond(oneTime, { once: true });
          config.respond(responseHandler);
        });
      });
    });

    it('notifies response handlers of new response and action when location changes', done => {
      const How = { name: 'How', path: ':method' };
      const routes = [
        { name: 'Home', path: '' },
        { name: 'About', path: 'about' },
        { name: 'Contact', path: 'contact', children: [How] }
      ];

      const check = (response, action) => {
        expect(response).toMatchObject({
          name: 'How',
          partials: ['Contact'],
          params: {
            method: 'mail'
          }
        });
        expect(action).toBe('PUSH');
        done();
      };

      const config = createConfig(history, routes);
      config.respond(check);
      history.push('/contact/mail');
    });

    it('notifies response handlers after promises have resolved', done => {
      let promiseResolved = false;
      const routes = [
        { name: 'Home', path: '' },
        { name: 'About', path: 'about' },
        {
          name: 'Contact',
          path: 'contact',
          children: [
            {
              name: 'How',
              path: ':method',
              match: {
                every: () => {
                  promiseResolved = true;
                  return Promise.resolve(promiseResolved);
                }
              }
            }
          ]
        }
      ];

      const check = response => {
        expect(promiseResolved).toBe(true);
        done();
      };

      const config = createConfig(history, routes);
      config.respond(check);
      history.push('/contact/phone');
    });

    it('does not emit responses for cancelled navigation', done => {
      const routes = [
        { name: 'Home', path: '' },
        { name: 'About', path: 'about' },
        {
          name: 'Contact',
          path: 'contact',
          children: [
            {
              name: 'How',
              path: ':method',
              match: {
                initial: () => Promise.resolve()
              }
            }
          ]
        }
      ];
      const check = response => {
        expect(response.params.method).toBe('mail');
        done();
      };

      const config = createConfig(history, routes);
      config.respond(check);
      history.push('/contact/phone');
      history.push('/contact/mail');
    });

    it('returns a function to unsubscribe when called', done => {
      const config = createConfig(history, [{ name: 'Home', path: '' }]);

      const sub1 = jest.fn();
      const sub2 = jest.fn();

      // wait for the first response to be generated to ensure that both
      // response handler functions are called when subscribing
      const unsub1 = config.respond(sub1);
      const unsub2 = config.respond(sub2);

      expect(sub1.mock.calls.length).toBe(0);
      expect(sub2.mock.calls.length).toBe(0);
      unsub1();
      history.push({ pathname: '/next' });

      // need to wait for the response handlers to actually be called
      process.nextTick(() => {
        expect(sub1.mock.calls.length).toBe(0);
        expect(sub2.mock.calls.length).toBe(1);
        done();
      });
    });

    it('throws an error if passing a non-function to respond', () => {
      // adding this test for coverage, but TypeScript doesn't like it
      const config = createConfig(history, [{ name: 'Home', path: '' }]);
      const nonFuncs = [
        null,
        undefined,
        'test',
        123,
        [1, 2, 3],
        { key: 'value' }
      ];
      nonFuncs.forEach(nf => {
        expect(() => {
          config.respond(nf);
        }).toThrow('The first argument passed to "respond" must be a function');
      });
    });
  });

  describe('response.redirectTo', () => {
    it('triggers a history.replace call AFTER emitting response', done => {
      let callPosition = 0;
      const routes = [
        {
          name: 'A Route',
          path: '',
          match: {
            response: ({ set }) => {
              set.redirect('/somewhere-else', 301);
            }
          }
        }
      ];

      history.replace = jest.fn(() => {
        expect(hasEmitted).toBe(true);
        done();
      });

      const config = createConfig(history, routes);

      let hasEmitted = false;
      const responseHandler = () => {
        hasEmitted = true;
      };

      config.respond(responseHandler);
    });
  });
});
