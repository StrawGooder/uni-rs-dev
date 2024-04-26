<template>
	<view>
		<!-- <custom-tab-pane label="空间分析信息" name="c1_2">
			<scroll-view scroll-y style="height: 530rpx;">
			
				<uni-list  class="uni-list-cell"  hover-class="uni-list-cell-hover" v-for="(value, key) in messageAnaly" :key="key">
				    <view class="uni-media-list">
				        <view class="uni-media-list-body">
				            <view class="uni-media-list-text-top">{{JSON.stringify(value.item_name)}} </view>
							<text style="margin-left: 100rpx;width: 55%;">{{JSON.stringify(value.area_percentage)}}%</text>
						
				        </view>
				    </view>
				</uni-list>
				</uni-list>
			</scroll-view>
		</custom-tab-pane> -->
		<scroll-view scroll-y style="height: 530rpx;">
		
			<uni-list  class="uni-list-cell"  hover-class="uni-list-cell-hover" v-for="(value, key) in messageAnaly" :key="key">
			    <view class="uni-media-list">
			        <view class="uni-media-list-body">
			            <view class="uni-media-list-text-top">{{JSON.stringify(value.item_name)}} </view>
						<text style="margin-left: 100rpx;width: 55%;">{{JSON.stringify(value.area_percentage)}}%</text>
					
			        </view>
			    </view>
			</uni-list>
			</uni-list>
		</scroll-view>
	</view>
</template>
<script>
	export default {
		props: ['messageAnaly'],
		data() {
			return {
				
			}
		},
		methods: {
			init_message(){
				this.$emit('olmapSend', '')
			}
		},
		mounted(){
			
			// this.$emit("sendanalydata",this.values)
			
		}
	}
</script>

<style lang="scss">
    .uni-media-list{
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
