<style lang='scss'>
	.ui-status-bar {
		width: 100%;
	}
</style>

<template>
	<view class="ui-status-bar" style="background-color: #fff;" :style="{'height':bar}"> </view>
</template>

<script>
	import {
		util,
		memory
	} from '@/comps/base/index.js'
	
	import {
		mapActions,
		mapGetters,
		mapState
	} from "vuex"
	export default {
		name: "uiPage",
		components: {},
		props: {

		},

		data() {
			return {
			 

			}
		},
		 
		computed: {
			...mapState({
				bar(state){
					let hei = state.start.device.statusBarHeight;
					
					
					return ((hei > 20 ?(hei+7):(hei+7)))+"px"
					
				} 
			}) 


		},

	};
</script>
