<style lang='scss'>
	.app-start {
		.base-menus {
			position: fixed;
			bottom: 80rpx;
			right: 40rpx;
			z-index: 9;

			.base-menus-item {

				display: flex;
				width: 76rpx;
				height: 76rpx;
				line-height: 32px;
				background: white no-repeat 50%;
				background-size: 40rpx;
				/* border: 1px solid #ccc; */
				border-radius: 38rpx;
				align-items: center;
				justify-content: center;
				margin-top: 16px;
				box-shadow: 0 0 17px 5px #ccc;

				.sicon {
					color: white;
					font-size: 36rpx;
				}

				.icon-mine {
					font-size: 40rpx;
				}
			}
		}

	}
	
	.mine-login{
		  .comps-popup-def-body {
			      background-color: white;
			      border-radius: 4px;
			      box-shadow: 0px 0px 0px rgba(51,51,51,0.1);
			      padding: 23px;
			      margin: 0 auto;
			      width: calc(100vw - 40px);
				  box-sizing: border-box;
			  .title{ color: #333; font-size: 18px; font-weight: 800; }
			  .foot{
				  display: flex;    margin-top: -12px;

				      justify-content: flex-end;
					  .sure { float: right; color: rgba(9,187,7,1);
					   .btn{ 
						  background: rgba(0,0,0,0); box-sizing:inherit; 
						   font-size: 16px; line-height:19px;
							
							color: #09bb07;
							padding: 5px 10px;
							}
					   
					   
					     
					   }
					   
					   
					   button {
					   	background-color: transparent;
					   }
					   
					   button:after {
					   	border: 0;
					   }
			  }
			  .content{ color: #666; font-size: 16px; line-height:19px; margin:12px 0; margin-bottom: 24px; }
			 
		  }
 
	}


.mine-logo-tips{
	    background-color: white;
	    padding: 10px;
	    border-radius: 4px;
		display: flex;
		align-items: center;
		flex-direction: column;
		position: relative;
		box-sizing: border-box;
		    width: 80vw;
		    margin: 0 auto;
		.body{
			.title{
				color: #17233d;
				    font-size: 20px;
				    text-align: center;
				    padding: 10px;
			}
			.content{
				     font-size: 12px;
				     text-indent: 26px;
				     line-height: 27px;
				     color: #808695;
					 padding-bottom: 20px;
			}
		}
		
		.del{
			  position: absolute;
			      width: 30px;
			      height: 30px;
			      margin-top: 40px;
			      border: 1px solid white;
			      border-radius: 50%;
			      display: flex;
			      align-items: center;
			      justify-content: center;
				      bottom: -60px;
			image{
				
			}
			
		}
}
</style>

<template>
	<view class="app-start">




		<slot name="page"></slot>

		<view class="base-menus" v-if="list && list.length > 0">


			<view class="base-menus-item" v-for="(item,index) in list " :key="index" @click="fun4btns(item.type)">
				<image style="width: 20px;" mode="widthFix" :src="item.pic"></image>
			</view>

		</view>



		<view class="common-plug-all">


			<uni-popup ref="ad" type="center">

				<view class="mine-login">

					<view class="comps-popup-def-body">
						<view class="title">请授权 </view>
						<view class="content">请将您的用户信息授权给我们，这样就可以全面体验小程序</view>
						<view class="foot">
							<view class="sure">
								<button class="btn" open-type="getUserInfo" @getuserinfo="fun4login">授权</button>
							</view>
						</view>
					</view>
				</view>
			</uni-popup>
			
			
			
			
			<uni-popup ref="logo" type="center">
			
				<view class="mine-logo-tips">
					<view class="body">
						<view class="title" v-if="showTips.title">{{showTips.title}}</view>
						<image v-if="showTips.pic" :src="showTips.pic" style="width:100%" mode="widthFix"></image>
						
						<!-- <image style="width:100%" mode="widthFix" src="http://t8.baidu.com/it/u=1484500186,1503043093&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1583220411&t=1128d5ccbc67a13ba5e70f9b155eb903"></image> -->
						<view class="content" v-if="showTips.content">{{showTips.content}}</view>
					</view>
					
					<view class="del" @click="fun4cancle">
						<image style="width: 15px;" mode="widthFix" src="/static/img/icon-del-cuowu.png"></image>
					</view>
			
				 </view>
			</uni-popup>


		</view>





	</view>

</template>

<script>
	import uniPopup from "../plug/uni-popup/uni-popup.vue"
	import {
		mapActions,
		mapGetters,
		mapState
	} from "vuex"
	import {
		util,
		memory
	} from '@/comps/base/index.js'
	export default {
		name: "uiPage",
		components: {
			uniPopup,
		},
		props: {
			showMenus: {
				type: String,
				default: ""
			},
		},

		data() {
			return {
				btns: {
					"0": {
						name: "主页",
						pic: "/static/img/icon-menus-start.png",
						type: "0"
					},
					"1": {
						name: "排行榜",
						pic: "/static/img/icon-start-rank.png",
						type: "1"
					},
					"2": {
						name: "筛选",
						pic: "/static/img/icon-rank-guolv.png",
						type: "2"
					},
					"3": {
						name: "回退",
						pic: "/static/img/icon-menus-back.png",
						type: "3"
					},
				},
				goodsDetail: {
					show: false,
					data: {}
				},
				ad: {
					show: false,
					data: {}
				},
				webViewID:""


			}
		},
		created() {
			//暂时没有想到 这种公共组件的事件处理方法 待优化 
			console.log("created==111======")
		
			this.webViewID=this.__wxWebviewId__
			this.fun4event(1);
			 
		},
		beforeDestroy(){
			this.fun4event(2);
		},
		computed: {
			...mapState({
				showTips: state => state.start.showTips
			}),
			list: function() {
				let { showMenus, btns } = this;
				
				
				let ls = showMenus ? showMenus.split(",") : [],
					result = [];
				ls.map(curr => {

					// #ifdef APP-PLUS  
					if (curr == "2") result.push(btns[curr]);
					// #endif

					// #ifndef APP-PLUS
					result.push(btns[curr]);
					// #endif

				})

				return result;

			}

		},
		methods: {
			...mapActions('start', ["login"]),
			async fun4cancle(){
				this.$refs.logo.close();
			},
			async fun4event(num){
				if(num == 1){
					//绑定登陆事件
					uni.$on(memory.event.login_show,this.fun4eventLogin);
					//绑定tips
					uni.$on(memory.event.tips_show,this.fun4tips);	
				}else{
					uni.$off(memory.event.login_show,this.fun4eventLogin)	
					uni.$off(memory.event.tips_show,this.fun4tips)	
				}
			},
			async fun4tips(){
				this.$nextTick(function(){
					console.log("---------tips------------")
					this.$refs.logo.open();
				})
			},
			async fun4eventLogin(){
				
				//目前做法  ：这种公共组件只是处理 本页面的 事件
				var pages = getCurrentPages();
				let id = pages[pages.length - 1].__wxWebviewId__;
				if(id != this.webViewID) return
				
				
				this.$refs.ad.open();
			},
			
			async fun4btns(num) {
				if (num == 3) {
					util.jump.navigateBack(1)
				} else if (num == 2) {
					util.event.emit(memory.event.ranks, {})
				} else if (num == 1) {
					util.jump.navigateTo('/public/films/rank');
				} else if (num == 0) {
					util.jump.reLaunch("/public/films/index")
				}

			},
			async fun4login(data) {
				let { encryptedData, iv } = data.detail;
				this.$refs.ad.close();
				await this.login({encryptedData, iv })
			},


			fun4tip() {

			}


		}
	};
</script>
