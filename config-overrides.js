const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add polyfills for Node.js core modules
  config.resolve.fallback = {
    fs: false,
    net: false,
    tls: false,
    path: false,
    os: false,
    crypto: false,
  };

  return config;
};
