import Vue from 'vue'
import util from './common_util.js'
import memory from './common_memory.js'
export default {
	async pub(data) {
		let {url,method,param,success,error} = data;
		
		// #ifndef H5  
			url = "https://qlaiqyc.vip"+url; 
		// #endif
		
		
		let header={};
		//如果 登陆了 需传token 过去
		let token = await util.getToken();
		if(token)header={token:token};
		
		uni.request({
		   // url:, //仅为示例，并非真实接口地址。//h5 不需要加前缀  其他情况要加
			url,
		    data: param,
			method,
		    header,
			timeout:30*1000,
		    success: (res) => {
				
		    },
			complete(res){
				const {code,data} = res.data
				if(code == 2){
					uni.$emit(memory.event.login_show);
					success(data,res);
				}else{
					success(data,res);
				}
				
			}
		});
	
	},
	get(url,param,success) {
		this.pub({url,param,success,method:"GET"});
	},
	post(url,param,success) {
		this.pub({url,param,success,method:"POST"});
	},
	 
 


}
