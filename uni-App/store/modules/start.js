
import Vue from 'vue'
import {memory,request} from '@/comps/base/index.js'
export default {
  namespaced: true,
  state: {
	  device:{},
	  config:{
		  verify:2,
		  tabs:[]
	  },
	  user:{},
	  showTips:{isUpdate:false,id:-1,pic:"",title:""}
	  ,isChange:0//默认是么有变化的 在rank 页面每次show 的时候判断是否处理

  },
  getters: {

  },
  mutations: {
    setData (state, {key,data}) {
      state[key] = data;
    }

  },
  actions: {
	  //启动时需要记录的东西
	 async onLaunch({dispatch,state ,commit},data){
		  const res = uni.getSystemInfoSync();
		  commit('setData', { key:"device",data:res});
		  
		  let result = await new Promise(resolve => {  request.get("/ql/v1/web/config",{},data=>{  resolve(data);  });  });
		  commit('setData', { key:"config",data:result});
		  
		  //取出缓存 的数据
		  
		  //用户信息
		  let user = uni.getStorageSync('user_info');
		  commit('setData', { key:"user",data:user});
		  
		  //判断是否 要更新
		  let showTips =uni.getStorageSync('app_tips');
		  if(!showTips)showTips=state.showTips;
		  
		  result.showTips.isUpdate = result.showTips.id > showTips.id ? true:false;
		  showTips = result.showTips;
		  
		  
		  uni.setStorageSync('app_tips',showTips)
		  commit('setData', { key:"showTips",data:showTips});
		  
		
		  
		  // 
		 setTimeout(()=>{
			  if(showTips.isUpdate) uni.$emit(memory.event.tips_show)
		 },1*1000)
		  
	 }, 
	 
	 async  login({dispatch,state ,commit},data){
		 console.log("----")
		 
		 try{
			 const {code} =await new Promise(resolve => { uni.login({complete(data) { resolve(data);   }}) });
			 console.log("1----")
			 //如果错误  提示 登录失败 
			 
			 let result = await new Promise(resolve => {  request.post("/ql/v1/wx/login",Object.assign({code},data),data=>{ console.log(data,999);  resolve(data);  });  });
			  console.log("12----",result)
			 //设置缓存  设置全局变量
			 uni.setStorageSync('user_info', result);
			  console.log("3----")
			 commit('setData', { key:"user",data:result});
			  console.log("4----")
		 }catch(e){
			  console.log("----",e)
		 }
		 
		 return "";
		  
		 
	 },
	 
	 async  loginOut({dispatch,state ,commit}){
	 		 
	 		 uni.removeStorageSync('user_info');
	 		 commit('setData', { key:"user",data:{}});
	 },
	 async updateUser({dispatch,state ,commit},data){
 
		 let result = await new Promise(resolve => {  request.post("/ql/v1/wx/update",data,(data,res)=>{  resolve(res.data);  });  });
		 
		 
		 //设置缓存  设置全局变量
		 uni.setStorageSync('user_info', result.data);
		 commit('setData', { key:"user",data: result.data});
		  
		 return result;
	 },
	 
	 async updateCache({dispatch,state ,commit},result){
		let {key,data} = result;
		commit('setData', { key:key,data:data});
	 },
	 
    //init
    async init({dispatch,state ,commit},data){
	 
   
      commit('setData', { key:"seoData",data:{title:"kk-123",keywords:"不推广",description:"仅仅是为了学习"} })
    },
  
  }
}
