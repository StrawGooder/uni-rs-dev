<template>
	<view>
		<custom-tab-pane label="空间分析" name="c1_3">
			<scroll-view scroll-y style="height: 530rpx;">

				<view style="width: 80%; margin: auto; margin-bottom: 20px;">
					<xfl-select :list="list" :clearable="false" :showItemNum="10" :listShow="false" :isCanInput="false"
						:style_Container="'height: 30px; font-size: 16px;'" :placeholder="'placeholder'"
						:initValue="'选择分析的图斑'" :selectHideType="'hideAll'" v-model="list[0]" @change="change">

				 </xfl-select>
				</view>
				</uni-list>
			</scroll-view>
		</custom-tab-pane>
	</view>
</template>

<script>
	import {
		getShpOne
	} from '../../utils/getData.js';
	import xflSelect from '../../components/xfl-select/xfl-select.vue'; //导入
	export default {
		props: ['id'],
		data() {
			return {
				// listColumns:['图斑编号','图斑类型','图斑面积'],
				device: '',
				list: [], //要展示的数据	
			}
		},
		components: {
			xflSelect
		}, //注册为子组件
		methods: {
			//获取选中的的值
			change(e) {
				console.log("----------------------", e.newVal);
			},
			get_value() {
				this.list = [ //要展示的数据
					'耕地',
					'林地',
					'草地',
					'建筑物'
				]
			}
		},
		mounted() {
			this.get_value()
		}
	}
</script>

<style lang="scss">
	.uni-media-list {
		display: flex;
		flex-direction: row;
		// margin-left: 32rpx;
		// margin-right: 32rpx;
		margin-top: 20rpx;

		// width: 100%;
		.uni-media-list-logo {
			width: 180rpx;
			height: 140rpx;
		}


		.uni-media-list-body {
			display: flex;
			flex-direction: row;
			height: auto;
			// margin-left: 32rpx;
			// margin-right: 32rpx;
			// justify-content: center;
			width: 100%;
		}

		.uni-media-list-text-top {
			height: 84rpx;
			font-size: large;
			overflow: hidden;
			width: 25%;
			margin-left: 50rpx;
		}

		.uni-media-list-text-bottom {
			display: flex;
			flex-direction: row;
			margin-top: 20rpx;
			margin-right: 20rpx;
			font-size: 27rpx;
			color: #999999;
		}
	}
</style>
