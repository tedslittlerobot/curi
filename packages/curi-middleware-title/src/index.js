function createTitleMiddleware(options) {
  const { prefix = '', suffix = '' } = options || {};

  return function(response) {
    document.title = [prefix, response.title, suffix].join(' ');
  };
}

export default createTitleMiddleware;
