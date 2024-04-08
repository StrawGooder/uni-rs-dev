<template>
	<view >
		<!-- <page-head title="movable-view,可拖动视图"></page-head> -->
		<view class="page-body">
			<movable-area :style="{'height':phoneHeight,'width':GetScreenWidth}">
				<movable-view :x="x" :y="y"  direction="all" scale-value="0.3" scale-min="0.1" scale="true" scale-max="4" @change="onChange">
					<view >
							<u-modal :show="show" :title="title" :content='content'></u-modal>
							<u-button @click="show = true">打开</u-button>
						</view>
				</movable-view>

			</movable-area>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:true,
							title:'标题',
							content:'uView的目标是成为uni-app生态最优秀的UI框架',
				x: 0,
				y: 0,
				scale: 2,
				old: {
					x: 0,
					y: 0,
					scale: 2
				},
				phoneHeight:'',//屏幕高
				phoneWidth:'',//屏幕宽
			}
		},
		onReady(){

					// 计算屏幕高度 ，宽度
					let _this = this;
					uni.getSystemInfo({
						success(res) {
							var rpx=(res.screenHeight * (750 / res.windowWidth))
							console.log(rpx)
							 _this.phoneHeight = res.windowHeight;
							 _this.phoneWidth = res.windowWidth
						}
					});
			},
			computed:{
				GetScreenHeight(){
					
					return this.phoneHeight +'px'
				},
				GetScreenWidth(){
				
				return this.phoneWidth +'px'
				},
				
			},
		methods: {
			tap: function(e) {
				// 解决view层不同步的问题
				this.x = this.old.x
				this.y = this.old.y
				this.$nextTick(function() {
					this.x = 30
					this.y = 30
				})
			},
			tap2() {
				// 解决view层不同步的问题
				this.scale = this.old.scale
				this.scale = this.old.scale
				this.$nextTick(function() {
					this.scale = 3
				})
			},
			onChange: function(e) {
				this.old.x = e.detail.x
				this.old.y = e.detail.y
			},
			onScale: function(e) {
				this.old.scale = e.detail.scale
			}
		}
	}
</script>

<style>
	movable-view {
		display: flex;
		height: 300rpx;
		width: 500rpx;
		background-color: #D8D8D8;
		color: #fff;
		position: fixed; 
		pointer-events: auto;
	}
  /*活动区域的大小  */
	movable-area {
		height:750px;
		width:450px;
		/* background-color: ; */
		pointer-events: none;
		overflow: hidden;
		position: fixed;
	}

	.max {
		width:33.3%;
		height: 100%;
		margin-left: 10rpx;

	}
	.max image{
		width: 100%;
		height: 100%;

	}
	.page-body{
		z-index:9999;
		position:fixed
	}
</style>