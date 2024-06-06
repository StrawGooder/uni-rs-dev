<template>

	<scroll-view
	scroll-y="true"
	show-scrollbar="true"
	>
		
		<uni-section
		:type="rfsectType"
		title="vector info"
		>
			<view  :class="rfsecContainerClass">
				<!-- rfvecItems -->
				<!-- computedVecItems -->
				<MapObjListItem 
				v-for="it in rfvecItems"
				:key="it.key"
				v-bind="it"
				@clickButton="onButtonClicked"
				/>			
			</view>
		
		</uni-section>
		<uni-section
		:type="rfsectType"
		title="raster info"
		>
		
		<!-- 	<view :class="rfsecContainerClass">
				<MapObjListItem 
				v-for="it in rfItems"
				:key="it.key"
				v-bind="it"
				/>			
			</view> -->
		
		</uni-section>	
		
	</scroll-view>
	<!-- 
	<view class = "map-obj-list-item">
	
		<uni-section
		:type="rfsectType"
		:title="rfVecSectTitle"
		>
			<view  :class="rfsecContainerClass">
				<MapObjListItem 
				v-for="it in rfItems"
				:key="it.key"
				v-bind="it"
				/>			
			</view>

		</uni-section>
		<uni-section
		:type="rfsectType"
		:title="rfImgSectTitle"
		>
		
			<view :class="rfsecContainerClass">
				<MapObjListItem 
				v-for="it in rfItems"
				:key="it.key"
				v-bind="it"
				/>			
			</view>

		</uni-section>

	</view> -->
	
	<!-- 	<MapObjListItem
		v-for="it in rfItems"
		:key="it.key"
		v-bind="it"
		/> -->
</template>

<script>


import { h, ref, computed, mounted, unMounted } from "vue" ;
import { transformDatas } from "../../../utils/dataTransform";
// import ZsButtonGroup from "../../components/zs-components/zs-button-group/ZsButtonGroup.vue";
// import ZsIcon from "../../components/zs-components/zs-icon/ZsIcon.vue";
// import ZsIconVue from "../../components/zs-components/zs-icon/ZsIcon.vue";
import MapObjListItem from "../MapObjListItem.vue";

import {mapState, mapGetters} from "vuex"

const _item_data_trans_map_table = {
								"text": {"key":"name"},
								"id_":{
									"key":"id",
									"value":(v,k,item)=>{
										if(!v){
											return `${item["name"]}-${item["url"]}`
										}
									}
								},
								"iconColor":{
									"key":"borderColor",
									// "value":(v)=>{
									// 	return v
									// }
								},
								"key":{
									"key":"name"
								},
								"seqid":{
									"key":"layerSeqid"
								},
								"xprops":{
									"value":(v,k,item)=>{
										return item
									}
								}
							}
export default {
	
	name:"MapObjLayerCtrlPanel",
	
	components:{
		MapObjListItem
	},
	
	props:{
		
		text:{
			type:String,
			// required:true
			default:"layer view"
		},
		
		dataSrcType:{
			type:String,
			default:"vector"
		},
		
		dataType:{
			type:String,
			default:"multipolygon"
		},
		
		iconColor:{
			type:String,
			default:"red"
		},
		
		status:{
			type:String,
			default:"normal"
		}
		
	},
	
	data(){
		return {
			rfsectType:"line",
			// rfVecSectTitle:"vector info",
			// rfImgSectTitle:"raster info",
			
			rfcontainerClass:[],
			rfsecContainerClass:["uni-pl-5"],
			// rfBtnItems:[{"text":"eye"},{"text":"eye"}]
			// rfItems:[
			// 	{text:"forest", iconColor:"red"},
			// 	{text:"city", iconColor:"green"},
			// 	{text:"factory", iconColor:"orange"},
			// 	{text:"3line", iconColor:"blue"},
			// 	{text:"farm-land", iconColor:"yellow"}
			// ],
			
			rfvecItems:[
				// {text:"forest", iconColor:"red"},
				// {text:"city", iconColor:"green"},
				// {text:"factory", iconColor:"orange"},
				// {text:"3line", iconColor:"blue"},
				// {text:"farm-land", iconColor:"yellow"}
				
			],
			
			// rfvecItems:{},
			
			rfimgItems:[],
			
			rfUpd:false,
			// rfVecToItem:{},
			// rfImgToItem:{},
		}
	},
	
	computed:{
		
		// ...mapGetters("/modules/map",{
		// 	"computedLayers":"computedLayers"
		// })
		// ...mapState(
		// 	{
		// 		computedVecItems(){
					
		// 			// return this.$mapStore.state.layers
		// 			return transformDatas(this.$mapStore.state.layers, _item_data_trans_map_table)
		// 		},
		// 	}
			
		// )
		// computedVecItems:{
			
		// },
		
		// computedImgItems:{
			
		// }
		
	},
	// computed:mapState({
	// 	computedVecItems:"layers",
	// }),
	
	watch:{
		
		// rfvecItems:{
		// 	handler:function(newVal, oldVal){
				
		// 		console.log("debug-MapObjLayerCtrlPanel watching rfvecItems", newVal)
		// 	},
		// 	deep:true
		// },
		// rfUpd:{
		// 	handler:function(newVal){
		// 		console.log("debug-MapObjLayerCtrlPanel watching 'rfUpd'", newVal)
		// 	},
		// 	immediate:true,
		// 	deep:true
		// }
	},
	
	created(){
		
		uni.$on("createMapLayer", this.addLayerItem)
		// var r = ref(2);
		// console.log(`debug vue version ${Vue.version}`)
		
		// this.urfIdToVecItem = {
			
		// }
		
		// this.urfIdToImgItem = {
			
		// }
		
		// this.rfvecItems = transformDatas(this.$store.state.map.layers, _item_data_trans_map_table)
		// console.log(`debug-mapobj this.rfvecItems`,  this.$store.getters)
		this.rfvecItems = transformDatas( this.$store.getters.computedLayers, _item_data_trans_map_table)
		console.log(`debug-MapObjLayerCtrlPanel rfvecItems`,this.rfvecItems)
		// this.urfItemDataTransMapTable = 
	},
	
	methods:{
	
		addLayerItem(obj, id_field = "id"){
			
			var dataSrcType = obj["dataSourceType"]
			
			var new_obj = transformDatas(obj, _item_data_trans_map_table)
			
			// var id = obj[id_field]
			var id = new_obj["text"]
			
			if(dataSrcType=="vector")
			{
				
				// if(this.urfIdToVecItem[id])
				this.urfIdToVecItem[id] = new_obj
				// this.rfvecItems.push(new_obj)
				// this.rfvecItems = [{"iconColor":"red", "text":"aa"}]
				// this.rfvecItems = [...this.rfvecItems]
				// this.rfvecItems.push(new_obj)
				this.rfvecItems[id] = new_obj
				
				this.$data.rfUpd = !this.rfUpd
				
				console.log("debug-MapObjLayerCtrlPanel ", this.rfvecItems, this.rfUpd)
			}
			else if(dataSrcType=="raster"){
				
				this.urfIdToImgItem[id] = new_obj
				this.rfimgItems.push(new_obj)
			}
			
			// console.log("debug-MapObjLayerCtrlPanel ", obj)
			// this.$forceUpdate()
			
			
		},
		
		removeLayerItem(query){
			
		},
		
		
		removeLayerItemOnSeqid(query){
			
		},
		
		
		
	
		onButtonClicked(ev){
			
			var evData = ev["data"]
			var btnKey = ev["btnKey"]
			
			// var mapObjId = evData["item"]["name"]
			
			var mapObjId = ev["item"]["seqid"]
			
			// if(["shown","hidden","eye"].find(btnKey)>-1)
			console.log("debug-MapObjLayerCtrlPanel ", ev["item"])
			
			var evParamSent = {
				"seqid":mapObjId,
				"id":mapObjId
			}
			
			if(btnKey=="shown")
			{
				
				evParamSent["enabled"] = evData["enabled"]
				
				uni.$emit("showMapLayer",  evParamSent )
			}
			// else
			// {
			// 	this.$emit("clickItem", {"seqid": mapObjId})
			// }
			
		}
		
	},

}
	
</script>

<style>
	
	.map-obj-list-item{
		/* color:yellow */
	}
	

	
</style>