import Vue from 'vue'
import Vuex from 'vuex'
import start from '@/store/modules/start'
import public4films from '@/store/modules/public/films.js'
Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		start,public4films
	      
	},
	state: {
		hasLogin: false,
		userInfo: {},
		device:{
			
		}
	},
	mutations: {
		
		login(state, provider) {

			state.hasLogin = true;
			state.userInfo = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'userInfo',  
			    data: provider  
			}) 
			console.log(state.userInfo);
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({  
                key: 'userInfo'  
            })
		}
	},
	actions: {
	
	}
})

export default store
