<style lang='scss'>
 </style>
<template>
	<view>
 
		<ui-page>



			<template v-slot:page>



				 ad
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
