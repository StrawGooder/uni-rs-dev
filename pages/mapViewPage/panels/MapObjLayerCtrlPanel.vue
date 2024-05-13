<template>

	<scroll-view
	scroll-y="true"
	show-scrollbar="true"
	>
		
		<uni-section
		:type="rfSectType"
		title="vector info"
		>
			<view  :class="rfSecContainerClass">
				<MapObjListItem 
				v-for="it in rfVecItems"
				:key="it.key"
				v-bind="it"
				@click="onClicked"
				/>			
			</view>
		
		</uni-section>
		<uni-section
		:type="rfSectType"
		title="raster info"
		>
		
			<view :class="rfSecContainerClass">
				<MapObjListItem 
				v-for="it in rfItems"
				:key="it.key"
				v-bind="it"
				/>			
			</view>
		
		</uni-section>	
		
	</scroll-view>
	<!-- 
	<view class = "map-obj-list-item">
	
		<uni-section
		:type="rfSectType"
		:title="rfVecSectTitle"
		>
			<view  :class="rfSecContainerClass">
				<MapObjListItem 
				v-for="it in rfItems"
				:key="it.key"
				v-bind="it"
				/>			
			</view>

		</uni-section>
		<uni-section
		:type="rfSectType"
		:title="rfImgSectTitle"
		>
		
			<view :class="rfSecContainerClass">
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
			rfSectType:"line",
			// rfVecSectTitle:"vector info",
			// rfImgSectTitle:"raster info",
			
			rfContainerClass:[],
			rfSecContainerClass:["uni-pl-5"],
			// rfBtnItems:[{"text":"eye"},{"text":"eye"}]
			rfItems:[
				{text:"forest", iconColor:"red"},
				{text:"city", iconColor:"green"},
				{text:"factory", iconColor:"orange"},
				{text:"3line", iconColor:"blue"},
				{text:"farm-land", iconColor:"yellow"}
			],
			
			rfVecItems:[
				// {text:"forest", iconColor:"red"},
				// {text:"city", iconColor:"green"},
				// {text:"factory", iconColor:"orange"},
				// {text:"3line", iconColor:"blue"},
				// {text:"farm-land", iconColor:"yellow"}
				
			],
			rfImgItems:[],
			
			// rfVecToItem:{},
			// rfImgToItem:{},
		}
	},
	
	computed:{
		
		// computedVecItems:{
			
		// },
		
		// computedImgItems:{
			
		// }
		
	},
	
	created(){
		
		uni.$on("createMapLayer", this.addLayerItem)
		// var r = ref(2);
		// console.log(`debug vue version ${Vue.version}`)
		
		this.urfIdToVecItem = {
			
		}
		
		this.urfIdToImgItem = {
			
		}
		
		// this.urfItemDataTransMapTable = 
	},
	
	methods:{
	
		addLayerItem(obj, id_field = "id"){
			
			var dataSrcType = obj["dataSourceType"]
			
			var new_obj = transformDatas(obj, _item_data_trans_map_table)
			
			var id = obj[id_field]
			
			if(dataSrcType=="vector"){
				
				// if(this.urfIdToVecItem[id])
				this.urfIdToVecItem[id] = new_obj
				this.rfVecItems.push(new_obj)
				// this.rfVecItems = [...this.rfVecItems]
				// this.rfVecItems.push(new_obj)
				console.log("debug-MapObjLayerCtrlPanel ", this.rfVecItems)
			}
			else if(dataSrcType=="raster"){
				
				this.urfIdToImgItem[id] = new_obj
				this.rfImgItems.push(new_obj)
			}
			
			// console.log("debug-MapObjLayerCtrlPanel ", obj)
			// this.$forceUpdate()
			
			
		},
		
		removeLayerItem(query){
			
		},
		
		
		removeLayerItemOnSeqid(query){
			
		},
		
		
		
	
		onClicked(ev){
			
			var ev_data = ev["data"]
			var btnKey = ev_data["btnKey"]
			
			var mapObjId = ev_data["item"]["name"]
			
			if(["shown","eye"].find(btnKey)>-1)
			{
				// if( ev_data["enabled"] )
				// {
				// 	this.$emit("show",  {"id": mapObjId })
				// }
				
				this.$emit("show",  {"id": mapObjId, "enabled": ev_data["enabled"]})
			}
			else
			{
				this.$emit("clickItem", {"id": mapObjId})
			}
			
		}
		
	},

}
	
</script>

<style>
	
	.map-obj-list-item{
		/* color:yellow */
	}
	

	
</style>