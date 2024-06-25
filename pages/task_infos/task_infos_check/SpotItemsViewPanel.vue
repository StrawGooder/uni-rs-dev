<template>
	<view>
		
		<scroll-view scroll-y style="height: 530rpx;">
			
			<ZsLhTable
			:rows = "rftbRows"
			:columns = "rftbColumns"
			show-oper
			>
			
				<template #operCol = "slotProps"
				>
					<ZsButtonGroup
					:items = "rftbBtnItems"
					@click="(e)=>{onTbOpColClicked(e, slotProps.row)}"
					>
						
					</ZsButtonGroup>
					
				</template>
				
			</ZsLhTable>
		
			<view
			v-if="rfrightSidePanelVisible"
			style="z-index:99;top:0px;right:10vw;position:absolute;"
			>
				<!-- right side panel (detail and write info), 
				triggered by the table operation column-->
				<view
				
				style="background-color: beige;border:'black 1px solid';"
				>
					<view>
						
						<swiper
						id="swiper-spot"
						:duration="300" 
						:current="rfrightPanelTabInd" 
						style="width:480rpx;"
						>
							<swiper-item>								
								
								<ZsCard
								title="详情"
								show-close
								@hide="hideRightSidePanel"
								>
									<SpotItemDetail
									>
										
									</SpotItemDetail>
									
								</ZsCard>
								
							</swiper-item>
							<swiper-item>
								<ZsCard
								title="审查填报"
								show-close
								@hide="hideRightSidePanel"
								>
									<SpotItemReviewSubmit>
										
									</SpotItemReviewSubmit>
									
								</ZsCard>
								
							</swiper-item>
							<swiper-item>
								<ZsCard
								title="拍照举证"
								show-close
								@hide="hideRightSidePanel"
								>
									<view>+</view>
									
								</ZsCard>	
							</swiper-item>
						</swiper>
						
					</view>
					
					
				</view>
				
			</view>
	<!-- 		operBtns: {
				type: Object,
				default: () => {
					return {
						remove: {
							show: false,
							text: '删除'
						},
						view: {
							show: true,
							text: '详情'
						},
						edit: {
							show: false,
							text: '编辑'
						}
					}
				}
			}, -->
		<!-- 	<uni-table
			data
			>
				
				
			</uni-table> -->
		</scroll-view>
		
	</view>
</template>

<script>
	import { getShpOne } from '@/utils/getData.js';
	import { getFakeShpData } from '@/utils/getVectorData';
	import ZsLhTable from '@/components/zs-components/zs-table/ZsLhTable.vue';
	import ZsButtonGroup from '@/components/zs-components/zs-button-group/ZsButtonGroup.vue';
	import SpotItemDetail from './SpotItemDetail.vue';
	import SpotItemReviewSubmit from './SpotItemReviewSubmit.vue';
	import ZsCard from '@/components/zs-components/zs-card/ZsCard.vue';
	import { transformDatas } from '@/utils/dataTransform';
	
	// const columns = ['年度','下发时间','市名称','县名称','监测图斑编号','图斑类型','内业情况','外业情况','备注','地块面积','土地面积','耕地面积','农用地面积','建设用地面积','未利用地面积','永久基本农田面积']
	const columns = [
	{name:"year", title:'年度'},
	{name:"giveoutDate",title:'下发时间'},
	{name:"city",title:'市名称'},
	{name:"county", title:'县名称'},
	{name:"jctbbh",title:'监测图斑编号'},
	{name:"spotDetectClass", title:'图斑类型'},
	{name:"nyqk",title:'内业情况'},
	{name:"spotArea",title:"占地面积"}
	]
	
	// const columns_flat =  ['外业情况','备注','地块面积','土地面积','耕地面积','农用地面积','建设用地面积','未利用地面积','永久基本农田面积']
	
	const _transform_table = {
		giveoutDate:{
			key:"issuedate"
		},
		city:{
			key:"shimc"
		},
		county:{
			key:"tbxzjxzqmc"
		},
		spotDetectClass:{
			key:"tblx",
		},
		spotArea:{
			key:"dkmj",
			value:(v,k,item)=>{
				return v+'亩'
			}
		}
	}
	export default {
		name:"SpotInfoViewPanel",
		props: ['id'],
		components:{
			ZsLhTable,
			ZsButtonGroup,
			SpotItemDetail,
			SpotItemReviewSubmit,
			ZsCard
		},
		data:function() {
			return {
				rftbRows:[],
				rftbColumns:columns,
				// listColumns:['图斑编号','图斑类型','图斑面积'],
				// listData :[],
				// listColumns:columns
				
				rftbBtnItems:[{text:"详情","name":"detail"},{text:'填报', "name":"writeInfo"},{text:"拍照","name":"takePhoto"}],
				
				// right side panel
				rfrightSidePanelVisible:false,
				
				rfrightPanelTabInd:0,
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
			},
			
			onTbOpColClicked(evt, row){
				
				console.log("debug-SpotItemsViewPanel ", evt, row)
				
				const btnKey = evt["btnKey"]
				if(btnKey){
					var ind = this.urftbBtnKeyToInd[btnKey]
					this.rfrightPanelTabInd = ind
				}
				this.rfrightSidePanelVisible = true
			},
			
			hideRightSidePanel(){
				this.rfrightSidePanelVisible=false
			},
			
			
		},
		
		created(){
			
			const urftbBtnKeyToInd = {}
			this.rftbBtnItems.forEach((e,i)=>{urftbBtnKeyToInd[e["name"]] = i})
			this.urftbBtnKeyToInd = urftbBtnKeyToInd
		},
		
		mounted() {
			//获取图斑信息
			// this.getTBInfor();
			this.rftbRows = transformDatas(getFakeShpData().data, _transform_table)
			
			
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
