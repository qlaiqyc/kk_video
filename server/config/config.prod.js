'use strict';
module.exports = {

  cluster: {
    listen: {
      path: '',
      port: 9009,
      hostname: '',
    },
  },
  mysql: {
    // 单数据库信息配置
    client: {
      host: '47.99.214.30',
      port: '3306',
      user: 'root',
      password: 'Abc.123!',
      database: 'video_info',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  },
  logger: {
    // dir: path.join(app.baseDir, 'logs'),
    dir: './ql-log',
    level: 'INFO',
    consoleLevel: 'INFO',
    allowDebugAtProd: true,
    disableConsoleAfterReady: true,
    outputJSON: false,
  },
};

