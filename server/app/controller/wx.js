
const Controller = require('egg').Controller;
const { parseString } = require('xml2js');
const cheerio = require('cheerio');
class AppController extends Controller {


  //第一步 ：用 code 交换 {session_key，openid，unionid}
  //第二步 : 用 session_key  和参数 解密用户信息
  //第三步 ，保存用户信息到数据库 设置 token  和当前时间 ，，，（这里使用全局变量来进行 缓存处理）
  async login() {
    const { ctx, app } = this;
    const { helper, service } = ctx;
    let {code,encryptedData,iv} = ctx.request.body;

    

    let result = {};



    try{
      let {data} = await ctx.curl("https://api.weixin.qq.com/sns/jscode2session?appid="+helper.wx.AppID+"&secret="+helper.wx.AppSecret+"&js_code="+code+"&grant_type=authorization_code", {  dataType: 'text'});
      let {openid,session_key} = JSON.parse(data)


      //判断全局变量里面是否有这用户
      let user = await helper.user.getUser(ctx,openid);


      //判断数据库里是否有这用户
      if(!String.HasText(user)){
        user = await service.user.getUser(openid);
      }

      ctx.logger.warn('==result===1=',user);

      //保存到数据库
      if(!String.HasText(user)){


        user = helper.wx.decodeData(session_key,encryptedData,iv);

        delete  user.watermark;
        //插入数据库
        await app.mysql.query("SET NAMES utf8mb4");
        await app.mysql.beginTransactionScope(async conn => {
          await conn.insert(helper.sql.table.user,user );
        }, ctx);

        user = await service.user.getUser(openid);
      }


      ctx.logger.warn('==result===2=',user);

      //生成 token 信息
      user.token = helper.md5(user.openId);
      user.token_time = new Date()



      // 将token 信息保存到数据库
      await app.mysql.beginTransactionScope(async conn => {

        const {nickName,avatarUrl,country,token_time,token} = user
        await conn.update(helper.sql.table.user,{nickName,avatarUrl,country,token,token_time},{where:{openId:openid}});
      }, ctx);

     if(!String.HasText(user.add_time)) user.add_time= new Date();
      user.add_time = typeof user.add_time == "string" ?user.add_time:user.add_time.Format("yyyy-MM-dd");

      //保存全局变量 (保存用户信息 和 基本设置信息)
      helper.user.setGlobalUser(ctx,user);


      //返回用户信息
      result =user;


    }catch (e) {
      ctx.logger.warn('==result===2=',e);
    }



    ctx.response.success(result);

  }

  //更新用户信息  必须先登陆
  async update(){
    const { ctx, app } = this;
    const { helper,service,originalUrl,req } = ctx;

    const {source} = ctx.request.body;
    let result = {},token= req.headers.token;


    ctx.logger.warn('==result===2=',source);
    let user = await  service.user.getUserToken(token);

    ctx.logger.warn('==result===3=',user);
    user.source = source;



    await app.mysql.beginTransactionScope(async conn => {
      await conn.update(helper.sql.table.user,{source:source} ,{where:{token:token}});
    }, ctx);

    user.add_time = typeof user.add_time == "string" ?user.add_time:user.add_time.Format("yyyy-MM-dd");

    helper.user.setGlobalUser(ctx,user);

    ctx.response.success(user);

  }
}

module.exports = AppController;
