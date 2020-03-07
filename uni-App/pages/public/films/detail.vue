<style lang='scss'>
	.page-films-detail {
		video {
			width: 100%;

			.controls-title {
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

		.infos {
			padding: 0 10px;

			.name {
				padding: 10px 0;
			}
			.self-verify{
				    color: #34495e;
				    line-height: 60px;
					text{
						    color: #FE9132;
						    font-size: 27px;
						    font-style: oblique;
						    margin: 0 10px;
					}
			}

			.detail {

				.detail-item {
					color: #999;
					font-size: 14px;
					padding: 2px 0;
					display: flex;
					justify-content: flex-start;
					width: 100%;
					box-sizing: border-box;
					align-items: flex-start;

					.key {
						width: 45px;
					}

					.value {
						flex: 1;
						color: #34495e;
						font-size: 14px;
						line-height: 26px;
					}
				}

			}

			.desc-key {
				color: #999;
				font-size: 14px;
				padding: 2px 0;
				margin: 10px 0;
			}

			.desc {
				white-space: pre-line;
				color: #666;
				font-size: 12px;
				line-height: 23px;
				text-indent: 20px;
			}
			.speed{
				display: flex;
				width: 100%;
				
				.name{
					    color: #999;
					    font-size: 14px;
				}
				.list{
					flex: 1;
					display: flex;
					.list-item{
						   color: #657180;
						       align-items: center;
						       padding: 5px 7px;
						       line-height: normal;
						       border-radius: 0.2em;
							       border: 2px dashed #d7dde4;
						       display: inline-flex;
						       transform: scale(0.56);
						       width: 50px;
						       text-align: center;
						       align-items: center;
						       justify-content: center;
							       margin-right: -10px;

					}
					.activity{
						  color: white;
						background-color: #FE9132;
						    border: 1px solid #FE9132;
					}
				}
			}

			.plays {
				.title {
					font-size: 13px;
					padding: 11px 0;
					display: flex;
					align-items: center;

					image {
						margin-right: 5px;
					}
				}

				.list {
					display: flex;
					flex-wrap: wrap;
					flex-wrap: wrap;
					margin: 10px 0;

					.list-item {


						margin-right: 10px;
						box-sizing: border-box;

						.list-item-text {
							text-align: center;
							overflow: hidden;
							text-overflow: ellipsis;
							-o-text-overflow: ellipsis;
							white-space: nowrap;
							padding: 7px 19px;
							border-radius: 4px;
							border: 1px solid #eee;
							-webkit-box-sizing: border-box;
							box-sizing: border-box;
							display: inline-block;
							font-size: 12px;
							color: #666;



						}

						.activity {
							border: 1px solid #f90;
							background-color: #f90;
							color: #fff;
						}
					}


					/* #ifdef MP */
					.list-item {
						margin-bottom: 5px;


					}


					/* #endif */


				}
			}
		}

	}
</style>
<template>
	<view>


<template v-if="showAll">
 
		<ui-page :showMenus="showMenus">
			<template v-slot:page>


				<view class="page-films-detail">


					<view class="head">
						<template v-if="verify">

							<!-- #ifdef H5 -->
							<view class="video-js" ref="dplayer" id="d_playID"> </view>
							<!-- #endif -->

							<!-- #ifndef H5 -->
							
							<video objectFit="cover" id="myVideo" :src="current||url" show-center-play-btn="false" @error="fun4error"
							 controls autoplay=true @waiting="fun4waiting(0)" @progress="fun4waiting(1)">
								<!-- <cover-view class="controls-title" v-if="(status==0)">
								  
								  	<cover-view class="csshub-loading-icon" ></cover-view>
							  </cover-view> -->

							</video>
							<!-- #endif -->
						</template>
						<template v-else>

							<image :src="detail.pic" mode="widthFix" style="width: 100%;"></image>
						</template>
					</view>
					<view class="infos">
					 
						
						<view class="name">《{{detail.name}}》</view>
						<view class="self-verify" v-if="!verify">
							我评: <text>{{nums}}</text>分，{{nums> 60?'建议大家去看':"我不说话"}}
						</view>
						
						
						<!-- #ifndef H5-->  
					
					<!-- 	<view class="speed">
							<view class="name">倍数</view>
							<view class="list">
								<view class="list-item" :class="{'activity':index==speeds.current}" v-for="(item,index) in speeds.list" :key="index" @click="fun4speed(index)">
									{{item}}
								</view>
							</view>
						</view> -->
						<!-- #endif -->
						
						<view class="detail">
							<view class="detail-item" v-if="detail.alias">
								<text class="key">别名：</text>
								<text class="value">{{detail.alias}}</text>
							</view>
							<view class="detail-item">
								<text class="key">地区：</text>
								<text class="value">{{detail.address}}</text>
							</view>
							<view class="detail-item">
								<text class="key">年份：</text>
								<text class="value">{{detail.year}}</text>
							</view>
							<view class="detail-item">
								<text class="key">状态：</text>
								<text class="value">{{detail.definition}}</text>
							</view>
							
							<template v-if="verify">
								<view class="plays" v-if="detail.ls.length>0">
									<view class="title">
										<image style="width: 20px;" mode="widthFix" src="/static/img/icon-logo-clear.png"></image>
										<text>播放列表</text>
									</view>
									<view class=" b-b" style="width: 100%;height: 1px;position: relative;"></view>
							
									<view class="list">
										<view class="list-item" v-for="(item,index) in detail.ls" :key="index" @click="fun4play(index)">
											<text class="list-item-text" :class="{'activity':index==cindex}">{{item.index}}</text>
							
										</view>
									</view>
								</view>
							</template>
							

							<view class="detail-item">
								<text class="key">导演：</text>
								<text class="value">{{detail.director}}</text>
							</view>

							<view class="detail-item">
								<text class="key">主演：</text>
								<text class="value">{{detail.start}}</text>
							</view>

						
							<view class="detail-item">
								<text class="key">简介：</text>
								<text class="value">{{detail.introduce}}</text>
							</view>


						</view>


					</view>


				</view>



			</template>
		</ui-page>
 </template>
	</view>
</template>


<script>
	import uiVideo from '@/comps/ui/coustorm/ui-video.vue'
	import uiPage from '@/comps/ui/coustorm/page.vue'
	import uniNavBar from "@/comps/ui/plug/uni-nav-bar/uni-nav-bar.vue"
	import uiFilms from "@/pages/public/films/comps/index.vue"

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
			uniNavBar,
			uiFilms
		},
		data() {
			return {
				speeds:{
					list:["0.5","0.8","1.0","1.25","1.5"],
					current:2
				},
				showMenus: "0,3",
				current: "",
				e: {},
				cindex: 0,
				videoContext: {},
				dp: {},
				status: -1,
				nums:(Math.random()*100).toFixed(2),
				showAll:false,
			}
		},

		onLoad(e) {
			this.e = e;
			this.videoContext = uni.createVideoContext('myVideo')
			this.fun4start();
		},
		onUnload() {
			console.log("----------123")


			// #ifdef H5
			this.dp.pause();
			this.dp.destroy()

			// #endif
		},
		 
		onShareAppMessage(res) {
			let {
				detail
			} = this;

			return {
				title: detail.name + '--' + detail.start,
				path: '/pages/public/films/detail?uuid=' + detail.uuid, // 默认是当前页面，必须是以‘/’开头的完整路径
				imageUrl: detail.pic,

			}
		},
		computed: {
			...mapState({
				detail(state) {
					const {
						detail
					} = state.public4films;
					
					if (String.HasText(detail.name) && detail.ls.length > 0)   detail.ls = detail.ls.reverse();
					return detail
				},
				config(state) {
					return state.start.config
				}
				 
			}),
			url() {
				let u = "",
					{
						detail
					} = this,
					key = "play_url_2";
				if (String.HasText(detail.name)) {
					if (detail.ls.length > 0) {
						u = detail.ls[0][key]
					} else {
						u = detail[key]
					}

				}

				return u;
			}


		},
		methods: {
			...mapActions('public4films', ["getDetail"]),
			async fun4speed(index){
				let {list,current} = this.speeds;
				this.speeds.current = index;
				console.log("-fun4speed=")
				
				this.videoContext.playbackRate(parseFloat(list[current]));
				
			},

			async fun4waiting(e) {

				// let { status} = this;
				// if(status == e)return;
				// this.status = e;
			},
			async fun4start() {
				this.showAll = false;
				await this.getDetail(this.e);
				this.showAll = true;

				// #ifdef H5
				this.fun4H5Play(this.url)

				// #endif
				
				//保存数据好history
				let {uuid,pic,name,address} = this.detail;
				util.history.add({uuid,pic,name,address})

			},
			async fun4error(e) {
				console.log(e)
			},
			async fun4play(e) {
				
				console.log("-----------",this,e)
				
				let { ls } = this.detail;
				this.cindex = e;
				this.current = ls[e]["play_url_2"];
				this.videoContext.play();

				// #ifdef H5
				this.fun4H5Play(this.current)

				// #endif


			}
			// #ifdef H5
			,async fun4H5Play(url) {
				console.log("-------")
				await new Promise(resolve => {
					this.$nextTick(() => {
						resolve()
					})
				})
				let $players = document.getElementById("d_playID"),
					$t = this;

				console.log(url);

				const param = url.indexOf("m3u8") > -1 ? {
					type: 'customHls',
					url: url,
					customType: {
						'customHls': function(video, player) {
							const hls = new Hls();
							hls.loadSource(video.src);
							hls.attachMedia(video);
						}
					}
				} : {
					url: url
				};
				try {
					this.dp.destroyed()
				} catch (e) {}
				this.dp = new DPlayer({
					autoplay: true,
					container: $players,
					preload: 'auto',
					video: param,
				});
			}
			// #endif

		}
	}
</script>
