
import Vue from 'vue'
import {memory,request} from '@/comps/base/index.js'
export default {
  namespaced: true,
  state: {
	  start:{
		  "0":[],"1":[],"2":[],"3":[],"4":[],
	  },
	  detail:{
		  ls:[]
	  },
	  search:{
		   cards:[],
		      counts:0,
		      loading:0,//不现实 1 正在加载  2 没有更多了
			  ranks:[]
	  },
	  ranks:{
		  loading:0,//不现实 1 正在加载  2 没有更多了
		  cards:[],counts:0
	  }
	 
  },
  getters: {

  },
  mutations: {
    setData (state, {key,data}) {
      state[key] = data;
    }

  },
  actions: {
    //init
    async init({dispatch,state ,commit},data){
      await dispatch('getIndexData',data)
    },
    //获取首页数据
    async getIndexData({commit,state},query){
	   let result = await new Promise(resolve => {  request.get("/ql/v1/web/index",query,data=>{  resolve(data);  });  });
	   
	   
       const {start} = state,{type} = query;
	   start[type] = result;
       commit('setData', { key:"start",data:start});
    },
	async getDetail({commit,state},query){
		let result = await new Promise(resolve => {  request.get("/ql/v1/web/video",query,data=>{  resolve(data);  });  });
	 
		 commit('setData', { key:"detail",data:result});
		 
		 return result;
	},
 
	async getRanks({commit,state},query){
			 let {search} = state;
			 
			 let list = await new Promise(resolve => { request.get("/ql/v1/web/ranks",{},data=>{  resolve(data);  });  });
			 
			 commit('setData', { key:"search",data:Object.assign(search,{ranks:list}) })
			  
	},
	async getRankSearch({commit,state},query){
		let {page_number} = query,{ranks} = state;
		ranks = Object.assign(ranks,{loading:1});
		if(page_number == 1) ranks.cards = [];
		commit('setData', { key:"ranks",data:ranks});
		let {list,counts}  = await new Promise(resolve => { request.get("/ql/v1/web/QsearchType",query,data=>{  resolve(data);  });  });
		
		if(page_number == 1){
			ranks.cards = list;
			ranks.counts= counts;
		}else{
			ranks.cards = ranks.cards.concat(list);
		}
		
		ranks.loading = list.length > 0?0:2;
		commit('setData',  { key:"ranks",data:ranks});
	},
		
	
	async getSearch({commit,state},query){
		 let {search} = state, {page_number} = query;
		 search = Object.assign(search,{loading:1});
		 commit('setData', { key:"search",data:search})
		 let {list,counts} = await new Promise(resolve => { request.get("/ql/v1/web/search",query,data=>{  resolve(data);  });  });
		 		
		 if(page_number == 1){
			search = Object.assign(search,{cards:list,counts:counts});
			commit('setData', { key:"search",data:search})
		 }else{
			 search = Object.assign(search,{cards:search.cards.concat(list),counts:counts});
			 commit('setData', { key:"search",data:search})
		 }
		 commit('setData', { key:"search",data:Object.assign(search,{loading:list.length > 0?0:2}) })
		  
	}
  }
}
