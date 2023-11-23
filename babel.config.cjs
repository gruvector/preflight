/** @type {import('@babel/core').TransformOptions} */
const config = {
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    },
  },
};

module.exports = config;
