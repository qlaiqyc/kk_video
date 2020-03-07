
const Controller = require('egg').Controller;
const { parseString } = require('xml2js');
const cheerio = require('cheerio');
class AppController extends Controller {
  async index() {
    await this.ctx.renderClient('app.js', { url: this.ctx.url });
  }

  async updateSource() {
    const { ctx, app } = this;
    const { helper, service } = ctx;
    const data = helper.global.get('sql_tables');

    data.curr = data.curr == 0 ? 1 : 0;

    helper.global.set('sql_tables', data);


    ctx.response.success(1);

  }

  // 数据爬虫页面
  async getData() {
    const { ctx, app } = this;
    const { helper, service } = ctx;
    const { type } = ctx.query;

    setTimeout(() => {
      // service.bajie.getMovies();

      service.bajie.getAlbums();


    }, 0);


    ctx.response.success(1);

  }

  async getData2() {
    const { ctx, app } = this;
    const { helper, service } = ctx;
    const { type } = ctx.query;

    setTimeout(() => {
      // service.bajie.getMovies();


      service.ziyuan.getAlbums();

      // service.auto.getRank();

    }, 0);


    ctx.response.success(1);

  }

  async getData3() {
    const { ctx, app } = this;
    const { helper, service } = ctx;
    const { type } = ctx.query;

    setTimeout(() => {
      // service.bajie.getMovies();


      // service.baiwan.getAlbums();
      service.gaoqin.getAlbums();

      // service.auto.getRank();

    }, 0);


    ctx.response.success(1);

  }


  // 获取swiper
  async getSwiper() {
    const { ctx, app } = this;
    const { helper, service } = ctx;
    const { type } = ctx.query;

    setTimeout(()=>{
      service.auto.getTx();
    })


    ctx.response.success(1);

  }

}

module.exports = AppController;
