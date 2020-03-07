<style lang='scss'>
	.page-public-films-rank {
		 

		.head {
			z-index: 10;
			position: fixed;
			left: 0;
			width: 100%;
			overflow: hidden;
			background-color: #fff;
		 
			.tab {
				box-sizing: content-box;
				display: flex;
				padding: 0 10px;
				height: 30px;
				align-items: center;
				.tab-item {
					font-size: 17px;
					font-weight: 700;
					line-height: 22px;
					text-align: center;
					white-space: nowrap;
					display: flex;
					flex-direction: column;
					position: relative;
					margin-right: 10px;

					.line {
						display: none;
						position: absolute;
						bottom: 2px;
						left: 50%;
						width: 12px;
						margin-left: -6px;
						border-bottom: 2px solid #FE9132;
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

	 
		
         .body{
			 .comps-models {
			 	background-color: white;
			 	margin-top: 1px;
			 	padding: 0 10px;
			 	box-sizing: border-box;
			 	width: 100%;
				.scroll-Y{
					height: calc(100vh - 40px - var(--status-bar-height));
					
					.common-loading-box{
											        display: flex;
											        align-items: center;
											        width: 50%;
											        margin: 0 auto;
											        justify-content: center;
											    }
											    .common-loading-box-text{    color: #333;margin-left: 10px;
					font-size: 10px}
												
												.loader-01 { border: .2em dotted currentcolor; border-radius: 50%; -webkit-animation: 2s loader-01 linear infinite; animation: 2s loader-01 linear infinite;display: inline-block;
												    width: 10px;
												    height: 10px;
												    color: rgb(7, 193, 96);
												    vertical-align: middle;
												    pointer-events: none; }
												@-webkit-keyframes loader-01 { 0% { -webkit-transform: rotate(0deg); transform: rotate(0deg); }
												    100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }
												}
												@keyframes loader-01 { 0% { -webkit-transform: rotate(0deg); transform: rotate(0deg); }
												    100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }
												}
					}
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
			 			    width: 33.33%;
			 			    margin-top: 12px;
			 			    padding: 0 4px;
			 			    vertical-align: top;
			 				box-sizing: border-box;
			 		}
			 	}
			 }
			 
		 }



	}
	
	
	
	.base-tip{
		 
		    background-color: white;
		    display: flex;
			flex-direction: column;
		     .rank-modules{
				 display: flex;
				 flex-direction: row;
				     width: 100%;
				     box-sizing: border-box;
					     color: #999;
					     border-bottom: 1px dotted #eee;
					     line-height: 60px;
					     padding-left: 9px;
					     font-size: 12px;
				 .name{
					 width: 45px;
				 }
				 .list{
					 flex: 1;
					     white-space: nowrap;
					     margin: 0 auto;
						 .tag{
							     padding-right:  8px;
							     color: #333;
						 }
						 .t-select{
							     color: #FE9132;
						 }
				 }
			 }
	}
	.tips-del{
		    width: 30px;
		    border: 1rpx solid white;
		    /* margin-top: 30px; */
		    margin: 20px auto;
		    border-radius: 50%;
		    height: 30px;
			display: flex;
			    align-items: center;
			    justify-content: center;
			.sicon{
				font-size: 12px;
			}
	}
			  
</style>
<template>
	<view>


		<ui-page :showMenus="showMenus">



			<template v-slot:page>

				<view class="page-public-films-rank">
					<view class="head">
						<ui-status-bar></ui-status-bar>
						<view class="tab">
							<view class="tab-item">
								<image mode="widthFix" style="width: 25px;margin-left: 3px; margin-top: -2px;" src="/static/img/icon-logo-clear.png"></image>
							</view>


							<view class="tab-item" @click="fun4select(index)" :class="{'activity':index==menus.current}" :key="index" v-for="(item,index) in menus.list">
								<text>{{item.name}}</text>
								<!-- <text class="line"></text> -->
							</view>
						</view>


					</view>


					<uni-nav-bar status-bar="true"></uni-nav-bar>

					<view class="body">
						<view class="comps-models">


							<scroll-view :scroll-top="scrollTop" @scroll="fun4scroll" scroll-y="true" class="scroll-Y" @scrolltolower="fun4scrolltolower">
								<view class="list">
									<view class="list-item" v-for="(item,index) in cards" :key="index" @click="fun4detail('/public/films/detail?uuid='+item.uuid)">
										<ui-video :obj="item"></ui-video>
									</view>



									<view class="common-loading-box" v-if="loading>0">
										<view class="loader-01" v-if="(loading == 1)"></view>
										<view class="common-loading-box-text">{{loading == 1 ?"正在加载中":"没有更多数据了"}}</view>
									</view>


								</view>
							</scroll-view>


						</view>
					</view>

				</view>





			</template>
		</ui-page>




		<view class="common-plug-all">


			<uni-popup ref="ad" type="bottom">

				<view class="base-tip">

					<view class="rank-modules" v-if="mainData.keys.length > 0">
						<view class="name">按类型</view>

						<scroll-view class="list" scroll-x="true" style="width: 100px;">
							<text class="tag " :class="{'t-select':allSelect.keys== -1}" @click="fun4tag('keys',-1)">全部</text>
							<text class="tag " :class="{'t-select':allSelect.keys== index}" @click="fun4tag('keys',index)" v-for="(item,index)  in mainData.keys"
							 :key="index">{{item}}</text>
						</scroll-view>
					</view>

					<view class="rank-modules" v-if="mainData.address.length > 0">
						<view class="name">按地区</view>

						<scroll-view class="list" scroll-x="true" style="width: 100px;">

							<text class="tag t-hover" :class="{'t-select':allSelect.address== -1}" @click="fun4tag('address',-1)">全部</text>
							<text class="tag t-hover" :class="{'t-select':allSelect.address== index}" @click="fun4tag('address',index)"
							 v-for="(item,index)  in mainData.address" :key="('address'+index)">{{item.name}}</text>

						</scroll-view>
					</view>


					<view class="rank-modules" v-if="mainData.years.length > 0">
						<view class="name">按年份</view>

						<scroll-view class="list" scroll-x="true" style="width: 100px;">
							<text class="tag t-hover" :class="{'t-select':allSelect.years== -1}" @click="fun4tag('years',-1)">全部</text>
							<text class="tag t-hover" :class="{'t-select':allSelect.years== index}" :key="('years'+index)" @click="fun4tag('years',index)"
							 v-for="(item,index)  in mainData.years">{{item.name}}</text>

						</scroll-view>
					</view>

				</view>




			</uni-popup>


		</view>

	</view>
</template>


<script>
	import uiVideo from '@/comps/ui/coustorm/ui-video.vue'
	import uiPage from '@/comps/ui/coustorm/page.vue'
	import uniNavBar from "@/comps/ui/plug/uni-nav-bar/uni-nav-bar.vue"
	import uiFilms from "@/pages/public/films/comps/index.vue"
	import uniPopup from "@/comps/ui/plug/uni-popup/uni-popup.vue"
	import uiStatusBar from '@/comps/ui/coustorm/ui-status-bar.vue'
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
			uiFilms,
			uniPopup,
			uiStatusBar
		},
		data() {
			return {
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				menus: {
					list: [{
						name: "电影",
						type: 1,
						list: [],
					}, {
						name: "电视剧",
						type: 2,
						list: [],
					}, {
						name: "综艺",
						type: 3,
						list: [],
					}, {
						name: "动漫",
						type: 4,
						list: [],
					}],
					current: 0
				},
				allSelect: {
					keys: -1,
					years: -1,
					address: -1
				},
				formInline: {
					page_number: 1,
					page_size: 20,
					models: "",
					type: "",
					year: "",
					address: "",
				},
				showMenus: "3,0,2", //0 主页 1 回退  2 排行榜
			}
		},
		onLoad(e) {
			let {
				type
			} = e;
			if (!String.HasText(type)) e.type = 0;
			this.e = e;

			this.$nextTick(function() {
				util.event.on(memory.event.ranks, this.fun4ranks)
			})
			this.fun4search();
		},

		beforeDestroy() {
			util.event.off(memory.event.ranks, this.fun4ranks)
		},
		onShow(){
			if(this.$store.state.start.isChange != 0){
				this.$store.dispatch('start/updateCache', { key:"isChange",data:0});
				this.fun4select(this.menus.current)
			}

		},
		computed: {
			...mapState({

				cards: state => state.public4films.ranks.cards,
				counts: state => state.public4films.ranks.counts,
				loading: state => state.public4films.ranks.loading,

			}),
			mainData: function() {
				let {
					conditions
				} = memory.ranks, {
					current
				} = this.menus
				return conditions[current + 1];
			}
		},
		methods: {
			...mapActions('public4films', ["getRankSearch"]),
			async fun4scroll(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			async fun4scrolltolower() {
				this.formInline.page_number++;
				await this.fun4search();
			},
			async fun4ranks() {
				this.$refs.ad.open();
			},
			async fun4tag(key, index) {
				const {
					allSelect
				} = this;
				allSelect[key] = index;
				this.allSelect = allSelect;
				this.formInline.page_number = 1;
				await this.fun4search();
			},
			async fun4search() {
				await new Promise(resolve => {
					this.$nextTick(() => {
						resolve()
					})
				})
				const {
					mainData,
					allSelect,
					menus,
					formInline,
					loading
				} = this, $t = this;


				formInline.models = menus.list[menus.current]["type"];
				formInline.type = allSelect.keys > -1 ? mainData.keys[allSelect.keys] : "";
				formInline.year = allSelect.years > -1 ? mainData.years[allSelect.years].value : "";
				formInline.address = allSelect.address > -1 ? mainData.address[allSelect.address].value : "";
				if (loading == 1) return;

				await this.getRankSearch(formInline);

			},
			async fun4select(index) {
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
				this.menus.current = index;
				this.formInline.page_number = 1;
				this.allSelect = {
					keys: -1,
					years: -1,
					address: -1
				}
				await this.fun4search();

			},


		}
	}
</script>
