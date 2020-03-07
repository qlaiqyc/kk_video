'use strict';


const Controller = require('egg').Controller;
const {parseString} = require('xml2js');
const cheerio = require('cheerio');
// GET	/posts	posts	app.controllers.posts.index
// GET	/posts/new	new_post	app.controllers.posts.new
// GET	/posts/:id	post	app.controllers.posts.show
// GET	/posts/:id/edit	edit_post	app.controllers.posts.edit
// POST	/posts	posts	app.controllers.posts.create
// PUT	/posts/:id	post	app.controllers.posts.update
// DELETE	/posts/:id	post	app.controllers.posts.destroy//

class dController extends Controller {


    //自己资源获取数据
    async  getIndex(){

        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;

        let result = await  service.api.getIndex(helper.urlParam(originalUrl));
        let headers =[{title:"精选",url:"0"},{title:"电影",url:"1"},{title:"电视剧",url:"2"},{title:"综艺",url:"3"},{title:"动漫",url:"4"}];
        let endData = await service.api.voIndex(result),swiper=[],models=[];

        endData.forEach(curr=>{
            let {big,list,keys} = curr;
            if(!String.HasText(big)) big=[]; if(!String.HasText(list)) list=[]; if(!String.HasText(keys)) keys=[];
          if(curr.type == 0){
              swiper = big.concat(list).concat(keys).map(obj=>{ return { pic: obj.pic,   se: '1', title: obj.title,  ss: '1',  cid: obj.uuid,  url: '1' };  });
          }else{
              models.push({
                  title:curr.name,
                  list:big.concat(list).concat(keys).map(obj=>{

                      return {
                          pic: obj.pic,
                          se: obj.definition,
                          title: obj.title,
                          ss: '',
                          cid: obj.path,
                          remark: obj.introduce,//'甜版前半生？所以贺涵在吗',
                          url: ''
                      }
                  }).filter((curr,index)=>{ ;return index <8})
              })
          }
        })



        this.ctx.response.success({swiper,models,headers});
    }
    async  getIndex3(){



        const { service } = this.ctx;
        let models= [],swiper=[],headers=[];

        headers =[{title:"精选",url:"0"},{title:"电影",url:"1"},{title:"电视剧",url:"2"},{title:"综艺",url:"3"},{title:"动漫",url:"4"}];

        let result = await  service.api.getIndex();



        //vo 处理
        const info={
            swiper:{list:[]},
            movies: {list:[],keys:[],big:[]},
            tv: {list:[],keys:[]},
            variety: {list:[],keys:[]},
            anime: {list:[],keys:[]}
        };


        result.forEach(curr=>{
            if(curr.way == 0 ){
                info.swiper.list.push(curr);
            }
            if(curr.way == 1 ){
                if(curr.see == "1")info.movies.big.push(curr);
                if(curr.see == "0")info.movies.list.push(curr);
                if(curr.see == "2")info.movies.keys.push(curr);
            }

            if(curr.way == 2 ){
                if(curr.see == "0")info.tv.list.push(curr);
                if(curr.see == "2")info.tv.keys.push(curr);
            }

            if(curr.way == 3 ){
                if(curr.see == "0")info.variety.list.push(curr);
                if(curr.see == "2")info.variety.keys.push(curr);
            }
            if(curr.way == 4 ){
                if(curr.see == "0")info.anime.list.push(curr);
                if(curr.see == "2")info.anime.keys.push(curr);
            }

        });

        const vo = (curr)=>{



            return { pic: curr.pic,
                se: curr.definition,
                title: curr.title,
                ss: '',
                cid: curr.path,
                remark: curr.introduce,//'甜版前半生？所以贺涵在吗',
                url: '' }

        }

        swiper = info.swiper.list.map((curr)=>{

            return { pic: curr.pic,
                se: '1',
                title: curr.title,
                ss: '1',
                cid: curr.buuid,
                url: '1' }

        })

        models = models.concat([{
            title:"火热电影",
            list:info.movies.list.map(vo).filter((curr,index)=>{ ;return index <8})
        }]).concat([{
            title:"电视剧",
            list:info.tv.list.map(vo).filter((curr,index)=>{return index <8})
        }]).concat([{
            title:"热门综艺",
            list:info.variety.list.map(vo).filter((curr,index)=>{return index <8})
        }]).concat([{
            title:"热门动漫",
            list:info.anime.list.map(vo).filter((curr,index)=>{return index <8})
        }])



        this.ctx.response.success({swiper,models,headers});

    }


    async getSearch(){

        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        let {page_number,page_size,keyWord} = helper.urlParam(originalUrl);
        if(!String.HasText(page_number)) page_number =1;
        if(!String.HasText(page_size)) page_size =30;


        let endData ={
            list:[]//当前模块类型
        };


      try{
          const {users,counts} = await service.api.getSearch({page_number,page_size,keyword:keyWord.split(" ")[0]});


          endData.list = users.map(curr=>{

              return  {
                  type: curr.type,
                  title: curr.name,
                  actor: curr.start,
                  area: [curr.year,curr.address, curr.definition].filter(o=>{return String.HasText(o)}).join(" | "),
                  pic:curr.pic,
                  cid: curr.uuid,
                  vid: '',
                  form: '',
                  url: '' }

          }) ;

      }catch (e) {
          console.log(e);
      }

        ctx.response.success(endData);

    }

    //获取视频详情 (包括 当前视频连接，简介  ，集数，判断是是否属于-专辑)
    async getDetail(){

        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
      try{
          const result = await service.api.getDetail();
           result.rate = 0;
          if(!String.HasText(result.num))result.num = 0.0;
          result.ls  = result.ls.map(curr=>{
              curr.rate = 0;
              if(!String.HasText(curr.num))curr.num =0.0;
              return curr;
          })


          ctx.response.success(result);
      }catch(e){
          console.log(e);
      }
    }


    //====


    //首页获取视频信息
    async getIndex2(){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        let endData = "";
        let sdata ={};

        let {url}  = helper.urlParam(originalUrl);
        if(!(String.HasText(url) && url.length > 0)) url ='https://m.v.qq.com/';

        try{

            let result = await ctx.curl(url, {
                dataType: 'text',
            });

            const $ = cheerio.load(result.data, {
                normalizeWhitespace: true,
                xmlMode: true
            });



            const defFun = {
                data:{

                    //se 图片底部显示，ss 图片顶部显示
                    swiper:[],
                    models:[],
                    headers:[]
                },
                swiper(){
                    const {swiper} =this.data;


                    $(".swiper .swiper-slide").each(function(index, element) {
                        const el = $(element);
                        let cid = helper.urlParam(el.find("a").attr("href"))["cid"];
                        const title =el.find(".item_title").text();
                        swiper.push({
                            pic:el.find("img").attr("dsrc"),
                            se:el.find(".item_count").text(),
                            title,
                            ss:el.find(".text").text(),
                            cid,
                            url:"https://v.qq.com/x/cover/"+cid+".html"
                        });
                    });
                },
                models(){
                    const {models} =this.data;
                    $(".feeds_block").each(function(index, element) {
                        const el = $(element);
                        const obj = {title:"",list:[]};
                        obj.title =el.find(".block_title").text();
                        el.find(".figures_list  .list_item").each((index,curr)=>{
                            const cu = $(curr);
                            let cid = helper.urlParam(cu.find("a").attr("href"))["cid"];
                            obj.list.push({
                                pic:cu.find("img").attr("dsrc"),
                                se:cu.find(".item_count").text(),
                                title:cu.find(".item_title").text(),
                                ss:cu.find(".text").text(),
                                cid:cid,
                                remark:cu.find(".item_remark").text(),
                                url:"https://v.qq.com/x/cover/"+cid+".html"
                            });
                        });

                       if(obj.list.length>0) models.push(obj);

                    });


                },
                headers(){
                    const {headers} =this.data;
                    let filter = ["VIP","娱乐","游戏"];//暂时过滤页面结构不一样需要单独写
                    $(".nav_list .swiper-slide").each(function(index, element) {
                        const cu = $(element);
                        let url = cu.find("a").attr("href");
                        const  title = cu.find("a span").text();
                        if(!filter.includes(title)){
                            headers.push({
                                title,
                                url:url.startsWith("http") ?url:("https://m.v.qq.com"+url),
                            });
                        }

                    });
                },


                init(){
                    this.swiper();
                    this.models();
                    this.headers();

                }

            };

            defFun.init();
            sdata = defFun.data;

        }catch (e) {
        }


        console.log(sdata);
        ctx.response.success(sdata);
    }

    //获取视频详情 (包括 当前视频连接，简介  ，集数，判断是是否属于-专辑)
    async getDetail2(){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        let endData ={
            url:"",
            list:[],//列表搜索
            detail:{}//详情
        };
        let {cid ,vid,url}  = helper.urlParam(originalUrl);
        console.log(cid,vid,url,helper.urlParam(originalUrl));
        //拿视频源
        if(!String.HasText(vid)){
            let param   = await helper.tx.getVid(cid,ctx);
            vid = param.vid;
            url = param.url;
        }
        console.log(url+"-----");
        endData.url= await helper.tx.getVideoInfo({vid,url},ctx);

        // endData.url= endData.url.replace("https:","http:")
        //解析网页

        try{

            let result = await ctx.curl(decodeURIComponent(url), {
                dataType: 'text',
            });
            const $ = cheerio.load(result.data, {
                normalizeWhitespace: true,
                xmlMode: true
            });



            const defFun = {
                data:{
                    list:[],//集数
                    detail:{}
                },
                list(){
                    const {list} =this.data;

                    const baseXml = {
                        def(){
                            const run = (index,element)=>{
                                const el = $(element).find("a");
                                let src = "";
                                try{src =$(element).find("img").attr("src")}catch(e){src=""}

                                let status = 0;
                                if(src && src.indexOf("vip.png") >-1)  status =2;
                                if(src && src.indexOf("yu.png") >-1)  status =1;

                                list.push({
                                    url:"https://v.qq.com"+el.attr("href"),
                                    title:el.attr("title") || el.text(),
                                    vid:$(element).attr("id"),
                                    type:"tx_def",
                                    status:status//0 正常播放 1  预告  2  vip 视频
                                });
                            };
                            $(".mod_episode .item_detail_half").each(run);
                            //兼容不同的
                            $(".mod_episode .item").each(run);
                        },
                        variety(){
                            //综艺
                            try{
                                $("#video_scroll_wrap").find(".figure_list li.list_item").each((index,element)=>{
                                    const el = $(element).find(".figure_detail"),url = el.attr("href");
                                    const cid =  url.split("/").reverse()[0].replace(".html","");
                                    let src = "";
                                    try{src =$(element).find(".mark_v img").attr("src")}catch(e){src=""}

                                    let status = 0;
                                    if(src && src.indexOf("vip.png") >-1)  status =2;
                                    if(src && src.indexOf("yu.png") >-1)  status =1;

                                    list.push({
                                        url:"https://v.qq.com"+url,
                                        title:el.find(".figure_title").text(),
                                        vid:"",
                                        cid:cid,
                                        type:"tx_variety",
                                        status:status//0 正常播放 1  预告  2  vip 视频
                                    });
                                });
                            }catch (e) {

                            }

                        }
                    }

                 try{
                     baseXml.def();
                     baseXml.variety();
                 }catch (e) {
                     console.error(e);
                 }


                },
                detail(){
                    let {detail} =this.data;
                    $(".mod_row_box").each((index,curr)=>{
                        if(index == 0){
                            const el = $(curr);
                            detail={
                                title:el.find(".title").text(),
                                director:el.find(".director").text().replace(/&nbsp;/ig, ""),
                                summary:el.find("p.summary").text()
                            };
                        }
                    });

                    url = decodeURIComponent(url);
                    detail.webUrl = url;
                    detail.basePlay = "https://url.js.cn/?url="+url;;
                    detail.basePlay="https://www.bihaijx.com/?url="+url;
                    detail.basePlay = "https://meigui.qqqq-kuyun.com/20191016/23303_723c3c1a/index.m3u8";
                    // detail.basePlay = "https://dd.duzheba.cn/dd/?ptag=360kan.movie.pay&url=";

                    console.log(detail.basePlay)

                    this.data.detail = detail

                },
                init(){
                    this.list();
                    this.detail();
                }

            };

            defFun.init();
            endData = Object.assign(endData,defFun.data)

        }catch (e) {
        }

        ctx.response.success(endData);
    }

    //全网搜索-key
    async getSearchKeys(){

        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        let endData ={
            tabs:[],//列表搜索
            list:[]//当前模块类型
        };
        let {id}  = helper.urlParam(originalUrl);
        if(!String.HasText(id)) id=0;


        try{

            let {list,tabs} = endData;

            let result = await ctx.curl(decodeURIComponent("https://node.video.qq.com/x/api/hot_mobilesearch?channdlId="+id+"&_="+new Date().getTime()), {
                dataType: 'json',
            });

            // console.log(result.data.);
            result = result.data.data;

            // console.log(result);


            if(String.HasText(result.itemList))result.itemList.forEach(curr=>{
                list.push({
                    title:curr.title,
                    position:curr.position,
                    order:curr.changeOrder,
                    url:curr.action.url.split("?from=")[1],
                });
            });
            if(String.HasText(result.rankNavList))result.rankNavList.forEach(curr=>{
                tabs.push({
                    title:curr.itemValue,
                    key:curr.itemKey,
                    id:curr.itemId
                });
            })

        }catch (e) {
            console.log(e);
        }



        ctx.response.success(endData);

    }

    //全网搜索
    async getSearch2(){

        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        let endData ={
            list:[]//当前模块类型
        };
        let {keyWord}  = helper.urlParam(originalUrl);



        try{

            let {list} = endData;


            let result = await ctx.curl(decodeURIComponent("https://node.video.qq.com/x/api/msearch?contextType=3&keyWord="+keyWord+"&_="+new Date().getTime()), {
                dataType: 'json',
            });

            let types = {};
            "综艺 ,娱乐 ,电视剧 ,电影 ,动漫 ,新闻 ,纪录片 ,汽车 ,体育 ,音乐 ,游戏 ,原创 ,财经 ,教育 ,少儿 ,其他".split(",").forEach((curr,index)=>{   types[curr.trim()] = index;  });

            result = JSON.parse(result.data.text);
            result = result.uiData;
            var baseList = [];
            result.forEach(curr=>{
                baseList = baseList.concat(curr.data);
            })
            let b = baseList.map(curr=>{  return curr.dataType;   })

            baseList.forEach(curr=>{

                let keys = [0,2,3,4];
                if(keys.includes(curr.dataType)){

                    let videoSrcName=curr.videoSrcName? curr.videoSrcName[0]:"";
                    let {webPlayUrl} = curr,cid=webPlayUrl.split("/").reverse()[0].replace(".html","");
                    let vid =helper.urlParam(cid)["vid"];
                    cid = cid.split("?")[0];
                    // if(3 == types[curr.videoCategory]){
                    //     webPlayUrl = "https://v.qq.com/x/cover/"+cid+".html";
                    // }
                    if(videoSrcName && videoSrcName.webPlayUrl){
                        cid = videoSrcName.webPlayUrl.split("?")[0].split("/").reverse()[0].replace(".html","");
                        vid = helper.urlParam(webPlayUrl).vid;
                    }
                    webPlayUrl = "https://v.qq.com/x/cover/"+cid+".html";
                    if(vid) webPlayUrl = "https://v.qq.com/x/cover/"+cid+"/"+vid+".html";
                    list.push({
                        type:curr.videoCategory,
                        title:curr.title.replace(/^\u0005/g,"").replace(/^\u0006/g,""),
                        actor: curr.actor.replace(/^\u0005/g,"").replace(/^\u0006/g,""),
                        area: [curr.year,curr.productName, curr.area,curr.subtype].filter(o=>{ return (String.HasText(o) && o!=0); }).join(" | ").replace(/^\u0005/g,"").replace(/^\u0006/g,""),
                        pic:curr.posterPic,
                        cid:cid,
                        vid:String.HasText(vid)?vid:"",
                        form:videoSrcName && String.HasText(videoSrcName.name) ? videoSrcName.name:"",
                        url:webPlayUrl
                    })
                }

            })



            // endData = Object.assign(endData,result);

        }catch (e) {
            console.log(e);
        }

        console.log("1111=============",endData);


        ctx.response.success(endData);



    }


    async getVideo(){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        let endData = "";
        let sdata ={};

        let param  = helper.urlParam(originalUrl);

        param.tm = parseInt(new Date().getTime()/1000);
        param.guid = helper.tx.createGUID();
        param.flowid = param.guid + '_10201';
        const cKey = await helper.tx.getKey(param,ctx);

        param = Object.assign(param,{cKey});

        try{
            const result = await ctx.curl('https://h5vv.video.qq.com/getinfo', {
                data:param,
                dataType: 'text',
            });



            let str = result.data.indexOf("QZOutputJson") > -1 ? result.data.replace("QZOutputJson=",""):(result.data+";");
            str = JSON.parse(str.substring(0,str.length-1));
            sdata = str;
            let obj = str.vl.vi["0"].ul.ui["0"];
            endData = obj.url+obj.hls.pt
            // let obj = str.vl.vi["0"];
            // endData=obj.ul.ui["0"].url+obj.fn+"?vkey="+obj.fvkey;
            // Object.keys(param).forEach(curr=>{
            //     endData+="&"+curr+"="+param[curr];
            // })
        }catch (e) {

            console.error(e)

        }


        ctx.response.success({endData,sdata});
    }

    async getVideoProxy(){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        let endData = "";
        let sdata ={};

        let param  = helper.urlParam(originalUrl);

        //根据 cid 构造 url  解析html

        //根据 url 获取vid





        const defParam = {
            charge:0
            ,defaultfmt:"auto"
            ,otype:"ojson"
            ,platform:"10201"
            ,sdtfrom:"v1010"
            ,defnpayver:1
            ,appVer:"3.5.57"
            ,host:"v.qq.com"
            ,refer:"v.qq.com"
            ,sphttps:1
            ,tm:1567664997
            ,spwm:4
            ,logintoken:"%7B%22main_login%22%3A%22qq%22%2C%22openid%22%3A%2227D85B64EA86974952494392D3B9AA2D%22%2C%22appid%22%3A%22101483052%22%2C%22access_token%22%3A%226848299EF4929CDC8D5430A6CB973FF3%22%2C%22vuserid%22%3A%22412124365%22%2C%22vusession%22%3A%22yk55qNYKHcZa7RaG9V_q-w..%22%7D"
            // ,unid:"389a2bf7c4bd11e9981ca0424b63310a"
            ,fhdswitch:0
            ,show1080p:1
            ,isHLS:1
            ,dtype:3
            ,sphls:2
            ,spgzip:1
            ,dlver:2
            ,drm:32
            ,hdcp:0
            ,spau:1
            ,spaudio:15
            ,defsrc:1
            ,encryptVer:9.1
            ,cKey:""
            ,fp2p:1
            ,spadseg:1
        };
        defParam.tm = parseInt(new Date().getTime()/1000);
        defParam.guid = helper.tx.createGUID();
        defParam.flowid = defParam.guid + '_10201';
        defParam.ehost = param.url;
        defParam.vid = param.vid;
        const cKey = await helper.tx.getKey(defParam,ctx);
        defParam.cKey=cKey;

        try{

            const fparam = {"buid":"vinfoad","adparam":"pf=in&ad_type=LD%7CKB%7CPVL&pf_ex=pc&url=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Fmzc0020022o8qha%2Fd003279ebxs.html&refer=https%3A%2F%2Fv.qq.com%2F&ty=web&plugin=1.0.0&v=3.5.57&coverid=mzc0020022o8qha&vid=d003279ebxs&pt=&flowid=ab182645c412027290b626a6b260cae4_10201&vptag=&pu=1&chid=0&adaptor=2&dtype=1&live=0&resp_type=json&guid=57e9d812e46159e7482f6d0ea8149527&req_type=1&from=0&appversion=1.0.141&uid=412124365&tkn=yk55qNYKHcZa7RaG9V_q-w..&lt=qq&platform=10201&opid=27D85B64EA86974952494392D3B9AA2D&atkn=6848299EF4929CDC8D5430A6CB973FF3&appid=101483052&tpid=2&rfid=6095412d81fa4f874ed2f21aca4324e3_1567664999","vinfoparam":"charge=0&defaultfmt=auto&otype=ojson&guid=57e9d812e46159e7482f6d0ea8149527&flowid=ab182645c412027290b626a6b260cae4_10201&platform=10201&sdtfrom=v1010&defnpayver=1&appVer=3.5.57&host=v.qq.com&ehost=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Fmzc0020022o8qha%2Fd003279ebxs.html&refer=v.qq.com&sphttps=1&tm=1567666856&spwm=4&logintoken=%7B%22main_login%22%3A%22qq%22%2C%22openid%22%3A%2227D85B64EA86974952494392D3B9AA2D%22%2C%22appid%22%3A%22101483052%22%2C%22access_token%22%3A%226848299EF4929CDC8D5430A6CB973FF3%22%2C%22vuserid%22%3A%22412124365%22%2C%22vusession%22%3A%22yk55qNYKHcZa7RaG9V_q-w..%22%7D&unid=389a2bf7c4bd11e9981ca0424b63310a&vid=d003279ebxs&defn=&fhdswitch=0&show1080p=1&isHLS=1&dtype=3&sphls=2&spgzip=1&dlver=2&drm=32&hdcp=0&spau=1&spaudio=15&defsrc=1&encryptVer=9.1&cKey=4edV6hO4GfB7xJEItZs_lpJX5WB4a2CdS8k4M23zVaqtHEZQ1c_W6myJ8hQJnmDCH8cnHseDKTvK2vPBr-xE-uhvZyEMY131vUh1H4pgCXe2Op8F_DerfPItmUppprhuqXwgEERXE92AluNDEH6IC8EOljLQ2VfW2sTdospNPlD9535CNT9iSo3aNBH9zIg0GafMPJVASLfUSMb5t1pjAAuGkoYGNScB_8lMahr0SD1lJfkplb5LtU1mpdrzcMbY1XniNzyOKljQ8AICTCwy2R1qtnFKghdTEN6oAQKOR6YxhI9oJNSAn0b7Tz8vMynPRK7kHTQSB0nxdmIalPsuAW2G8AUFBQUFTJFMuQ&fp2p=1&spadseg=1"};
            //fparam -- 原始数据测试使用

            const result = await ctx.curl('https://vd.l.qq.com/proxyhttp', {
                data:{
                    buid:"vinfoad",
                    vinfoparam:helper.url2String(defParam)
                },
                method: 'POST'
                ,dataType: 'json',
                contentType: 'json',
            });
            let {vinfo,errCode} = result.data;
            vinfo= JSON.parse(vinfo);
            sdata = vinfo;
            let obj = vinfo.vl.vi[0].ul.ui[1];

            endData=obj.url.indexOf(".m3u8")>-1?obj.url:(obj.url+obj.hls.pt);
        }catch (e) {

            console.error(e)

        }


        ctx.response.success({endData,sdata});
    }

    async getVideoByCid(){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;

        let {cid}  = helper.urlParam(originalUrl);
        let param = await helper.tx.getVid(cid,ctx);
        console.log(param);
        let data  = await helper.tx.getVideoInfo(param,ctx);
        console.log(data);
        ctx.response.success(data);
    }


}

module.exports = dController;
