const Service = require('egg').Service;
const {parseString} = require('xml2js');
const cheerio = require('cheerio');


class WXService extends Service {

    //创建菜单
    async getUser(openid){
        const { ctx, app } = this;
        const { helper,service } = ctx;
        const sql4all = "select a.* from  "+helper.sql.table.user+" a where a.openId='"+openid+"'";


        let users = await app.mysql.query(sql4all);

        ctx.logger.warn('==getUser===3=',sql4all,users);

        return  users.length>0?users[0]:"";
    }

    async getUserToken(token){
        const { ctx, app } = this;
        const { helper,service } = ctx;
        const sql4all = "select a.* from  "+helper.sql.table.user+" a where a.token='"+token+"'";

        if(!String.HasText(token))return "";


        let users = await app.mysql.query(sql4all);

        ctx.logger.warn('==getUser===3=',sql4all,users);

        return  users.length>0?users[0]:"";
    }

}

module.exports = WXService;
