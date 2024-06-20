<template>
	<view>
		
		<scroll-view 
		scroll-y 
		scroll-x
		style="height: 530rpx;">
		
			<uni-list  
			class="uni-list-cell"  
			hover-class="uni-list-cell-hover" 
			v-for="(value, key) in listColumns" 
			:key="key">
				<view class="uni-media-list">
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{ value }} </view>
						<text style="margin-left: 100rpx;width: 55%;">{{listData[key]}}</text>
					</view>
				</view>
			</uni-list>
			</uni-list>
			
			
		</scroll-view>
		
	</view>
</template>

<script>
	import { getShpOne } from '@/utils/getData.js';
	export default {
		name:"SpotItemDetail",
		props: ['id'],
		data() {
			return {
				// listColumns:['图斑编号','图斑类型','图斑面积'],
				listData :[],
				listColumns:['年度','下发时间','市名称','县名称','监测图斑编号','图斑类型','内业情况','外业情况','备注','地块面积','土地面积','耕地面积','农用地面积','建设用地面积','未利用地面积','永久基本农田面积']
			}
		},
		methods: {
			//获取图斑信息
			async getTBInfor(){
				// var index = await getShpOne(this.id)
				// this.geojson_data = index.data.data
				// this.listData.push(this.geojson_data[0].year)
				// this.listData.push(this.geojson_data[0].issuedate)
				// this.listData.push(this.geojson_data[0].shimc)
				// this.listData.push(this.geojson_data[0].tbxzjxzqmc)
				// this.listData.push(this.geojson_data[0].jcbh)
				// this.listData.push(this.geojson_data[0].tblx)
				// this.listData.push(this.geojson_data[0].nyqk)
				// this.listData.push(this.geojson_data[0].wyqk)
				// this.listData.push(this.geojson_data[0].bz)
				// this.listData.push(this.geojson_data[0].dkmj + '亩')
				// this.listData.push(this.geojson_data[0].tdmj+ '亩')
				// this.listData.push(this.geojson_data[0].gdmj+ '亩')
				// this.listData.push(this.geojson_data[0].nydmj+ '亩')
				// this.listData.push(this.geojson_data[0].jsydmj+ '亩')
				// this.listData.push(this.geojson_data[0].wlydmj+ '亩')
				// this.listData.push(this.geojson_data[0].yjjbntmj+ '亩')
			}
		},
		mounted() {
			//获取图斑信息
			this.getTBInfor();
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
