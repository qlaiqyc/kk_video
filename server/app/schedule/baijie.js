module.exports = {
    schedule: {
        cron: '0 0 */5 * * ?',
        type: 'all', // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
        const { helper,service } = ctx;
        ctx.logger.info("----task----");

        try{service.bajie.getAlbums();}catch (e) {   ctx.logger.info("----task--bajie----error");  }
        //百万 和 大资源 是一套html 所以解析方法也是一样的
        try{service.ziyuan.getAlbums();}catch (e) {   ctx.logger.info("----task---ziyuan---error");  }
        try{service.gaoqin.getAlbums();}catch (e) {   ctx.logger.info("----task---ziyuan---error");  }
        // try{service.baiwan.getAlbums();}catch (e) {   ctx.logger.info("----task---baiwan---error");  }


    },
};
