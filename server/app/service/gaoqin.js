const Service = require('egg').Service;
const {parseString} = require('xml2js');
const cheerio = require('cheerio');
let baseUrl = "http://www.gaoqingzy.com";

class WXService extends Service {

    //创建菜单
    async createTypes(){
        const { ctx, app } = this;
        const { helper,service } = ctx;
        const { type } = ctx.query;
        //构造 动漫
        await app.mysql.beginTransactionScope(async conn => {
            await conn.insert(helper.sql.table.baiwan, obj);
        }, ctx);

    }

    //获取 单个视频 电视剧 or 专集类视频
    async getAlbums(){


        const { ctx, app } = this;
        const { helper,service } = ctx;
        const { type } = ctx.query,baseTable = helper.sql.table.gaoqin,formd=3;//
        ctx.logger.warn('==start===init=');

        const baseHead = {
            Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
"Accept-Encoding":"gzip, deflate",
"Accept-Language":"zh-CN,zh;q=0.9",
"Cache-Control":"max-age=0",
Connection:"keep-alive",
Host:"www.gaoqingzy.com",
Referer:baseUrl,
"Upgrade-Insecure-Requests":1,
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36"
        }

        //接口判断做 2次 请求 处理 中转的方法
        let urlChange = async(path)=>{

            let result = await ctx.curl(decodeURIComponent(path), {  dataType: 'text',headers:baseHead});
            let $ = cheerio.load(result.data, {  normalizeWhitespace: true, xmlMode: true  });

            if(result.data.indexOf("__SAKURA")>-1){
                await ctx.curl(decodeURIComponent(baseUrl+ $("a").attr("href")), {  dataType: 'text',headers:baseHead});

                result = await ctx.curl(decodeURIComponent(path), {  dataType: 'text',headers:baseHead});
                $ = cheerio.load(result.data, {  normalizeWhitespace: true, xmlMode: true  });

            }

            return {$};

        }


        let start = async (baseU)=>{



            try{


                const {$} = await  urlChange(baseU);



                let insterDetail = async (url)=>{

                    const {$} = await  urlChange(url);

                    //解析简介
                    let obj = {},plays={};
                    obj.pic= $(".vodImg").find("img").attr("src");

                    obj.name = $(".vodh").find("h2").text();
                    obj.definition = $(".vodh").find("span").text();
                    obj.rate = $(".vodh").find("label").text();



                    $(".videoDetail").find("li").each((index,element)=>{

                        const $a = $(element);

                        console.log(index,$a.text())

                        switch (index) {

                            case 1:obj.alias      =$a.text().split(":")[1];break;
                            case 4:obj.director   =$a.text().split(":")[1];break;
                            case 3:obj.start      =$a.text().split(":")[1];break;
                            case 5:obj.type       =$a.text().split(":")[1];break;
                            case 6:obj.address    =$a.text().split(":")[1];break;
                            case 7:obj.year       =$a.text().split(":")[1];break;
                            case 13:obj.introduce    =$a.text();break;

                        }
                        //num  集数不确定 由  lable 中的值进行查看

                    });

                    $(".playBox").each((index,element)=>{
                        let $v = $(element),text=$v.text();
                        if(text.indexOf("影片点播")> -1) {
                            $v.find("li").each((sindex,selement)=>{
                                let url = $(selement).text();
                                if(url.indexOf("http") > -1) {

                                    let ls = url.split("$"),index = ls[0].replace(/[^0-9]/ig,""),path = ls[1];
                                    if(!String.HasText(plays[index])) plays[index] = [];
                                    plays[index].push(path);
                                }

                            })
                        }else if(text.indexOf("影片下载") >-1){

                        }else{
                            obj.introduce = text;
                        }
                    })



                    Object.keys(obj).forEach(curr=>{
                        let v = obj[curr];
                        if(typeof  v == "string") {
                            obj[curr] = v.trim();
                        }
                    })
                    //保存到数据库


                    obj.formd=formd//来自百万;




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

                            try{ await app.mysql.beginTransactionScope(async conn => { await conn.insert(baseTable,obj );  }, ctx);}catch (e) {  ctx.logger.info("----0------",obj.name); }
                        }else{
                            obj.models = 2;
                            obj.vid  = helper.md5(obj.name+obj.type+obj.year+obj.model+"abc");
                            obj.uuid = helper.md5(obj.name+obj.type+obj.year+obj.model);


                            await app.mysql.beginTransactionScope(async conn => {
                                try{await conn.insert(baseTable, obj);}catch (e) {  ctx.logger.info("---models-insert-----",obj.name,obj.index);  }
                                try{await conn.update(baseTable, obj, {where: { uuid: obj.uuid }});}catch (e) {  ctx.logger.info("---models-update-----",obj.name,obj.index);  }
                            }, ctx);

                            //需要二次排序

                            keys = keys.sort();


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
                                    await app.mysql.beginTransactionScope(async conn => { await conn.insert(baseTable, sobj);}, ctx);
                                }catch (e) {   ctx.logger.info("----2----",obj.name,obj.index);  }
                            }

                        }





                    }catch (e) {
                        ctx.logger.info("----base------error",e);

                    }

                }

                let urls = [];
                $("#today").find("ul").each((index,element)=>{
                    const $a = $(element).find("a");
                    if($a && String.HasText($a.attr("href"))){
                        const types = $(element).find(".btn_span").text();

                        if(types != "福利片") urls.push(baseUrl+$a.attr("href"));
                    }
                });

                // urls = ['http://www.gaoqingzy.com/?m=vod-detail-id-9.html']
                ctx.logger.warn('==start===3=',urls);

                for(let i=0,len = urls.length;i<len;i++){
                    await new Promise(resolve => { setTimeout(()=>{resolve()},0.3*1000) });
                    const turl = urls[i];

                    // ctx.logger.warn('==insterDetail===i=',i,turl)
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

        //
        //
        // //电影
        // await start(baseUrl+"/?m=vod-type-id-1.html");
        // for(let i = 1;i<260;i++){
        //     ctx.logger.warn("----------电影===",i )
        //     await new Promise(resolve => { setTimeout(()=>{resolve()},3*1000) });
        //     await start(baseUrl+"/?m=vod-type-id-1-pg-"+(i+1)+".html");
        // }
        //
        // //电视剧
        //
        // await start(baseUrl+"/?m=vod-type-id-2.html");
        // for(let i = 1;i<140;i++){
        //     ctx.logger.warn("----------电视剧===",i )
        //     await new Promise(resolve => { setTimeout(()=>{resolve()},3*1000) });
        //     await start(baseUrl+"/?m=vod-type-id-2-pg-"+(i+1)+".html");
        // }
        // //综艺
        // await start(baseUrl+"/?m=vod-type-id-3.html");
        // for(let i = 1;i<20;i++){
        //     ctx.logger.warn("----------综艺===",i )
        //     await new Promise(resolve => { setTimeout(()=>{resolve()},3*1000) });
        //     await start(baseUrl+"/?m=vod-type-id-3-pg-"+(i+1)+".html");
        // }
        //
        //
        // //动漫
        // await start(baseUrl+"/?m=vod-type-id-4.html");
        // for(let i = 1;i<40;i++){
        //     ctx.logger.warn("----------动漫===",i )
        //     await new Promise(resolve => { setTimeout(()=>{resolve()},3*1000) });
        //     await start(baseUrl+"/?m=vod-type-id-4-pg-"+(i+1)+".html");
        // }
        //
        //
        // //动漫
        // await start(baseUrl+"/?m=vod-type-id-17.html");
        // for(let i = 1;i<180;i++){
        //     ctx.logger.warn("----------动漫===",i )
        //     await new Promise(resolve => { setTimeout(()=>{resolve()},3*1000) });
        //     await start(baseUrl+"/?m=vod-type-id-17-pg-"+(i+1)+".html");
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
