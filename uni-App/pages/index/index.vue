<style lang='scss'>
	.page-mine-index {
		background-color: #f5f5f7;
		min-height: 100vh;


		.head {
			padding: 10px;
			position: relative;
			background-color: #eeeae7;
			/* background-color: #e8eaec; */
			height: 120px;
			margin-bottom: 30px;

			.user {
				display: flex;
				align-items: center;
				width: calc(100vw - 20px);

				padding: 10px;
				box-sizing: border-box;
				margin-top: 10px;
				background: #fff;
				border-radius: 5px;

				position: absolute;
				bottom: -20px;

				.infos {
					margin-left: 10px;
					color: #333;
					.self{
						.name{
							display: flex;
							align-items: center;
							
							text{
								color: #666;
								font-size: 11px;
								margin: 0 10px;


							}
						}
						.time{
							color: #999;
							font-size: 10px;
							margin-top: 4px;
						}
					}
				}

				button {
					background-color: transparent;
					color: #515a6e;
					font-size: 13px;
				}

				button:after {
					border: 0;
				}

				image {
					border-radius: 50%;
				}

			}

		}

		.tips {
			padding: 0 10px;



			.history {
			 
				margin-top: 10px;
				background: #fff;
				border-radius: 5px;

				.title {
					display: flex;
					align-items: center;
					font-size: 17px;
					font-weight: bold;
					padding: 10px;
				     display: flex;
				     justify-content: space-between;

					image {
						margin: 0 10px;
					}
				}
				.nodata{
					display: flex;
					    flex-direction: column;
					    align-items: center;
						text{
							display: inline-block;
							    margin-bottom: 0;
							    font-weight: 400;
							    text-align: center;
							    vertical-align: middle;
							    -ms-touch-action: manipulation;
							    touch-action: manipulation;
							    cursor: pointer;
							    background-image: none;
							    border: 1px solid transparent;
							    white-space: nowrap;
							    -webkit-user-select: none;
							    -moz-user-select: none;
							    -ms-user-select: none;
							    user-select: none;
							    height: 32px;
							    font-size: 14px;
							    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear;
							    color: #515a6e;
							    background-color: #fff;
							    line-height: 37px;
						}
						
				}

				.list {
					white-space: nowrap;
					padding: 15px 15px 0;
					box-sizing: border-box;

					image {
						display: inline-block;
						width: 80px;
						max-height: 110px;
						margin-right: 10px;
						border-radius: 5px;
					}
				}

				.tabs {
					display: flex;
					width: 100%;
					box-sizing: border-box;
					justify-content: space-between;
					padding: 0 10px;

					.tabs-item {
						display: flex;
						height: 70px;
						justify-content: space-around;
						align-items: center;
						flex-direction: column;
						font-size: 12px;
						font-weight: bold;
						align-items: center;

					}

					switch {
						transform: scale(0.75);
					}

					.tabs-name {
						color: #515a6e;
						font-size: 12px;
						padding: 8px 10px;
						border-radius: 20px;
						margin-top: 10px;
						min-width: 60px;
						text-align: center;
						border: 1px solid #dcdee2;
					}

					.tabs-name-activty {
						border: 1px solid #ff9900;
						color: white;
						background-color: #ff9900;
					}
				}
			}

		}
	}
</style>
<template>
	<view>
		<ui-page>



			<template v-slot:page>
				<view class="page-mine-index">
					<view class="head">


						<view class="user" v-if="user && user.nickName">
							<image style="width: 50px;height: 50px;" :src="user.avatarUrl"></image>
							<view class="infos">
								<view class="self">
									<view class="name">
										{{user.nickName}}<text class="">({{user.country}})</text>
										<image style="width: 20px;" mode="widthFix" src="/static/img/icon-sex-men.png"></image>
									</view>
									<view class="time">加入时间：{{user.add_time}}</view>
								</view>
							</view>
						</view>

						<view class="user" v-else>
							<image style="width: 50px;height: 50px;" src="/static/img/other/missing-face.png"></image>
							<view class="infos">
								<view class="self">
									<button open-type="getUserInfo" @getuserinfo="fun4login">登录/注册</button>
								</view>
							</view>
						</view>

					</view>

					<view class="tips">
						<view class="history" style="    padding-bottom: 25px;"  v-if="verify">
							<view class="title">
								<text>视频源</text>
								
							</view>
							<view class="tabs">
								<!-- <view class="tabs-item"  v-for="(item,index) in tabs" :key="index">
									<view class="text" :style="{color:item.color}">{{item.nickNmae}}</view>
																	
									<switch :color="item.color"  : checked="item.check"  />
									
								</view> -->

								<view class="tabs-name" @click="fun4tab(index)" :class="{'tabs-name-activty' : (index==( tabsSelect>-1?tabsSelect:select))}" v-for="(item,index) in tabs"  :key="index">
									{{item.name}}

								</view>
							</view>

						</view>



						<view class="history" style="    padding-bottom: 25px;">
							<view class="title" >
								<text>浏览历史</text>
								<image class="del" v-if="history.length>0" @click="fun4clear" style="width: 15px" mode="widthFix" src="/static/img/icon-del.png"></image>
							</view>
							<view class="nodata" v-if="history.length ==0">
								<image src="/static/img/icon-history-nodata.png" mode="widthFix" style="width: 100px;"></image>
								<text>快去看吧</text>
							</view>
							<scroll-view class="list" scroll-x v-else>
								<image :src="item.pic" @click="fun4detail('/public/films/detail?uuid='+item.uuid)"
								 v-for="(item,index) in history" mode="widthFix" :key="index"></image>

							</scroll-view>
						</view>

					<!-- 	<view class="history">
							<view class="title">
								<text>关于我们</text>
							</view>

						</view>
						 -->
						<view class="history" @click="loginOut" v-if="user && user.nickName">
							<view class="title">
								<text>推出登陆</text>
							</view>
						
						</view>

					</view>


				</view>



			</template>
		</ui-page>
		
		
		
		

	</view>
</template>


<script>
	import uiVideo from '@/comps/ui/coustorm/ui-video.vue'
	import uiPage from '@/comps/ui/coustorm/page.vue'
	import uniNavBar from "@/comps/ui/plug/uni-nav-bar/uni-nav-bar.vue"
	
	import {
		mapActions,
		mapGetters,
		mapState
	} from "vuex"
	import {
		util,
		pageMixins,
		memory,
		api
	} from '@/comps/base/index.js'
	export default {
		mixins: [pageMixins],
		components: {
			uiVideo,
			uiPage,
			uniNavBar 
		},
		data() {
			return {
				 
				tabsSelect: -1,

				showMore: false,
				history:[]
			}
		},
		onLoad() {


			// this.$store.dispatch('start/login', {});

 


		},
		onShow() {
			console.log("---")
			this.history = util.history.getAll();
		 
		},
		computed: {

			...mapState({
				user: state => state.start.user,
				config: state => state.start.config,
				tabs: state => state.start.config.source,
				select(state){
					let {tabs,user} = this,result=0;
					if(!tabs)tabs=[];
					
					tabs.forEach((curr,index)=>{
						if(user.source == curr.type)result= index;
					});
					
					return result;
					
				}
			}),
		},
		methods: {
			...mapActions('start', ["getIndexData", "loginOut","updateUser"]),
			async fun4clear(){
				util.history.clear();
				this.history = util.history.getAll();
			},
			async fun4login(data) {
				console.log(this)
				uni.$emit(memory.event.login_show)
				return
				let {
					encryptedData,
					iv
				} = data.detail;
				this.$store.dispatch('start/login', {
					encryptedData,
					iv
				});
			},
			async fun4tab(index) {
				let {tabs} = this;
				
				
				let {code} = await this.updateUser( { source:parseInt(tabs[index].type)});
				
				if(code == 0){
					this.tabsSelect = index;
					this.$store.dispatch('start/updateCache', { key:"isChange",data:1});
					util.jump.navigateTo("/public/films/rank")
				}
				
			},
		 

		}
	}
</script>
