
const Controller = require('egg').Controller;
const {parseString} = require('xml2js');
const cheerio = require('cheerio');
class AppController extends Controller {
    //获取配置 在审核的时候将数据改为 只是展示
    async Config(){
        const { ctx, app } = this;
        //verify 1 :正在审核 2 审核结束
        //源 source
        // showTips {id:0,pic,title,content} 如果有提示需要告诉
        let source = [   {  name: "普通源", type: 0,  },  {  name: "一级源",  type: 1,  },  { name: "高清",  type: 2,  },  ];
        let showTips = {id:2,pic:"",title:"通知",content:"亲爱的：朋友 ，登陆可在用户中心选择看高清视频哦"}
        ctx.response.success({verify:2,source,showTips});

    }

    //前台数据

    //获取排行榜信息 全局获取

    //类型 细节搜索
    async Qranks(){

        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {sql} = helper,param = helper.urlParam(originalUrl);
        const sql4all = "select a.* from  "+sql.table.rank+" a ";
        let users = await app.mysql.query(sql4all);
        users = users.map(curr=>{

            return {
                type:curr.type,
                list:curr.name.split("©").map(obj=>{  let c = obj.split("◎");  return {name:c[0],status:c[1] }  })
            }
        })

        let result = {};
        users.forEach(curr=>{  result[curr.type] = curr.list;   })

        ctx.response.success(result);

    }



    //类型 细节搜索
    async QsearchType(){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {sql} = helper,param = helper.urlParam(originalUrl);
        let {page_number,page_size,models,year,address,type,keywords} = param;

        keywords = decodeURIComponent(keywords);
        try{


            let condition = "";

            const years = year.split(",");
            if(years.length>1){   condition+=" and year BETWEEN "+years[0]+" AND " +years[1];   }else{   if(String.HasText(year))  condition += " and year="+year }
            if(String.HasText(address)){condition+=" and ( " ;   address.split(",").forEach((curr,index)=>{condition += (index== 0 ?"  ":" or ")+"  a.address like '%"+curr+"%'"})  ; condition+=")"; }
            if(String.HasText(type)){ condition += " and type like '%"+type+"%'"   }else{  condition+=" and a.type not like '%美女%'   ";}



            console.log("-------",keywords,"~---------------------")
            if(String.HasText(keywords)) condition +="  and a.name like '%"+keywords+"%'  "
            if(models == 1){
                condition=" a.models=1 "+condition+" order by a.create_time desc ";
            }else if(models == 2){
                condition=" a.models=2 and a.type like '%剧%'"+condition +" order by a.create_time desc ";
            }else if(models == 3){
                condition=" a.models=2 and a.type like '%综艺%'"+condition+" order by a.create_time desc ";
            }else if(models == 4){
                condition=" a.models=2 and a.type like '%动漫%'"+condition+" order by a.create_time desc ";
            }



            const sql4all = "select a.* from  "+sql.table.movies+" a where  "+condition +"limit "+ (page_number - 1) * page_size + ',' + page_size;
            const sql4count = "select count(*) as counts  from  "+sql.table.movies+" a where  "+condition ;

            ctx.logger.info("----base------error",sql4all);

            let users = await app.mysql.query(sql4all);
            let counts = 0;
            if(page_number == 1){
                counts =await app.mysql.query(sql4count);
                counts = counts[0].counts
            }

            users = users.map(curr => {
                curr.create_time = curr.create_time.Format('yyyy-MM-dd hh:mm:ss');
                return curr;
            });

            ctx.response.success({list:users,counts});
        }catch(e){
            ctx.response.success({list:[],counts:0});
        }


       
    }

    //文本搜索
    async Qsearch(){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;


        const {users,counts} = await service.api.getSearch(helper.urlParam(originalUrl));

        ctx.response.success({list:users,counts});
    }

    //获取 单个视频
    async Qplay(){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;

        let result =await service.api.getDetail();

        ctx.response.success(result);
    }


    //获取首页数据
    async Qindex(){

        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx,dparam = helper.urlParam(originalUrl);

        //从 缓存（暂时在全局对象里面拿） 拿 如果没有 则 调用接口 有则 直接返回

        let  a = helper.global.get("QindexData");
        if(!String.HasText(a.time)){
            await service.auto.getTx();
            a = helper.global.get("QindexData");
        }
        let {data} = a,{type} = dparam;

        // let result = await  service.api.getIndex(dparam);
        //
        // let endData = await service.api.voIndex(result);

        ctx.response.success(data[type]);
    }





    //========后台管理===========


    //===========类型添加 s====


    //===========类型添加 e====

    async newAdd(){

        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {sql} = helper,result = [];
        const time = "'"+new Date().Format('yyyy-MM-dd')+"'";

        //总数居
        let sql4all = await app.mysql.query("select count(*) from  "+sql.table.movies);
        let sql4count =  await app.mysql.query("select count(*)  from  "+sql.table.movies+" a where   (a.create_time >"+time+" or  a.update_time>"+time+") ");


        result.push({name:"总数据",all:Object.values(sql4all[0])[0],"new":Object.values(sql4count[0])[0],color:"rgb(45, 183, 245)"})

        //电影

        sql4all = await app.mysql.query("select count(*) from  "+sql.table.movies +" a where a.models =1 ");
        sql4count =  await app.mysql.query("select count(*)  from  "+sql.table.movies+" a where  a.models =1 and  (a.create_time >"+time+" or  a.update_time>"+time+") ");
        result.push({name:"电影",all:Object.values(sql4all[0])[0],"new":Object.values(sql4count[0])[0],color:"rgb(25, 190, 107)"})


        //电视剧
        sql4all = await app.mysql.query("select count(*) from  "+sql.table.movies +" a where a.models =2 and a.type like '%剧%'");
        sql4count =  await app.mysql.query("select count(*)  from  "+sql.table.movies+"  a where a.models =2 and a.type like '%剧%' and (a.create_time >"+time+" or  a.update_time>"+time+") ");
        result.push({name:"电视剧",all:Object.values(sql4all[0])[0],"new":Object.values(sql4count[0])[0],color:"rgb(25, 190, 107)"})

        console.log("select count(*)  from  "+sql.table.movies+"  a where a.models =2 and a.name like '%剧%' and   (a.create_time >"+time+" or  a.update_time>"+time+") ");


        //综艺

        sql4all = await app.mysql.query("select count(*) from  "+sql.table.movies +" a where a.models =2 and a.type like '%综艺%'");
        sql4count =  await app.mysql.query("select count(*)  from  "+sql.table.movies+"  a where a.models=2 and a.type like '%综艺%' and (a.create_time >"+time+" or  a.update_time>"+time+") ");
        result.push({name:"综艺",all:Object.values(sql4all[0])[0],"new":Object.values(sql4count[0])[0],color:"rgb(237, 64, 20)"})

        //动漫
        sql4all = await app.mysql.query("select count(*) from  "+sql.table.movies +" a where a.models =2 and a.type like '%动漫%'");
        sql4count =  await app.mysql.query("select count(*)  from  "+sql.table.movies+"  a where a.models =2 and a.type like '%动漫%' and (a.create_time >"+time+" or  a.update_time>"+time+") ");
        result.push({name:"动漫",all:Object.values(sql4all[0])[0],"new":Object.values(sql4count[0])[0],color:"rgb(255, 153, 0)"})



        ctx.response.success(result);


    }


    //获取首页 配置
    //搜索 数据
    async search(){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {sql} = helper;
        const {page_number,page_size,type,keyword} = helper.urlParam(originalUrl);


        let coni = type == 1? "a.models=1":"a.models=2 && a.type like '%"+type+"%'";

        if(String.HasText(keyword)) {
          coni+=" and ( " ;
          keyword.split(",").forEach((curr,index)=>{coni += (index== 0 ?"  ":" or ")+"  a.name like '%"+curr+"%'"})  ;
          coni+=")";
        }



        const sql4all = "select a.* from  "+sql.table.movies+" a where "+coni+"  limit "+ (page_number - 1) * page_size + ',' + page_size;
        const sql4count = "select count(*) as counts from  "+sql.table.movies+" a where "+coni;

        let users = await app.mysql.query(sql4all);
        let counts = await app.mysql.query(sql4count);
        counts = counts[0].counts

        users = users.map(curr => {
            curr.create_time = curr.create_time.Format('yyyy-MM-dd hh:mm:ss');
            return curr;
        });

        ctx.response.success({list:users,counts});
        // ctx.response.success(1)

    }

    //首页数据 添加  swiper model

    async addIndex(){
        const { ctx, app } = this;
        const { helper,service ,originalUrl} = ctx;
        const {table} = helper.sql;


        await  service.api.addIndex(ctx.request.body)



        ctx.response.success(1);

    }

    //后台 首页数据获取所有类型
    async getIndexTypes(){


         const { ctx, app } = this;
         const { helper,service,originalUrl } = ctx;
         const {table} = helper.sql;


         let mapData  = await service.admin.getTypesAll();

        ctx.response.success({menus:mapData});

    }

    //后台 首页数据获取
    async getIndex(i){


        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {table} = helper.sql;
        const {page_number,page_size,type,status,way} = helper.urlParam(originalUrl);

        let conti = way == -1 ? "" : ("and a.way="+way);
        conti="";//2019-11-25 处理接口

        const sql4all = "select a.* from  "+table.swiper+" a where a.type="+type+"  and a.status="+status+"  "+conti+" limit "+ (page_number - 1) * page_size + ',' + page_size;
        const sql4count = "select count(*) as counts from  "+table.swiper+" a where a.type="+type+"  and a.status="+status+" "+conti;

        let mapData  = await service.admin.getTypesBytype({pid:type}),mapKey={};
        mapData.forEach(curr=>{
           mapKey[curr.id] = Object.assign(curr,{list:[]});
        });


        let users = await app.mysql.query(sql4all);
        let counts = await app.mysql.query(sql4count);
        counts = counts[0].counts;


        users.forEach(curr=>{if(curr.way in mapKey)  mapKey[curr.way].list.push(curr);  });


        ctx.response.success({list:Object.values(mapKey),counts});

    }

    //禁用数据
    async updateData(){


        const { ctx, app } = this;
        const { helper,service ,originalUrl} = ctx;
        const {table} = helper.sql;
        const {uuid,status,see,type,way,pic} = ctx.request.body;

        if(String.HasText(see)){

            if(see == 1){
                const user = await this.app.mysql.get(table.swiper, { see:1 ,type:0,way:1 });

                const update = await app.mysql.beginTransactionScope(async conn => {
                    if(user && user.uuid) await conn.update(table.swiper, {see:0}, {where: { uuid: user.uuid }});
                    let result = await conn.update(table.swiper, {see}, {where: { uuid: uuid }});
                    return result;
                }, ctx);
            }else{
                const update = await app.mysql.beginTransactionScope(async conn => {

                    let result = await conn.update(table.swiper, {see}, {where: { uuid: uuid }});
                    return result;
                }, ctx);
            }


        }else{

            const update = await app.mysql.beginTransactionScope(async conn => {
                let param = {};

                if(String.HasText(pic)) param.pic = pic;
                if(String.HasText(status)) param.status = status;

                let result = await conn.update(table.swiper, param, {where: { uuid: uuid }});
                return result;
            }, ctx);
        }



        ctx.response.success(1);

    }

    //删除 首页数据
    async deleteData(){

        const { ctx, app } = this;
        const { helper,service ,originalUrl} = ctx;
        const {table} = helper.sql;
        const {uuid} = ctx.request.body;

        const update = await app.mysql.beginTransactionScope(async conn => {
            let result = await conn.delete(table.swiper, {uuid});
            return result;
        }, ctx);

        ctx.response.success(1);
    }


    //---today  新增 的数据

    async AsearchType(){


        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {sql} = helper,param = helper.urlParam(originalUrl);
        const {page_number,page_size,models,year,address,type,keywords} = param;
        const time = "'"+new Date().Format('yyyy-MM-dd')+"'";


        let condition = "";

        const years = year.split(",");
        if(years.length>1){   condition+=" and year BETWEEN "+years[0]+" AND " +years[1];   }else{   if(String.HasText(year))  condition += " and year="+year }
        if(String.HasText(address)){condition+=" and ( " ;   address.split(",").forEach((curr,index)=>{condition += (index== 0 ?"  ":" or ")+"  a.address like '%"+curr+"%'"})  ; condition+=")"; }
        if(String.HasText(type)){ condition += " and type like '%"+type+"%'"   }else{  condition+=" and a.type not like '%美女%'";}
        if(String.HasText(keywords)){condition+="  and (a.name  like '%"+keywords+"%' or a.alias like '%"+keywords+"%') ";   }




        if(models == 1){
            condition+=" and a.create_time >"+time+" "
            condition=" a.models=1 "+condition+" order by a.create_time desc ";
        }else if(models == 2){
            condition+=" and (a.create_time >"+time+" or  a.update_time>"+time+") "
            condition=" a.models=2 and a.type like '%剧%'"+condition +" order by a.create_time desc ";
        }else if(models == 3){
            condition+=" and (a.create_time >"+time+" or  a.update_time>"+time+") "
            condition=" a.models=2 and a.type like '%综艺%'"+condition+" order by a.create_time desc ";
        }else if(models == 4){
            condition+=" and (a.create_time >"+time+" or  a.update_time>"+time+") "
            condition=" a.models=2 and a.type like '%动漫%'"+condition+" order by a.create_time desc ";
        }



        const sql4all = "select a.* from  "+sql.table.movies+" a where  "+condition +"limit "+ (page_number - 1) * page_size + ',' + page_size;
        const sql4count = "select count(*) as counts  from  "+sql.table.movies+" a where  "+condition ;

        console.log(sql4all)

        let users = await app.mysql.query(sql4all);
        let counts = 0;
        if(page_number == 1){
            counts =await app.mysql.query(sql4count);
            counts = counts[0].counts
        }

        users = users.map(curr => {
            curr.create_time = curr.create_time.Format('yyyy-MM-dd hh:mm:ss');
            return curr;
        });

        ctx.response.success({list:users,counts});
    }

}

module.exports = AppController;
