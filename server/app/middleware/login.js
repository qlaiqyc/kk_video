module.exports = () => {
    return async function (ctx, next) {

        const { helper,service,originalUrl,req } = ctx;

        let  token= req.headers.token;

        let user = await helper.user.getGlobalToken(ctx,token);

        if(!String.HasText(user)) user = await service.user.getUserToken(token);

        if(String.HasText(user) && helper.user.checkLogin(ctx,user)){
            await next();
        }else{
            //这个接口必须登陆 才能操作
            ctx.body = { code: 2 ,data:"请重新登陆"};
        }






    }
};