 
<script>
 
	
	 import { util, pageMixins, 	memory, api } from '@/comps/base/index.js'
	export default {
		onLaunch: function() {
			this.$store.dispatch('start/onLaunch', {});
			
			
			//绑定 全局事件
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	 
	uni-swiper .uni-swiper-dots{
		bottom: 20px;
	}
	
	.csshub-loading-icon {
		padding: 5px;
		width: 5px;
		height: 5px;
		border-top: 10px solid #ED5548;
		border-right: 10px solid #599CD3;
		border-bottom: 10px solid #5CBD5E;
		border-left: 10px solid #FDD901;
		background: transparent;
		animation: csshub-rotate-right-round 1.2s ease-in-out infinite alternate;
		margin-top: 10vh;
	}
	
	@keyframes csshub-rotate-right-round {
	
		0% {
			transform: rotate(0deg);
		}
	
		50% {
			transform: rotate(180deg);
		}
	
		100% {
			transform: rotate(360deg);
			border-radius: 50%;
		}
	
	}
	/*每个页面公共css */
	
	
	
	
	* {
	    margin: 0;
	    -webkit-tap-highlight-color: transparent;
		box-sizing: border-box;
	}
	
	.b-b:after{
	  position: absolute;
	  z-index: 3;
	  left: 0;
	  right: 0;
	  height: 0;
	  content: '';
	  -webkit-transform: scaleY(0.5);
	          transform: scaleY(0.5);
	  border-bottom: 1px solid #E4E7ED;
	}
	.b-b:after {
	  bottom: 0;
	}
	.nav-head{
		position: fixed;
		 
		width: 100%;
		z-index: 999;
	}
	
	
	/* #ifdef H5*/
	.status_bar {
	     height: 45px;
	     width: 100%;
	 }
	 .status_bar {
	     display: none;
	  }
	/* #endif */
	
	
	/*MP 隐藏 导航条使用自己的导航条*/
	
	
	 
	
	
	
	 
	
</style>
