<style lang='scss'>
	.page-public-list {
		 

		.head {
			z-index: 10;
			position: fixed;
			left: 0;
			width: 100%;
			overflow: hidden;
			background-color: #fff;
			
			
			

			.frist {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				box-sizing: border-box;
				padding: 10px;
				align-items: center;

				.logo {}

				.search {
					width: 150px;
					height: 30px;
					padding-top: 0;
					border-radius: 3px;
					background-color: #f6f6f7;
					text-align: center;
					display: flex;
					justify-content: space-between;
					padding: 0 10px;
					align-items: center;

					image: {
						width: 20px;
					}

					text {
						max-width: 110px;
						color: #b3b3b3;
						font-size: 13px;
					}
				}
			}

			.tab {
				box-sizing: content-box;
				display: flex;
				padding: 0 10px;
				height: 30px;
				    align-items: center;
				    padding-bottom: 5px;

				.tab-item {
					font-size: 17px;
					font-weight: 700;
					line-height: 22px;
					text-align: center;
					white-space: nowrap;
					display: flex;
					flex-direction: column;
					position: relative;
					margin-right: 20px;

					.line {
						display: none;
						position: absolute;
						bottom: 2px;
						left: 50%;
						width: 12px;
						margin-left: -6px;
						border-bottom: 2px solid #ff6022;
					}

				}

				.activity {
					color: #FE9132;
font-size: 20px;
					.line {
						display: block;
					}
				}
			}
		}

		.blank {
			height: 80px;
		}
		
		
		/* #ifdef MP */
		.head{
			.frist{
				width: 74vw;
				padding: 0px 10px;
				justify-content: flex-start;
				.search{
					width: 45%;
					border-radius: 24px;
					margin-left: 5%;
				}

			}
			.tab{
				padding-top: 5px;
			}
		}
		
	 
		/* #endif */
		
		
		 


	}
</style>
<template>
	<view>


		<ui-page :showMenus="showMenus">
			<template v-slot:page>


				<view class="page-public-list">
					<view class="head">
						<ui-status-bar></ui-status-bar>
						<view class="frist">
							<image style="width: 84px;height: 24px;" class="logo" src="/static/img/icon-logo.png"></image>
							<view class="search" @click="fun4detail('/public/search')">
								<text>将夜2</text>
								<image style="width: 15px;height: 15px;" src="/static/img/icon-search.png"></image>
							</view>
						</view>
						<view class="tab">
							<view class="tab-item" @click="fun4select(index)" :class="{'activity':index==menus.current}" :key="index"
							 v-for="(item,index) in menus.list">
								<text>{{item.name}}</text>
								<!-- <text class="line"></text> -->
							</view>

							<!-- <view class="tab-item" >
								<text style="color: #36b0fb;">全部</text>
								<text class="line"></text>
							</view> -->
						</view>


					</view>
					
					
					<view class="blank"></view>
					<view class="model-page" :key="index"  v-for="(item,index) in menus.list" v-show="index == menus.current">
						<ui-films   :way="item.type" :run="index == menus.current"></ui-films>
					
					</view>

				</view>





			</template>
		</ui-page>

	</view>
</template>


<script>
	import uiVideo from '@/comps/ui/coustorm/ui-video.vue'
	import uiStatusBar from '@/comps/ui/coustorm/ui-status-bar.vue'
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
		request
	} from '@/comps/base/index.js'
	export default {
		mixins: [pageMixins],
		components: {
			uiVideo,
			uiPage,
			uniNavBar,
			uiFilms,uiStatusBar
		},
		data() {
			return {
				menus: {
					list: [{
						name: "精选",type:0,list:[],
					}, {
						name: "电影",type:1,list:[],
					}, {
						name: "电视剧",type:2,list:[],
					}, {
						name: "综艺",type:3,list:[],
					}, {
						name: "动漫",type:4,list:[],
					}],
					current: 0
				},
				showMore: false,
				showMenus: "", 
				e:{},
				devices:{
					
				}
			}
		},
		onLoad(e) {
			let {type} = e;
			if(!String.HasText(type)) e.type = 0;
			this.devices = uni.getSystemInfoSync();
			this.e = e;
		},
		onShow() {
			console.log("--show")
		},
		computed: {
		
			currentData:()=>{
				
			}


		},
		methods: {
			...mapActions('start', ["getIndexData", "updateSwiper"]),
			fun4select(index) {
				this.menus.current = index;
			},
			fun4swiperChange(event) {
				this.updateSwiper(event.detail.current)
			},
			fun4add(index, sindex) {

				const selectGoods = this.goods[index].list[sindex];

				util.event.emit(memory.event.goods_detail, selectGoods)
			},

		}
	}
</script>
