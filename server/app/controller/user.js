'use strict';


const Controller = require('egg').Controller;


// GET	/posts	posts	app.controllers.posts.index
// GET	/posts/new	new_post	app.controllers.posts.new
// GET	/posts/:id	post	app.controllers.posts.show
// GET	/posts/:id/edit	edit_post	app.controllers.posts.edit
// POST	/posts	posts	app.controllers.posts.create
// PUT	/posts/:id	post	app.controllers.posts.update
// DELETE	/posts/:id	post	app.controllers.posts.destroy//

class dController extends Controller {


    /**
     * --管理员获取
     * 需要判断是否是管理员 暂时不判断
     * */
    async getAllUser(){
        const { ctx, app } = this;
        const { helper,service ,originalUrl} = ctx;
        const {table} = helper.sql;
        const {page_number,page_size} = helper.urlParam(originalUrl);

        const sql4all = "select a.* from  "+table.user+" a where a.role !=0  limit "+ (page_number - 1) * page_size + ',' + page_size;
        let users = await app.mysql.query(sql4all);

        users = users.map(curr => {
            curr.create_time = curr.create_time.Format('yyyy-MM-dd hh:mm:ss');
            curr.update_time = curr.update_time.Format('yyyy-MM-dd hh:mm:ss');
            return curr;
        });

        ctx.response.success({data:users,num:100});
    }

    /**
     * --管理员获取
     * 需要判断是否是管理员 暂时不判断
     * */
    async getAllMenus(){
        const { ctx, app } = this;
        const { helper,service ,originalUrl} = ctx;
        const {table} = helper.sql;
        const {uuid} = helper.urlParam(originalUrl);

        const sql4all = "select a.* from  "+table.menus+" a";
        let users = await app.mysql.query(sql4all);
        let menus = await app.mysql.query("select a.* from  "+table.user+" a where a.uuid='"+uuid+"'");


        ctx.response.success({data:users,self:menus[0].menus});
    }

    //更新菜单
    async updateMenus(){
        const { ctx, app } = this;
        const { helper,service ,originalUrl} = ctx;
        const {table} = helper.sql;
        const {uuid,menus} = ctx.request.body;

        const update = await app.mysql.beginTransactionScope(async conn => {
            let result = await conn.update(table.user, {menus}, {where: { uuid: uuid }});
            return result;
        }, ctx);


        ctx.response.success(update.changedRows);
    }

    //更新用户信息
    async updateUser(){
        const { ctx, app } = this;
        const { helper,service ,originalUrl} = ctx;
        const {table} = helper.sql;
        const {uuid,role} = ctx.request.body;

        const update = await app.mysql.beginTransactionScope(async conn => {
            let result = await conn.update(table.user, {role}, {where: { uuid: uuid }});
            return result;
        }, ctx);


        ctx.response.success(update.changedRows);
    }

}

module.exports = dController;
