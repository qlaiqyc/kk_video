<style lang='scss'>
 </style>
<template>
	<view>
		<ui-page>



			<template v-slot:page>
				<view class="page-mine-index">
					<view class="head">
						<view class="user">
							<image style="width: 50px;height: 50px;" src="/static/img/other/missing-face.png"></image>
							<view class="infos">
								<view class="self">
									登录/注册
								</view>
							</view>
						</view>

					</view>

					<view class="tips">

				

						<view class="history" style="    padding-bottom: 25px;">
							<view class="title">
								<image style="width: 16px;height: 16px;" src="/static/img/icon-mine-lishi.png"></image>
								<text>播放历史</text>
							</view>
							<scroll-view class="list" scroll-x>
								<image src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553105186633&di=c121a29beece4e14269948d990f9e720&imgtype=0&src=http%3A%2F%2Fimg004.hc360.cn%2Fm8%2FM04%2FDE%2FDE%2FwKhQplZ-QteEBvsbAAAAADUkobU751.jpg"
								 v-for="(item,index) in [1,2,3,4,5,56,6]" :key="index"></image>

							</scroll-view>
						</view>

		<view class="history">
							<view class="title">
								<image style="width: 16px;height: 16px;" src="/static/img/icon-mine-guanyu.png"></image>
								<text>关于我们</text>
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

				showMore: false
			}
		},
		onLoad() {


			this.$store.dispatch('start/init');


			api.goods.getAll({}, (result) => {
				console.log(result)
			})



		},
		onShow() {
			console.log("--show")
		},
		computed: {
			...mapState({
				tabs: state => state.start.tabs,
				swiper: state => state.start.swiper,
				goods: state => state.start.goods
			}),


		},
		methods: {
			...mapActions('start', ["getIndexData", "updateSwiper"]),
			search() {},
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
