const { cssLoaderConfig } = require('../webpack.helper.js');

module.exports = async ({ config, mode }) => {
  config.module.rules.push(...cssLoaderConfig(true));

  // Return the altered config
  return config;
};
