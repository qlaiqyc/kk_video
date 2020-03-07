<style scoped lang='scss'>
	.card-def {
		.content {
			position: relative;

			.pic {
				width: 100%;
				height: 152px;
			}

			.tip {
				position: absolute;
				right: 5px;
				bottom: 10px;
				padding: 2px 3px;
				background-color: #a2a2b6;
				background-color: rgba(162, 162, 182, .5);
				color: #fff;
				font-size: 10px;
				line-height: 1;
			}
		}


		.name {
			margin-top: 6px;
			color: #000028;
			font-size: 14px;
			line-height: 20px;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden
		}

		.desc {
			margin-top: 4px;
			color: #a2a2b6;
			font-size: 12px;
			line-height: 18px;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden
		}

	}

	.card-line {
		display: flex;

		.left {

			position: relative;
			width: 100px;
			margin-right: 10px;

			.pic {
				width: 100px;
				height: 120px;
			}

			.tip {
				position: absolute;
				right: 5px;
				bottom: 10px;
				padding: 2px 3px;
				background-color: #a2a2b6;
				background-color: rgba(162, 162, 182, .5);
				color: #fff;
				font-size: 10px;
				line-height: 1;
			}
		}


		.right {
			flex: 1;
			display: flex;
			flex-direction: column;

			.name {
				margin-top: 6px;
				color: #000028;
				font-size: 14px;
				line-height: 20px;
				
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				 -webkit-box-orient: vertical;
			}
			.start{
				color: #999;
				    font-size: 10px;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					 -webkit-box-orient: vertical;
					 line-height: 23px;
			}

			.desc {
				margin-top: 10px;
				color: #a2a2b6;
				font-size: 12px;
				line-height: 18px;

				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				 -webkit-box-orient: vertical;
			}
		}

	}
</style>
<template>
	<view class="ui-video">




		<view class="card-line" v-if="type == 'line'">
			<view class="left">
				<image class="pic" mode="aspectFill" src="/static/img/other/errorImage.jpg" @error="fun4error" v-if="showError"></image>
				<image class="pic" lazy-load=true mode="aspectFill" :src="obj.pic" @error="fun4error" v-else></image>
				<view class="tip" v-if="config.verify!=1">{{obj.definition}}</view>
			</view>
			<view class="right">
				<view class="name">{{obj.name}}</view>
				<view class="start">主演：{{obj.start}}</view>
				<view class="desc"  > {{obj.introduce}} </view>
			</view>

		</view>

		<view class="card-def" v-else>
			<view class="content">

				<image class="pic" mode="aspectFill" src="/static/img/other/errorImage.jpg" @error="fun4error" v-if="showError"></image>
				<image class="pic" lazy-load=true mode="aspectFill" :src="obj.pic" @error="fun4error" v-else></image>

				<view class="tip" v-if="config.verify!=1">{{obj.definition}}</view>
			</view>
			<view class="name">{{obj.name || obj.title}}</view>
			<view class="desc"  > {{desc}} </view>
		</view>





	</view>


</template>

<script>
	import uniIcons from "../plug/uni-icons/uni-icons.vue";
	import { mapActions, mapGetters, mapState } from "vuex"
	export default {
		name: "uiGoods",
		data() {
			return {
				showError: false
			}
		},
		components: {
			uniIcons
		},
		props: {
			placeholder: {
				type: String,
				default: "请输入搜索内容"
			},
			type: {
				type: String,
				default: "def"
			},
			 
			obj: {}


		},
		computed: {
			...mapState({
				config(state) {
					return state.start.config
				},
			}),
		 
			desc(){
				let {obj} = this;
				
				return String.HasText(obj.address)?  [obj.address,obj.year,obj.start].filter(curr=>{
					return String.HasText(curr)
				}).join("/"):obj.introduce;
				
			}
		},
		
	 
		


		methods: {
			async fun4error(e) {
				this.showError = true;
			}


		}
	};
</script>
