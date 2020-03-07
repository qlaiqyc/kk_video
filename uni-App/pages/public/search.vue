<style lang='scss'>
	.page-public-search{
		.head{
			background-color: #fff;
			    height: 45px;
			   
			    display: flex;
			    align-items: center;
			    padding: 1rem;
			    -webkit-box-shadow: 0 0 0.5rem rgba(25,24,40,.15);
			    box-shadow: 0 0 0.5rem rgba(25,24,40,.15);
			    z-index: 9;
			    width: 100%;
				position: fixed;
				box-sizing: border-box;
				input{
					height: 30px;
					    border-radius: 30px;
					    padding: 0 15px;
					    background-color: #f6f6f6;
					    -webkit-tap-highlight-color: rgba(0,0,0,0);
					    -webkit-transition: border-color .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
					    transition: border-color .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
					    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
					    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
					    outline: 0;
					    border: 0;
					    width: calc(100% - 2rem);
					    color: #333;
						padding-left: 36px
				}
				image{
					width: 20px;   height: 16px; position: absolute;  margin-left: 10px;
				}
				.search-btn{
					    height: 30px;
					    border-radius: 18px;
					    font-size: 15px;
					    width: 60px;
					    /* -webkit-transform: scale(.8); */
					    transform: scale(.8);
					    color: #666;
					    margin-left: .5rem;
					    text-align: center;
					    line-height: 30px;
				}
		}
		
		 
		.models-tags{
			padding:10px;
			.title{
				font-size: 12px;
				    font-weight: bold;
				    padding: 10px 0;
				    display: flex;
				    width: 100%;
				    box-sizing: border-box;
				    justify-content: space-between;
			}
					.list{
						display: flex;
						    flex-wrap: wrap;
						.list-item{
							    padding: 2px 13px;
							    border-radius: 4rem;
							    border: 1px solid #e8eaec;
							    border-radius: 13px;
							    background: #f7f7f7;
							    vertical-align: middle;
							    font-size: 12px;
							    color: #787575;
							    display: inline-block;
								    margin-right: 10px;
								    margin-bottom: 10px;
						}
					}
				}
				.result{
					padding: 10px;
						.scroll-Y{
							height: calc(100vh - 130px - var(--status-bar-height));
							
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
						    font-size: 14px;
						    height: 40px;
						    text-indent: 5px;
						    line-height: 40px;
						text{
							color: #FE9132;
						}
					}
					.list{
						    display: flex;flex-direction: column;
						.list-item{
							 width: 100%;
							    margin-top: 12px;
							    padding: 0 4px;
							    vertical-align: top;
								box-sizing: border-box;
						}
					}
				}
		
	}
</style>
<template>
	<ui-page :showMenus="showMenus">
		<template v-slot:page>
			<view class="page-public-search">
				
				<view class=" nav-head">
					<uni-nav-bar @clickLeft="fun4back"  status-bar="true" fixed=true left-icon="back"     title="KK视频"></uni-nav-bar>
				</view>
				<uni-nav-bar   status-bar="true"  ></uni-nav-bar>
				<view class="head">
					<image class="search-head" mode="widthFix" src="/static/img/icon-search-bar.png"></image>
					<input confirm-type="search" focus=true v-model="formInline.keyword" @input="fun4input" v-on:keyup.enter="fun4search" placeholder="输入明星、影片关键词"
					 style="font-size: 12px;" />
					 <image class="search-del" style="right: 80px;padding: 10px;z-index: 10;" mode="widthFix" src="/static/img/icon-search-del.png" @click="fun4clear" v-if="formInline.keyword && formInline.keyword.length > 0"></image>
					<view class="search-btn" @click="fun4cancle">取消</view>
				</view>
				<view class="blank" style="height: 45px;"></view>

				<view class="result" v-if="formInline.keyword && formInline.keyword.length > 0">
					<view class="title">
						搜索<text>{{formInline.keyword}}</text>共<text>{{counts}}</text>条
					</view>

					<scroll-view scroll-y="true" class="scroll-Y" @scrolltolower="fun4scrolltolower">
						<view class="list">
							<view class="list-item" v-for="(item,index) in cards" :key="index" @click="fun4out('/public/films/detail?uuid='+item.uuid)">
								<ui-video type="line" :obj="item"></ui-video>
							</view>

							<view class="common-loading-box" v-show="loading>0">
								<!--<Spin size="large" ></Spin>-->
								<view class="loader-01" v-if="(loading == 1)"></view>
								<view class="common-loading-box-text">{{loading == 1 ?"正在加载中":"没有更多数据了"}}</view>
							</view>


						</view>
					</scroll-view>

				</view>

				<template v-else>
					<view class="models-tags" v-if="history.length>0">
						<view class="title">
							<text>历史搜索</text>
							<image style="width: 15px;" mode="widthFix" src="/static/img/icon-del.png"  @click="fun4history('clear')"></image>
						</view>
						<view class="list">
							<view class="list-item" v-for="obj in history" @click="fun4tag(obj)">{{obj}}</view>
						</view>
					</view>

						<view class="models-tags">
						<view class="title">热门搜索</view>
						<view class="list">
							<view class="list-item"  v-for="obj in ranks" @click="fun4tag(obj.name)">{{obj.name}}</view>
						</view>
					</view>


				</template>

			</view>



		</template>
	</ui-page>

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
				showMenus:"3",//0 主页 1 回退  2 排行榜
				showText: "",
				history: [],
				formInline: {
					page_number: 1,
					page_size: 20,
					keyword: ""
				},
				timeout: "", //输入优化
			}
		},
		onLoad() {
			this.fun4start();

		},
		onShow() {
			console.log("--show")
		},
		computed: {
			...mapState({
				cards: state => state.public4films.search.cards,
				counts: state => state.public4films.search.counts,
				loading: state => state.public4films.search.loading,
				ranks:(state)=>{
					let {ranks} =  state.public4films.search,curr = [];
					if(String.HasText(ranks) &&  "0" in ranks) curr = ranks["0"]
					return curr;
				}
			}),


		},
		methods: {
			...mapActions('public4films', ["getSearch"]),
			async fun4clear(){
				console.log("--------123----")
				this.formInline.keyword = "";
				
			},
			async fun4out(path){
				 this.fun4history("add");
				 util.time.delay(100,()=>{
					 this.fun4detail(path)
				 })
				
			},
			async fun4tag(keyword){
				this.formInline.keyword = decodeURIComponent(keyword);
				this.fun4input();
				
			},
			async fun4scrolltolower(e) {
				if (this.loading == 2) return
				this.formInline.page_number++;
				await this.fun4search();
			},
			async fun4start() {
				this.fun4history("update");
				this.$store.dispatch('public4films/getRanks');
			},
			async fun4history(way) {
				//记录两种方式 1.第一种 点击过搜索结果页的，2.点击过搜索按钮的

				//从缓存中获取 历史搜索的 + 从接口中获取 排行榜最新的 同时接口 一天获取一次

				let {
					keyword
				} = this.formInline, key = "search_words", $t = this;
				let exFun = {
					clear() {
						uni.removeStorageSync(key);
						this.update();
					},
					update() {
						let words = uni.getStorageSync(key),
							web = []
						String.HasText(words) ? words = JSON.parse(words) : words = {};
						let list = Object.keys(words).reverse().filter((curr, index) => {
							return index < 3
						});
						$t.history = list;
						//update 最新的数据
						let map = {};
						list.forEach(curr => {
							map[curr] = ""
						})
						uni.setStorageSync(key, JSON.stringify(map))
					},
					add() {
						if ((!$t.$isServer) && String.HasText(keyword)) {
							keyword = decodeURIComponent(keyword);
							let words = uni.getStorageSync(key),
								web = []
							String.HasText(words) ? words = JSON.parse(words) : words = {};
							words[keyword] = "";

							uni.setStorageSync(key, JSON.stringify(words))
							this.update();
						}
					},
				};
				if (way in exFun) exFun[way]();

			},

			async fun4input() {

				clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					this.formInline.page_number = 1;
					this.fun4search();
				}, 300)
			},
			async fun4search() {
				const {
					formInline,
					loading,
					value
				} = this, $t = this;

				if (loading == 1) return;
				if (!String.HasText(formInline.keyword)) return
				this.showText = decodeURIComponent(formInline.keyword);
				await this.getSearch(formInline);
			},
			async fun4cancle(){
				util.jump.navigateBack(1)
			}

		}
	}
</script>
