<style lang='scss'>
	.tab-index {
		background-color: $q-color-bg;

		min-height: 100vh;

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
				height: 187px;

			}

			.carousel-item {
				/* padding: 0 13px; */
				overflow: hidden;
				display: flex;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;

			}

			.carousel uni-image {
				width: 100%;
				height: 100%;
				border-radius: 4px;
			}


			.swiper-dots {
				display: flex;
				position: absolute;
				left: 18px;
				bottom: 30px;
				width: 34px;
				height: 17px;
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFW…8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
				background-size: 100% 100%;
				color: white;
				font-size: 13px;
			}
		}

		.body {
			.tabs {
				display: flex;
				box-sizing: border-box;
				justify-content: space-between;
				padding: 40rpx;
				background-color: white;

				.tabs-item {
					display: flex;
					flex-direction: column;
					align-items: center;

					image {
						width: 80rpx;
						height: 80rpx;
					}

					text {
						font-size: 12px;
						margin-top: 10rpx;
					}
				}

			}

			.comps-models {
				background-color: white;
				margin-top: 1px;
				padding: 0 16px;
				box-sizing: border-box;
				width: 100%;
				.title{
					      font-size: 18px;
					      line-height: 22px;
					      font-weight: 700;
					      padding-top: 12px;
				}
				.list{
					    display: flex;
					    flex-wrap: wrap;
						width: 100%;box-sizing: border-box;
					.list-item{
						    width: 50%;
						    margin-top: 12px;
						    padding: 0 4px;
						    vertical-align: top;
							box-sizing: border-box;
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



				<view class="tab-index">
					<view class="head">

						<view class="head-swiper">
							<!-- <view class="head-bg" :style="{backgroundImage: 'url('+swiper.list[swiper.current].pic+')'}"></view> -->


							<swiper class="carousel" circular @change="fun4swiperChange" :current="swiper.current" autoplay=true>
								<swiper-item v-for="(item, index) in swiper.list" :key="index" class="carousel-item">
									<image :src="item" mode="aspectFit" style="width: 100%" />
								</swiper-item>
							</swiper>
							<!-- 自定义swiper指示器 -->
							<view class="swiper-dots">
								<text class="num">{{swiper.current+1}}</text>
								<text class="sign">/</text>
								<text class="num">{{swiper.list.length}}</text>
							</view>
						</view>

					</view>

					<view class="body">


						<view class="tabs">
							<view class="tabs-item" v-for="(item,index) in tabs" @click="fun4detail(item.path)" :key="index">
								<image :src="item.pic"></image>
								<text>{{item.name}}</text>
							</view>
						</view>

						<view class="comps-models">
							<view class="title">猜你喜欢</view>
							<view class="list">
								<!-- <view class="list-item" v-for="(item,index) in [1,2,3,4,5,6,7]" :key="index">
									<ui-video></ui-video>
								</view> -->

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
				swiper:{
					list:["http://puui.qpic.cn/vupload/0/1580899582128_tq32sq4bwqt.jpg/0","http://puui.qpic.cn/media_img/lena/PIC517g9o_580_1680/0"],
					current:0
				},

				showMore: false
			}
		},
		onLoad() {
			this.$store.dispatch('start/init');
		},
		onShow() {
			console.log("--show")
		},
		computed: {
			...mapState({
				tabs: state => state.start.tabs,
			}),


		},
		methods: {
			...mapActions('start', ["getIndexData", "updateSwiper"]),
			fun4swiperChange(event) {
				this.updateSwiper(event.detail.current)
			},
		 
		}
	}
</script>
