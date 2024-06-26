<template>
	<view>
	
		<scroll-view 
		scroll-y 
		style="height: 384rpx;"
		>

	<!-- 		<view style="width: 80%; margin: auto; margin-bottom: 20px;">
				<xfl-select :list="list" :clearable="false" :showItemNum="10" :listShow="false" :isCanInput="false"
					:style_Container="'height: 30px; font-size: 16px;'" :placeholder="'placeholder'"
					:initValue="'选择分析的图斑'" :selectHideType="'hideAll'" v-model="list[0]" @change="change">

			 </xfl-select>
			</view> -->
			<!-- </uni-list> -->

		<!-- 	<view
			class="zs-hlyt"
			>
				<EditToolbar>
					
				</EditToolbar>
				
			</view> -->
			
			<ZsTabs
			:type="rftabId"
			:value="0"
			>
				<template
				#tab-bar
				>
					<EditToolbar>
						
					</EditToolbar>
				</template>
				<ZsTab
				:name="makeTabKey('editOption')"
				label="editOption"
				>
					<!-- <view>
						aaa
					</view> -->
					
					<view style="display: flex;justify-content: end;">
						<SingleMultiCheckGroup
						@change="onSingleMultiCheckGroupChanged"
						
						/>
					</view>
					<MapObjLayerCtrlPanel
					
					hideImg
					disableOp
					selectable
					:selectMode="rfselectMode"
					>
						
					</MapObjLayerCtrlPanel>
				</ZsTab>
				
			</ZsTabs>
		</scroll-view>
	
	</view>
</template>

<script>
	import {
		getShpOne
	} from '@/utils/getData.js';
	import xflSelect from '@/components/xfl-select/xfl-select.vue'; //导入
	import ZsButtonSta2 from "@/components/zs-components/zs-button-group/ZsButtonSta2.vue"
	import EditToolbar from '@/pages/mapViewPage/buttonGroup/EditToolbar.vue';
	import ZsTab from '@/components/zs-components/zs-tabs/ZsTab.vue';
	import ZsTabs from '@/components/zs-components/zs-tabs/ZsTabs.vue';
	import MapObjLayerCtrlPanel from '../../mapViewPage/panels/MapObjLayerCtrlPanel.vue';
	import SingleMultiCheckGroup from "@/components/zs-components/zs-form/ZsSingleMultiCheckForm.vue"
	import {mapMutations} from "vuex"
	
	export default {
		name:"MapEditCtrlPanel",
		
		components: {
			xflSelect,
			ZsButtonSta2,
			EditToolbar,
			ZsTabs,
			ZsTab,
			MapObjLayerCtrlPanel,
			SingleMultiCheckGroup,
		}, //注册为子组件
		props: ['id'],
		data() {
			return {
				// listColumns:['图斑编号','图斑类型','图斑面积'],
				device: '',
				list: [], //要展示的数据	,
				
				drawStyleDataList:["base", "metric"],
				
				rftabId:"tabMapCtrl",
				
				rfselectMode:"single"
			}
		},
		methods: {
			
			// ...mapMutations(
			// 	"modules/map",
			// 	{"setMapUseMode":"setUseMode"}
			// ),
			
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
			},
			
			onBtnGroupClick(ev){
				
				var btnKey = ev["btnKey"]
				var evData = ev["data"]
				
				if(btnKey=="edit")
				{
					var enabled = evData["enabled"]
					// uni.$emit("map::openDrawInteraction", )
					// this.$store.setUseMode("")
					// this.$store.setUseMode("")
					// this.setMapUseMode(enabled?"edit":"view")
					// uni.$emit("map:setProps", {"usedMode":enabled})
					uni.$emit("map::setProps", {"usedMode":enabled})
				}
				
			},
			
			changeEditStyle(event){
				
				var val = event["newVal"]
				uni.$emit("map::setProps", {"drawTheme":val})
				// console.log("debug-spaanal ", val)
			},
			
			makeTabKey(name){
				return this.rftabId+"_"+name
			},
			
			onSingleMultiCheckGroupChanged(item){
				if( item["checked"]){
					const index = item["index"]
					this.rfselectMode = index==1?"single":"multi";
				}
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
