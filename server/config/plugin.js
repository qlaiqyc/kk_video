'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  httpProxy: {
    enable: true,
    package: 'egg-http-proxy',
  },
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },

};

