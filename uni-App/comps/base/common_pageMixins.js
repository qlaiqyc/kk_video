import util from '@/comps/base/common_util'
	import {
		mapActions,
		mapGetters,
		mapState
	} from "vuex"
 export default {
 	created() {},
 	onLoad() {
 		// this.$store.dispatch('start/init')

 		this.fun4setTitle()
		
		console.log(this,"------onLoad")



 	},

 	onUnload() {
		console.log(this,"------onUnload")
 	},
	onShow(){
		//添加事件绑定
		
		  
	},
	onHide(){
		//移除事件绑定
	},
 	onShareAppMessage(res) {

 		return {
 			title: 'kk视频',
 			path: '/pages/public/films/index'
 		}
 	},
	computed:{
		...mapState({
			verify(state){
				let result = false;//false不可以看,true;//可以看
				//判断是否是在 审核期间
				let {config,user} = state.start;
				
				// config.verify =1;
				
				if(config.verify == 1){
					if(user && user.role == 1){
						result = true;
					}
				}else{
					result = true;
				}
				return result;
			}
		}),
	},
 	methods: {
 		async fun4setTitle() {
 			// let title = this.title;
 			//  util.setTitle(title);
 		},
 		async fun4detail(path) {
 			util.jump.navigateTo(path);
 		},
 		async fun4back() {
 			util.jump.navigateBack(1);
 		},
 	}
 }
