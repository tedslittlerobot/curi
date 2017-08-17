import config from '../../../config/rollup.config.js';

export default Object.assign({}, config, {
  moduleName: 'CuriReactNavigator',
  external: [
    'react',
    'prop-types'
  ],
  globals: {
    react: 'React',
    'prop-types': 'PropTypes'
  }
});