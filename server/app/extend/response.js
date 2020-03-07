'use strict';
module.exports = {
  async success(value) {
    const { ctx } = this;
    const {req,helper} = ctx;
    // ctx.status = 401;
    //由于入口已经判断 在这里不需要二次调用数据库 只需要看全局变量

    let  token = req.headers.token,isLogin = false,code=0;//code =0 ,登陆-正常返回， =1  未登陆默认处理， 2，强制要求登陆 ，


    let user = await helper.user.getGlobalToken(ctx,token);
    if(String.HasText(user)){
      isLogin = await  helper.user.checkLogin(ctx,user);
    }
    code = isLogin?0:1;

    ctx.body = { code: 0, data: value };

  },
  warn(code, value) {
    const { ctx } = this;
    // ctx.set('status', code);
    ctx.body = { code, data: value };
  },
};
