module.exports = {
    schedule: {
        cron: '0 0 */4 * * ?',
        type: 'all', // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
        const { helper,service } = ctx;
        ctx.logger.info("----task----");

        try{service.auto.getTx();}catch (e) {   ctx.logger.info("----task---auto---error");  }
        try{service.auto.getRank();}catch (e) {   ctx.logger.info("----task---auto---error");  }


    },
};
