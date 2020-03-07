<style lang='scss'>
 </style>
<template>
	<view>






		<ui-page>
			<template v-slot:page>


				<view class="page-films-detail">

					<view class=" nav-head">
						<uni-nav-bar left-icon="back" left-text="返回" right-text="播放" ></uni-nav-bar>
					</view>

					<web-view :webview-styles="webviewStyles" :src="url"></web-view>
				</view>
			</template>
		</ui-page>

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
	} from "vuex";
	import { util, pageMixins, 	memory, api } from '@/comps/base/index.js'
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
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				url:"",
			}
		},
		onLoad(e) {


			// this.$store.dispatch('start/init');


			this.url = memory.webs[e.type+""]



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
			async fun4error(e) {
				console.log(e)
			}

		}
	}
</script>
