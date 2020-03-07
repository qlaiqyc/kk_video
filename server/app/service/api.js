const Service = require('egg').Service;


class WXService extends Service {



    //获取首页数据
    async getIndex(dparam){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {table} = helper.sql;
        let {page_number,page_size,type} = dparam,users=[];

        try{


            if(!String.HasText(type)) type = 0;

            const sql4all = "select  a.*,b.definition,b.introduce,b.uuid as buuid from  "+table.swiper+" a  LEFT JOIN "+table.movies+"  b on a.path = b.uuid and a.type="+type+"  and a.status="+"1";

            users = await app.mysql.query(sql4all);

        }catch (e) {
            console.log(e)
        }

        return  users.filter(curr=>{return String.HasText(curr.buuid)});

    }

    //搜索
    async getSearch(param){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {sql} = helper;
        let {page_number,page_size,keyword} = param;
        keyword =String.sqlTirm(keyword);


        const sql4all = "select a.* from  "+sql.table.movies+" a where a.models !=3 and a.name like '%"+keyword+"%'  limit "+ (page_number - 1) * page_size + ',' + page_size;
        const sql4count = "select count(*) as counts  from  "+sql.table.movies+" a where a.models !=3 and a.name like '%"+keyword+"%'";



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

        return  {users,counts};


    }

    //获取视频详情
    async getDetail(){
        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
        const {table} = helper.sql;
        const {uuid} = helper.urlParam(originalUrl)
        let user={},sql_tableCurr= table.movies,ts= ["bajie","ziyuan","baiwan"].filter(curr=>{return sql_tableCurr.indexOf(curr) == -1});

        let execuFun  =  async (sql_table)=>{
            const sql4all = "select a.* from  "+sql_table+" a where a.uuid='"+uuid+"'";



            let users = await app.mysql.query(sql4all);
            user = users.length > 0 ? users[0] : {};
            user.ls =[];
            if(user.models == 2){
                let list = await app.mysql.query("select a.* from  "+sql_table+" a where a.vid='"+user.vid+"' and a.models=3");

                list = list.map(curr=>{
                    if(!String.HasText(curr.play_url_2))curr.play_url_2 = curr.play_url_1
                    return curr;
                })
                user.ls = list;
            }

        }

        await  execuFun(sql_tableCurr);



        for(let i =0,len = ts.length;i<len;i++){

            if(!String.HasText(user.id)) await  execuFun(table[ts[i]]);
        }
 
        return user;


    }

    //VO 数据之主页
    async voIndex(result,dparam){

        const { ctx, app } = this;
        const { helper,service,originalUrl } = ctx;
         let {type} =dparam; helper.urlParam(originalUrl);


        if(!String.HasText(type))type=0;


        let mapData  = await service.admin.getTypesBytype({pid:type}),mapKey={};
        mapData.forEach(curr=>{
            mapKey[curr.id] = Object.assign(curr,{list:[],big:[],keys:[]});
        });

        result.forEach(curr=>{if(curr.way in mapKey)  {
            let obj = mapKey[curr.way];
            curr.uuid = curr.buuid;
            delete curr.buuid;

            if(curr.see == "1")obj.big.push(curr);
            if(curr.see == "0")obj.list.push(curr);
            if(curr.see == "2")obj.keys.push(curr);

            mapKey[curr.way] = obj
        }});

        return  Object.values(mapKey);

    }

    //addIndex 加入 首页数据
    async  addIndex(param){

        const { ctx, app } = this;
        const { helper,service ,originalUrl} = ctx;
        const {table} = helper.sql;
        const {type,way,path,pic,title,status} = param;

        const uuid =  helper.md5(type+way+path);
        let obj = {type,way,path,pic,title,uuid}
        if(String.HasText(status)) obj.status = status;

        const update = await app.mysql.beginTransactionScope(async conn => {
            let result = "";
            try{result =await conn.insert(table.swiper,obj);}catch (e) {  }
            return result;
        }, ctx);

        return  update;


    }
}



module.exports = WXService;
