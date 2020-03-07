const Service = require('egg').Service;


class WXService extends Service {



    //获取指定所有类型
    async getTypesBytype(param){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {table} = helper.sql;
        let {pid} = param;

        let mapData  = await app.mysql.query("select a.id,a.type,a.pid,a.name from  "+table.index+" a where a.pid="+pid);

        return  mapData;

    }

    async getTypesAll(){

        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {table} = helper.sql;


        let mapData  = await app.mysql.query("select a.id,a.type,a.pid,a.name from  "+table.index +" a");



        const  toTree = (data)=> {
            // 删除 所有 children,以防止多次调用
            data.forEach(function (item) {
                delete item.children;
            });

            // 将数据存储为 以 id 为 KEY 的 map 索引数据列
            const map = {};
            data.forEach(function (item) {  map[item.id] = item;  });

            const val = [];
            data.forEach(function (item) {
                // 以当前遍历项，的pid,去map对象中找到索引的id
                const parent = map[item.pid];
                // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
                if (parent) {
                    (parent.children || ( parent.children = [] )).push(item);
                } else {
                    //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                    val.push(item);
                }
            });
            return val;
        }


        mapData = toTree(mapData);

        mapData = mapData.map(curr=>{
            curr.id = curr.id.toString();
            return curr;
        })
        return  mapData;


    }



}

module.exports = WXService;
