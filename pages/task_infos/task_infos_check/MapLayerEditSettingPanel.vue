<template>
	<view>
	
		<view style="display: flex;justify-content: space-between;">
			<view>编辑设置</view>
			<SingleMultiCheckGroup
			:mustCheckOne="0"
			@change="onSingleMultiCheckGroupChanged"
			@selectAll="selectAllItem"
			@selectNo="selectNoItem"
			/>
		</view>
		<scroll-view
		style="height:384rpx;"
		scroll-y="true"
		>

			<MapObjLayerCtrlPanel
			hideImg
			disableOp
			selectable
			:selectMode="rfselectMode"
			ref="map-obj-layer"
			>
			</MapObjLayerCtrlPanel>
			
		</scroll-view>

		<view style="display: flex;justify-content: end;">
			<view>
				<button
				@click="onConfirm"
				type="primary"
				size="mini"
				>
					确定
				</button>
				<button
				
				@click="onCancel"
				type="warn"
				size="mini"
				>
					取消
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	
	import {mapMutations} from "vuex"
	import MapObjLayerCtrlPanel from '../../mapViewPage/panels/MapObjLayerCtrlPanel.vue';
	import SingleMultiCheckGroup from "@/components/zs-components/zs-form/ZsSingleMultiCheckForm.vue";
	export default {
		name:"MapLayerEditSettingPanel",
		
		components: {
			// xflSelect,
			// ZsButtonSta2,
			// EditToolbar,
			// ZsTabs,
			// ZsTab,
			MapObjLayerCtrlPanel,
			SingleMultiCheckGroup,
		}, //注册为子组件
		props: {
			
		},
		data() {
			return {

				
				rfselectMode:"single"
			}
		},
		methods: {
			
			// ...mapMutations(
			// 	"modules/map",
			// 	{"setMapUseMode":"setUseMode"}
			// ),
			
		
			onSingleMultiCheckGroupChanged(item){
				if( item["checked"]){
					const index = item["index"]
					this.rfselectMode = index==1?"multi":"single";
				}
			},
			selectAllItem(){
				
				this.$refs["map-obj-layer"].selectAll()
			},
			selectNoItem(){
				this.$refs["map-obj-layer"].selectNothing()
			},
			
			onConfirm(){
				
			},
			onCancel(){
				
			}
		},
		mounted() {
			
		}
	}
</script>

<style lang="scss">
	
</style>
