module.exports = () => {
    return async function (ctx, next) {
        const startTime = Date.now();
        //修改 helper 参数
        const { helper,service,originalUrl,req } = ctx;

        let  {curr,list} = helper.global.get("sql_tables")

        let  token = req.headers.token;


        let user = await helper.user.getGlobalToken(ctx,token);
        if(!String.HasText(user))  {
            user = await  service.user.getUserToken(token);
            //保存到全局变量
            helper.user.setGlobalUser(ctx,user);
        }
        if(String.HasText(user)){
            let isLogin =await helper.user.checkLogin(ctx,user);
            if(isLogin) curr = user.source;

        }

        helper.sql.table = Object.assign(helper.sql.table,list[curr]);

        await next();

    }
};