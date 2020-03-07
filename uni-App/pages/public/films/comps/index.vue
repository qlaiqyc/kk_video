<style lang='scss'>
	uni-swiper .uni-swiper-dots{
		bottom: 20px;
	}
	.page-public-films-modules {
		padding-bottom: 20px;
		.head-swiper {
			position: relative;

			.head-bg {

				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 300rpx;
				-webkit-transition: .4s;
				transition: .4s;

			}
			


			.carousel {
				width: 100%;
				height: 150px;

			}

			.carousel-item {
				/* padding: 0 13px; */
				overflow: hidden;
				display: flex;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
				width: 100%;
				.image-box{
					width: 100%;
					transform: scale(1.2);
					image{
						width: 100%;
					}
					
				}
				

			}

			 
		}

		.comps-models {
			background-color: white;
			margin-top: 1px;
			padding: 0 5px;
			box-sizing: border-box;
			position: relative;
			z-index: 6;

			.title {
				font-size: 18px;
				line-height: 22px;
				font-weight: 700;
			    align-items: center;
			    box-sizing: border-box;
			    padding: 23px 10px 0 7px;
					
					    display: flex;
					    width: 100%;
					    justify-content: space-between;
					    align-items: center;
						.more{
							color:#515a6e;
							color: #17233d;
							    display: flex;
							    align-items: center;
							    font-size: 14px;
						}
			}

			.list {
				display: flex;
				flex-wrap: wrap;

				.list-item {
					width: 33.33%;
					margin-top: 16px;
					padding: 0 5px;
					vertical-align: top;
					box-sizing: border-box;
				}
			}
		}


	}

	.base-loading {
		position: fixed;
		z-index: 666;
		background-color: rgba(255, 255, 255, 0.6);
		display: flex;
		align-items: center;
		width: 100%;
		justify-content: flex-start;
		flex-direction: column;
		height: 100%;
margin-top: 10px;

		
	}
</style>
<template>
	<view class="page-public-films-modules">
		<div class="base-loading" v-if="list.length == 0">
			<div class="csshub-loading-icon"></div>
		</div>

		<template v-else>
			<view class="head-swiper" v-if="swipers.list.length <3">
				 
				<swiper interval="2500"  indicator-dots=true indicator-color="rgba(255,255,255,.5)" indicator-active-color="white"  circular autoplay=true    >
					<swiper-item v-for="(item, index) in swipers.list" :key="index" class="carousel-item">
						<view class="image-box">
							<image :src="item.pic" mode="aspectFit"     @click="fun4detail(item.path)"/>
						</view>
					</swiper-item>
				</swiper>

			</view>
			
			<uiSpecialBanner :bannerList="swipers.list" :fun="fun4detail" v-if="swipers.list.length>2"></uiSpecialBanner>
			<view class="comps-models" v-for="(item,index) in models" :key="index" v-if="item.list.length>0">
				<view class="title">
					<view class="name">{{item.name}}</view>
					<template v-if="(index == 0)">
						<view class="more"  @click="fun4more()" >
							<view>查看所有</view>	<image   style="width: 15px;" mode="widthFix"  src="/static/img/icon-index-more.png"></image>
						</view>
					</template>
				
				</view>
				<view class="list" >
					
					<view class="list-item" v-for="(sitem,sindex) in item.list" :key="sindex" @click="fun4detail(sitem.uuid)"   >
						<ui-video :obj="sitem"  ></ui-video>
					</view>

				</view>
			</view>



		</template>



	</view>
</template>


<script>
	import uiVideo from '@/comps/ui/coustorm/ui-video.vue'
	import uiPage from '@/comps/ui/coustorm/page.vue'
	import uniNavBar from "@/comps/ui/plug/uni-nav-bar/uni-nav-bar.vue"
	import uiSpecialBanner from '@/comps/ui/coustorm/specialBanner.vue'

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
		components: {
			uiVideo,
			uiPage,
			uniNavBar,uiSpecialBanner
		},
		data() {
			return {
				swpx:"30px",
				bannerList:["http://puui.qpic.cn/media_img/lena/PIC7lfq8g_580_1680/0","http://puui.qpic.cn/media_img/lena/PIC7lfq8g_580_1680/0","http://puui.qpic.cn/media_img/lena/PIC7lfq8g_580_1680/0"],

			}
		},
		props: {

			way: {
				type: Number,
				default: 0
			},
			run: {
				type: Boolean,
				default: false
			}


		},
		created() {
			//run == true 执行，，而后监听run 的变化  同时判断是否有数据，， 如果没有 且run = true则再次执行  在 watch 中处理

			if (this.run) this.fun4start();
		},
		onShow() {
			console.log("--show")
		},
		computed: {
			...mapState({
				list(state) {
					return state.public4films.start[this.way]
				},
			}),
			swipers() {
				let list = this.list.filter(curr => {
					return curr.name == "Swiper"
				});
				return list.length > 0 ? list[0] : [];
			},
			models() {
				let list = this.list.filter(curr => {
					return curr.name != "Swiper"
				}).map(curr=>{
					let len = curr.list.length;
					len -= len %3;
					
					curr.list.length = len
					return curr;
				});
				return list;
			},


		},

		methods: {
			...mapActions('start', ["getIndexData", "updateSwiper"]),
			async fun4more(){
				 
				util.jump.navigateTo("/public/films/rank?type="+this.way);
			},
			async fun4swiper(uuid) {
				util.jump.navigateTo("/public/films/detail?uuid"+uuid);
					
			},
			async fun4start() {
				console.log("---11-")
				this.$store.dispatch('public4films/init', {
					type: this.way
				});
			},
			async fun4detail(uuid){
					util.jump.navigateTo("/public/films/detail?uuid="+uuid);
			},
		},
		watch: {
			run: {
				handler: function(val, oldVal) {
					if (val && this.list.length == 0) this.fun4start();
				},
				deep: true
			},
		},
	}
</script>
