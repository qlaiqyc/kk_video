const Service = require('egg').Service;
const {parseString} = require('xml2js');
const cheerio = require('cheerio');
const fik = ['·','：','[',' '];

//自动获取数据
class WXService extends Service {



    async getTx(){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {table} = helper.sql

        try{
            let list = [],initInde = true;

            let result_0 = await  this.tx_V0();
            let result_1 = await  this.tx_V1();
            let result_2 = await  this.tx_V2();
            let result_3 = await  this.tx_V3();
            let result_4 = await  this.tx_V4();

            list = [{name:"精选",type:"0",models:result_0},{name:"电影",type:"1",models:result_1},  {name:"电视剧",type:"2",models:result_2},{name:"综艺",type:"3",models:result_3},{name:"动漫",type:"4",models:result_4}];

            /**
             * 1.更新菜单 仅仅是第一次使用
             *
             * 2.保存swiper 和 model到数据库
             ***/

            //初始话 主菜单
            if(initInde){
                const initIndex = await app.mysql.beginTransactionScope(async conn => {

                    try{await conn.query("DELETE FROM "+table.index+" WHERE id > 4");}catch (e) { }
                    for(let i =0,len = list.length;i<len;i++){
                        const obj = list[i],{models,swiper}=obj.models;
                        try{await conn.insert(table.index,{type:0,pid:obj.type,name:"Swiper",uuid: helper.md5(0+obj.type+"Swiper")});}catch (e) { }
                        for(let j =0,jlen =models.length;j<jlen;j++){
                            let curr = models[j];
                            try{ await conn.insert(table.index,{type:1,pid:obj.type,name:curr.name,uuid: helper.md5(1+obj.type+curr.name)});}catch (e) { }
                        }
                    }

                }, ctx);
            }

            //获取菜单ID
            let menus =  await app.mysql.query("select *  from  "+table.index),mapId={};
            menus.forEach(curr=>{  if(!String.HasText(curr.pid)) mapId[curr.id]={title:curr.name}  });
            menus.forEach(curr=>{  if(String.HasText(curr.pid)) mapId[curr.pid][curr.name]=curr.id  });

            list = list.map(curr=>{
                let map = mapId[curr.type];
                curr.models.models =curr.models.models.map(obj=>{
                    obj.id = map[obj.name];
                    return obj;
                })

                curr.models.swiper = {
                    id:map["Swiper"],
                    list:curr.models.swiper
                }
                return curr;
            })

            //更新  主要内容
            const updateSwiper = await app.mysql.beginTransactionScope(async conn => {
                try{
                    for(let i =0,len = list.length;i<len;i++){
                        const obj = list[i],{models,swiper}=obj.models;

                        //swiper 更新
                        for(let j =0,jlen =swiper.list.length;j<jlen;j++){
                            let curr = swiper.list[j];
                            const uuid =  helper.md5(obj.type+swiper.id+curr.path);


                            try{   await conn.insert(table.swiper,{type:obj.type,way:swiper.id,path:curr.path,pic:curr.pic,title:curr.title,uuid:uuid,status:curr.status})}catch (e) {   }
                        }

                        for(let j =0,jlen =models.length;j<jlen;j++){
                            let curr = models[j];
                            for(let k =0,klen =curr.list.length;k<klen;k++){
                                let kobj = curr.list[k];

                                const uuid =  helper.md5(obj.type+curr.id+kobj.uuid);
                                //默认开启
                                try{ await conn.insert(table.swiper,{type:obj.type,way:curr.id,path:kobj.uuid,pic:kobj.pic,title:kobj.title,uuid:uuid,status:1})}catch (e) {   }
                            }


                        }
                    }
                }catch (e) {
                    console.log(e);
                }



            }, ctx);
        }catch (e) {
            ctx.logger.info("---getTx-----",JSON.stringify(e))
        }






        //update  全局变量

        try{
            let a = {time:new Date().getTime(),data:{}};

            let getData = async (dparam)=>{
                let result = await  service.api.getIndex(dparam);

                let endData = await service.api.voIndex(result,dparam);
                return endData;
            };


            a.data["0"] = await getData({type:0});
            a.data["1"] = await getData({type:1});
            a.data["2"] = await getData({type:2});
            a.data["3"] = await getData({type:3});
            a.data["4"] = await getData({type:4});

            helper.global.set("QindexData",a);

        }catch (e) {
            ctx.logger.info("---getTx-update----",JSON.stringify(e))
        }



        return 1;



    }

    async tx_commone_swiper(ls){

        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {table} = helper.sql;



        const sql4all = "select a.* from  "+table.movies+" a where a.models!=3  and  a.name REGEXP '"+Object.keys(ls).map(curr=>{  return curr  }).join("|")+"'  order by a.year desc";



        ctx.logger.info(sql4all);
        console.log(sql4all)

        let users = await app.mysql.query(sql4all);


        users = users.filter(curr=>{
            let staus = curr.name in ls;
            if(staus)curr.pic = ls[curr.name]
            return staus;
        }).map(curr=>{
            return {path:curr.uuid,pic:curr.pic,title:curr.name,status:1};
        });

        return  users;
    }

    async tx_commone_models(models,allList,type,like){

        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {table} = helper.sql;

        let bsql = "select a.* from  "+table.movies+" a where a.models!=3  and  a.name REGEXP '"+allList.map(curr=>{ return curr.title;  }).join("|")+"' order by a.year desc";

        if(type == 1) bsql = "select a.* from  "+table.movies+" a where a.models=1  and  a.name REGEXP '"+allList.map(curr=>{ return curr.title;  }).join("|")+"' order by a.year desc";
        if(type == 2) bsql = "select a.* from  "+table.movies+" a where a.models=2 and a.type like '%"+like+"%' and   a.name REGEXP '"+allList.map(curr=>{ return curr.title;  }).join("|")+"' order by a.year desc";





        let ms = await app.mysql.query(bsql),mp4ms= {};
        //由名称+type 进行匹配


        ms.forEach(curr=>{
            mp4ms[curr.name] = curr;
        });


        models = models.map(curr=>{
            curr.list = curr.list.filter(obj=>{
                let key = obj.title,isIn = key in mp4ms;
                return isIn;
            }).map(obj=>{
                let key = obj.title,isIn = key in mp4ms;
                delete obj.pic;
                return Object.assign(mp4ms[key],obj);
            })

            return curr;
        })

        return  models;
    }

    //精选 数据页面获取 ，不够的话需要进行填充
    async tx_V0(){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {table} = helper.sql;

        let result = await ctx.curl(decodeURIComponent("https://v.qq.com/"), {  dataType: 'text'  });
        const $ = cheerio.load(result.data, {  normalizeWhitespace: true, xmlMode: true  });
        let swiper={},models=[];


        //swiper 获取
        $("div.slider_nav_watched").find("a.nav_link").each((index,element)=>{
            const text = $(element).find(".title_text").text();
            if(String.HasText(text))swiper[text] = "http:"+$(element).attr("data-bgimage");
        });

        swiper = await this.tx_commone_swiper(swiper);



        //精选内容获取

        let modelSFilter = {'电影':"1","同步剧场":"2","综艺":"2","动漫":"2"},allList = [];
        $("div.mod_row_box").each((index,element)=>{
            const tit = ($(element).find("a.title_link").text()+"").trim();

            if(String.HasText(tit) && (tit in modelSFilter)){
                let list = [];
                $(element).find("div.list_item").each((s,curr)=>{
                    let mov = {
                        title:$(curr).find("a.figure_title").text(),
                        desc:$(curr).find("div.figure_desc").text(),
                        pic:$(curr).find("img.figure_pic").attr("src"),
                        rate:$(curr).find("div.figure_score").text(),
                        time:$(curr).find("div.figure_caption").text(),
                    };
                    fik.forEach(obj=>{   mov.title = mov.title.split(obj)[0]  });

                    list.push(mov)

                    allList.push(mov);

                });

                models.push({name:tit,list:list})
            }

        });


        models = await this.tx_commone_models(models,allList,0,"");


        return {swiper,models};



    }


    //动漫 数据页面获取 ，不够的话需要进行填充
    async tx_V4(){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {table} = helper.sql;

        let result = await ctx.curl(decodeURIComponent("https://v.qq.com/channel/cartoon"), {  dataType: 'text'  });
        const $ = cheerio.load(result.data, {  normalizeWhitespace: true, xmlMode: true  });
        let swiper={},models=[];


        //swiper 获取
        $("div.slider_nav_watched").find("a.nav_link").each((index,element)=>{
            const text = $(element).find(".title_text").text();
            if(String.HasText(text))swiper[text] = "http:"+$(element).attr("data-bgimage");
        });
        //精选内容获取
        swiper = await this.tx_commone_swiper(swiper);


        let modelSFilter = {'热搜推荐':1,"精选国漫":'1',"精选日漫":1},allList = [];
        $("div.mod_row_box").each((index,element)=>{
            const tit = ($(element).find(".mod_title").text()+"").trim();



            if(String.HasText(tit) && (tit in modelSFilter)){
                let list = [],skey = tit == "综艺节目单" ? "div.update_item":"div.list_item";
                $(element).find(skey).each((s,curr)=>{
                    let mov = {
                        title:$(curr).find("a.figure_title").text(),
                        desc:$(curr).find("div.figure_desc").text(),
                        pic:$(curr).find("img.figure_pic").attr("src"),
                        rate:$(curr).find("div.figure_score").text(),
                        time:$(curr).find("div.figure_caption").text(),
                    };
                    fik.forEach(obj=>{   mov.title = mov.title.split(obj)[0]  });

                    list.push(mov)

                    allList.push(mov);

                });

                models.push({name:tit,list:list})
            }

        });

        models = await this.tx_commone_models(models,allList,2,"漫");

        return {swiper,models};



    }

    //综艺 数据页面获取 ，不够的话需要进行填充
    async tx_V3(){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {table} = helper.sql;

        let result = await ctx.curl(decodeURIComponent("https://v.qq.com/channel/variety"), {  dataType: 'text'  });
        const $ = cheerio.load(result.data, {  normalizeWhitespace: true, xmlMode: true  });
        let swiper={},models=[];


        //swiper 获取
        $("div.slider_nav_watched").find("a.nav_link").each((index,element)=>{
            const text = $(element).find(".title_text").text();
            if(String.HasText(text))swiper[text] = "http:"+$(element).attr("data-bgimage");
        });
        //精选内容获取
        swiper = await this.tx_commone_swiper(swiper);


        let modelSFilter = {'热门栏目':"1","为你推荐":'1',"综艺节目单":1},allList = [];
        $("div.mod_row_box").each((index,element)=>{
            const tit = ($(element).find(".mod_title").text()+"").trim();


            if(String.HasText(tit) && (tit in modelSFilter)){
                let list = [],skey = tit == "综艺节目单" ? "div.update_item":"div.list_item";
                $(element).find(skey).each((s,curr)=>{
                    let mov = {
                        title:$(curr).find("a.figure_title").text(),
                        desc:$(curr).find("div.figure_desc").text(),
                        pic:$(curr).find("img.figure_pic").attr("src"),
                        rate:$(curr).find("div.figure_score").text(),
                        time:$(curr).find("div.figure_caption").text(),
                    };
                    fik.forEach(obj=>{   mov.title = mov.title.split(obj)[0]  });

                    list.push(mov)

                    allList.push(mov);

                });

                models.push({name:tit,list:list})
            }

        });

        models = await this.tx_commone_models(models,allList,2,"综艺");


        return {swiper,models};



    }

    //电视剧 数据页面获取 ，不够的话需要进行填充
    async tx_V2(){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {table} = helper.sql;

        let result = await ctx.curl(decodeURIComponent("https://v.qq.com/channel/tv"), {  dataType: 'text'  });
        const $ = cheerio.load(result.data, {  normalizeWhitespace: true, xmlMode: true  });
        let swiper={},models=[];


        //swiper 获取
        $("div.slider_nav_watched").find("a.nav_link").each((index,element)=>{
            const text = $(element).find(".title_text").text();
            if(String.HasText(text))swiper[text] = "http:"+$(element).attr("data-bgimage");
        });
        //精选内容获取
        swiper = await this.tx_commone_swiper(swiper);


        let modelSFilter = {'热剧精选':"1","海外独播剧场":'1',"会员专区":1},allList = [];
        $("div.mod_row_box").each((index,element)=>{
            const tit = ($(element).find(".mod_title").text()+"").trim();


            if(String.HasText(tit) && (tit in modelSFilter)){
                let list = [];
                $(element).find("div.list_item").each((s,curr)=>{
                    let mov = {
                        title:$(curr).find("a.figure_title").text(),
                        desc:$(curr).find("div.figure_desc").text(),
                        pic:$(curr).find("img.figure_pic").attr("src"),
                        rate:$(curr).find("div.figure_score").text(),
                        time:$(curr).find("div.figure_caption").text(),
                    };
                    fik.forEach(obj=>{   mov.title = mov.title.split(obj)[0]  });

                    list.push(mov)

                    allList.push(mov);

                });

                models.push({name:tit,list:list})
            }

        });

        models = await this.tx_commone_models(models,allList,2,"剧");

        return {swiper,models};
    }

    //电影页面 数据页面获取 ，不够的话需要进行填充
    async tx_V1(){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {table} = helper.sql;

        let result = await ctx.curl(decodeURIComponent("https://v.qq.com/channel/movie"), {  dataType: 'text'  });
        const $ = cheerio.load(result.data, {  normalizeWhitespace: true, xmlMode: true  });
        let swiper={},models=[];


        //swiper 获取
        $("div.slider_nav_watched").find("a.nav_link").each((index,element)=>{
            const text = $(element).find(".title_text").text();
            if(String.HasText(text))swiper[text] = "http:"+$(element).attr("data-bgimage");
        });
        //精选内容获取


        swiper = await this.tx_commone_swiper(swiper);

        let modelSFilter = {'首播影院':"1","排行榜":"2","环球影厅":"2","第32届金鸡奖佳片大赏":"2"},allList = [];
        $("div.mod_row_box").each((index,element)=>{
            const tit = ($(element).find(".mod_title").text()+"").trim();

            if(String.HasText(tit)  && (tit in modelSFilter)){
                let list = [];
                $(element).find("div.list_item").each((s,curr)=>{

                    if(s<20){
                        let mov = {
                            title:$(curr).find("a.figure_title").text(),
                            desc:$(curr).find("div.figure_desc").text(),
                            pic:$(curr).find("img.figure_pic").attr("src"),
                            rate:$(curr).find("div.figure_score").text(),
                            time:$(curr).find("div.figure_caption").text(),
                        };
                        fik.forEach(obj=>{   mov.title = mov.title.split(obj)[0]  });

                        list.push(mov)
                        allList.push(mov);
                    }
                });

                models.push({name:tit,list:list})
            }
        });
        models = await this.tx_commone_models(models,allList,1);

        return {swiper,models};
    }



    //获取排行榜
    async getRank(){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {table} = helper.sql;


        let result = await ctx.curl(decodeURIComponent("https://v.qq.com/biu/ranks/?t=hotsearch"), {  dataType: 'text'  });
        const $ = cheerio.load(result.data, {  normalizeWhitespace: true, xmlMode: true  });
        let ls = {};let keys = {icon_hold_xs:0,icon_rise_xs:1,icon_decline_xs:2}//0 平常  1 上升 2 下降  3 没有反应

        let map = {"总榜单":0,"电影":6,"电视剧":7,"综艺":8,"动漫":9}

        $("#app").find(".mod_rank_wrap").each((index,element)=>{

           try{
               $(element).find(".mod_rank_figure").each((sindex,el)=>{
                   const title = $(el).find(".mod_rank_title").find(".title").text();
                   const list = [];
                   $(el).find(".item").each((i,obj)=>{
                       let text =  $(obj).find(".name").text();
                       let $bi =  $(obj).find("i"),status = 3;//
                       if(String.HasText($bi)){

                           let ty = $bi.attr('class')+"";
                           Object.keys(keys).forEach((curr)=>{
                               if(ty.indexOf(curr+"") > -1)   status = keys[curr];
                           })
                       }

                       list.push({text,status});
                   });

                   ls[title] = list;
               })
           }catch (e) {
               console.log(e);
           }
        });

        // await app.mysql.beginTransactionScope(async conn => {
        //     try{await conn.insert(table.reank, obj);}catch (e) {  ctx.logger.info("---models-insert-----",obj.name,obj.index);  }
        //     try{await conn.update(table.reank, obj, {where: { uuid: obj.uuid }});}catch (e) {  ctx.logger.info("---models-update-----",obj.name,obj.index);  }
        // }, ctx);
        //


        let results = Object.keys(ls).filter(curr=>{  return  (curr in map )  }).map(curr=>{

            curr = {name:curr,type:map[curr],list:ls[curr]};



            return curr;
        })


        try{

            for(let i =0,len =results.length;i<len;i++ ){
                let obj =results[i];
                obj = {type:obj.type,name:obj.list.map(curr=>{return  curr.text+"◎"+curr.status}).join("©") }


                try{await app.mysql.beginTransactionScope(async conn => {await conn.insert(table.rank,obj ); }, ctx);}catch (e) {  }
                try{await app.mysql.beginTransactionScope(async conn => {await await conn.update(table.rank,obj,{where: { type: obj.type }}  ); }, ctx);}catch (e) {  }


            }

        }catch (e) {

            console.log(e);
        }



    }
}

module.exports = WXService;
