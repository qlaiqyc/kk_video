const Service = require('egg').Service;
const {parseString} = require('xml2js');
const cheerio = require('cheerio');
let baseUrl = "http://bajieziyuan.com";


baseUrl = "http://bajiezy.cc";//2020-03-04

class WXService extends Service {



    //创建菜单
    async createTypes(){
        const { ctx, app } = this;
        const { helper,service } = ctx;
        const { type } = ctx.query;
        //构造 动漫
        await app.mysql.beginTransactionScope(async conn => {
            await conn.insert(helper.sql.table.bajie, obj);
        }, ctx);
    }

    //获取 单个视频 电视剧 or 专集类视频
    async getAlbums(){


        const { ctx, app } = this;
        const { helper,service } = ctx;
        const { type } = ctx.query;


        let start = async (baseU)=>{


            try{
                let result = await ctx.curl(decodeURIComponent(baseU), {  dataType: 'text'  });
                const $ = cheerio.load(result.data, {  normalizeWhitespace: true, xmlMode: true  });

                let insterDetail = async (url)=>{

                    let result = await ctx.curl(decodeURIComponent(url), {  dataType: 'text'  });
                    const $ = cheerio.load(result.data, {  normalizeWhitespace: true, xmlMode: true  });

                    //解析简介
                    let obj = {},plays={};
                    obj.pic= $(".videoPic").find("img").attr("src");
                    obj.introduce =  $(".contentNR").text();
                    $(".videoDetail").find("li").each((index,element)=>{

                        const $a = $(element),$b = $(element).find("div");
                        switch (index) {
                            case 0:obj.name       =$(element).text().split(":")[1];break;
                            case 1:obj.alias      =$(element).text().split(":")[1];break;
                            case 2:obj.definition =$(element).text().split(":")[1];break;
                            case 3:obj.start      =$(element).text().split(":")[1];break;
                            case 4:obj.director   =$(element).text().split(":")[1];break;
                        }
                        if($b.length > 0){
                            if(index == 5){
                                $b.each((a,b)=>{    switch (a) {   case 0:obj.type       =$(b).text().split(":")[1];break;  }});
                            }
                            if(index == 6){
                                $b.each((a,b)=>{    switch (a) {   case 1:obj.address    =$(b).text().split(":")[1];break;  }});
                            }
                            if(index == 7){
                                $b.each((a,b)=>{    switch (a) {  case 0:obj.num         =$(b).text().split(":")[1];break; case 1:obj.year       =$(b).text().split(":")[1];break;  }});
                            }
                            if(index == 8){
                                $b.each((a,b)=>{    switch (a) {   case 1:obj.rate       =$(b).text().split(":")[1];break;  }});
                            }

                        }


                    });
                    $(".movievod").find("li").each((index,element)=>{
                        let url = $(element).text();
                        if(url.indexOf("http") > -1) {
                            let ls = url.split("$"),index = ls[0],path = ls[1];
                            if(!String.HasText(plays[index])) plays[index] = [];
                            plays[index].push(path);
                        }
                    });



                    Object.keys(obj).forEach(curr=>{
                        let v = obj[curr];
                        if(typeof  v == "string") {
                            obj[curr] = v.trim();
                        }
                    })
                    //保存到数据库


                    try{


                        let keys = Object.keys(plays),isOne = obj.definition && obj.definition.indexOf("集")<0;

                        if( keys.length == 1 && isOne){

                            //电影类

                            obj.models = 1;
                            obj.uuid = helper.md5(obj.name+obj.type+obj.year+obj.model);
                            for(let i =0,len=keys.length;i<len;i++ ){
                                const purls = plays[keys[i]];
                                obj.play_url_1 =""; obj.play_url_2 =""; obj.play_url_3 =""
                                purls.forEach((curr,s)=>{
                                    if(s < 3) obj["play_url_"+(s+1)] = curr;
                                });
                            }

                            try{ await app.mysql.beginTransactionScope(async conn => { await conn.insert(helper.sql.table.bajie,obj );  }, ctx);}catch (e) {  ctx.logger.info("----0------",obj.name); }
                        }else{
                            obj.models = 2;
                            obj.vid  = helper.md5(obj.name+obj.type+obj.year+obj.model+"abc");
                            obj.uuid = helper.md5(obj.name+obj.type+obj.year+obj.model);


                            await app.mysql.beginTransactionScope(async conn => {
                                try{await conn.insert(helper.sql.table.bajie, obj);}catch (e) {  ctx.logger.info("----1------",obj.name,obj.index);  }
                                try{await conn.update(helper.sql.table.bajie, obj, {where: { uuid: obj.uuid }});}catch (e) {  ctx.logger.info("---models-update-----",obj.name,obj.index);  }

                            }, ctx);

                            for(let i =0,len=keys.length;i<len;i++ ){
                                const purls = plays[keys[i]];
                                obj.index = keys[i];
                                obj.play_url_1 =""; obj.play_url_2 =""; obj.play_url_3 =""
                                purls.forEach((curr,s)=>{
                                    if(s < 3) obj["play_url_"+(s+1)] = curr;
                                });

                                obj.models = 3;
                                obj.uuid = helper.md5(obj.name+obj.type+obj.year+obj.model+obj.index);


                                try{
                                    let sobj = Object.assign({},obj);sobj.alias="",sobj.name="",sobj.start="",sobj.director="",sobj.year="",sobj.address="",sobj.type="",sobj.introduce="";
                                    await app.mysql.beginTransactionScope(async conn => { await conn.insert(helper.sql.table.bajie, sobj);}, ctx);
                                }catch (e) {ctx.logger.info("----2----",obj.name,obj.index);  }
                            }

                        }





                    }catch (e) {
                        ctx.logger.info("----base------error",e);

                    }

                }

                let urls = [];
                $("#data_list").find("tr.DianDian").each((index,element)=>{
                    let isAdd= true,path="";
                    $(element).find("td").each(async(i,obj)=>{
                        if(i==0){
                            path =baseUrl+$(obj).find("a").attr("href");
                        }
                        if(i==2){
                            let type = $(obj).find("a").text();
                            if(type && (type.indexOf("美女")>-1)){
                                isAdd= false;
                            }
                        }


                    });

                    if(isAdd)urls.push(path);
                });
                // urls= ["http://zy.bajieziyuan.com/?m=vod-detail-id-125215.html"];
                // urls.length = 5;
                for(let i=0,len = urls.length;i<len;i++){
                    await new Promise(resolve => { setTimeout(()=>{resolve()},500) });
                    const turl = urls[i];
                    try{await insterDetail(turl);}catch (e) {   ctx.logger.warn('==insterDetail===error=',turl,e);}

                }

            }catch (e) {
                ctx.logger.warn('==start===error=',e);
            }

        }


        //首页
        await start(baseUrl);
        for(let i = 1;i<3;i++){
            ctx.logger.warn("----------首页===",i )
            await new Promise(resolve => { setTimeout(()=>{resolve()},3*1000) });
            await start(baseUrl+"/?m=vod-index-pg-"+(i+1)+".html");
        }




        // //电影
        // await start(baseUrl+"/?m=vod-type-id-1.html");
        // for(let i = 1;i<230;i++){
        //     ctx.logger.warn("----------电影===",i )
        //     await new Promise(resolve => { setTimeout(()=>{resolve()},3*1000) });
        //     await start(baseUrl+"/?m=vod-type-id-1-pg-"+(i+1)+".html");
        // }
        //
        //
        //
        //
        // //电视剧
        // await start(baseUrl+"/?m=vod-type-id-2.html");
        // for(let i = 1;i<30;i++){
        //     ctx.logger.warn("----------电视剧===",i )
        //     await new Promise(resolve => { setTimeout(()=>{resolve()},3*1000) });
        //     await start(baseUrl+"/?m=vod-type-id-2-pg"+(i+1)+".html");
        // }
        // //综艺
        // await start(baseUrl+"/?m=vod-type-id-3.html");
        // for(let i = 1;i<4;i++){
        //     ctx.logger.warn("----------综艺===",i )
        //     await new Promise(resolve => { setTimeout(()=>{resolve()},3*1000) });
        //     await start(baseUrl+"/?m=vod-type-id-3-pg"+(i+1)+".html");
        // }
        //
        //
        // //动漫
        // await start(baseUrl+"/?m=vod-type-id-4.html");
        // for(let i = 1;i<10;i++){
        //     ctx.logger.warn("----------动漫===",i )
        //     await new Promise(resolve => { setTimeout(()=>{resolve()},3*1000) });
        //     await start(baseUrl+"/?m=vod-type-id-4-pg"+(i+1)+".html");
        // }
        //
        //
        // //VIP 福利
        // await start(baseUrl+"/?m=vod-type-id-46.html");
        // for(let i = 1;i<10;i++){
        //     ctx.logger.warn("----------VIP 福利===",i )
        //     await new Promise(resolve => { setTimeout(()=>{resolve()},3*1000) });
        //     await start(baseUrl+"/?m=vod-type-id-46-pg-"+(i+1)+".html");
        // }


    }
}

module.exports = WXService;
