<template>
    
    <view>
		<ZsGeoLocationSelectGroup
		@change = "onGeoLocationSelectFormChanged"
		/>
		
		<!-- valueKey is id key -->
		<ZsNextTree
		uiMode="page"
		funcMode="display"
		valueKey="cityCode"
		
		:treeData = "rfGeoLocationData"
		:selectParent="rfSelectParent"
		@dblclickTreeItem = "handleTreeItemEndDblClicked"
		>
			<template
			#item-end="slotProps"
			>
				
				<ZsButtonGroup
				v-if="slotProps.data.isDblclicked"
				:items = "rfTreeItemEndBtns"
				
				>
				
				<!-- @click.stop = "handleTreeItemEndDbClicked" -->
					
				</ZsButtonGroup>
				
			</template>
		</ZsNextTree>
		
    </view>
    
</template>

<script type="text/javascript">

import Vue from 'vue';
import ZsGeoLocationSelectGroup from '../../../components/zs-components/zs-select/ZsGeoLocationSelectGroup.vue';
import ZsNextTree from '../../../components/zs-components/zs-tree/zs-next-tree/ZsNextTree.vue';
import ZsButtonGroup from '../../../components/zs-components/zs-button-group/ZsButtonGroup.vue';
import { transformDatas } from '../../../utils/dataTransform';

const geo_loc_data = [
	
	{id:"1", label:"青秀区",
		
		children:[
			{id:"1-1", label:"a"}
		]
	},
	{id:"2", label:"江南区"},
	{id:"3", label:"兴宁区"},
	{id:"4", label:"衡州市"},
	{id:"5", label:"马山县"},
	{id:"6", label:"隆安县"},
	{id:"7", label:"上林县"},
	{id:"8", label:"宾阳县"},
	{id:"9", label:"良庆区"},
	{id:"10", label:"邕宁区"},
	{id:"11", label:"江南区"},
	
]

const _geoloc_to_treedata_table = {
	"label":{
		"key":"name",
		
	},
	"geoExtent":{
		"key":"bound",
		"value":(v,k, item)=>{
			return v.split(",").map((elem,)=>{return elem*1.})
		}
	},
	"geoCenter":{
		"key":"lat",
		"value":(v, k, item)=>{
			// return [item["lnt"],item["lat"]]
			// var extent = item["bound"].split(",")
			var extent = item["geoExtent"]
			
			var coord = [(extent[0]+extent[2])/2, (extent[1]+extent[3])/2]
				
			// console.log("debug-spaQueryPanel ", extent, [item["lnt"],item["lat"]])
			return coord
		}
	}
}

function getGeoToTreedataMap(){
	
}


export default {
    
    name:"SpatialQueryPanel",

    props:{

    },

    components:{
		
		ZsGeoLocationSelectGroup,
		ZsNextTree,
		ZsButtonGroup
	},

    mixins:[],

    data(){

        var props = this.$props
        
        return {
			
			rfGeoLocationData : geo_loc_data,
			rfSelectParent: false,
			
			rfTreeItemEndBtns : [
				{"icon":"crosshair2", "color":"red"}, 
				// {"icon":"refresh", "color":"green"},
			]
        }
    },

    computed:{
		
		// cmptTreeItemEndBtn:{
		// 	get:fu
		// }
    },

    created(){
		
		
    },

    methods:{

		onGeoLocationSelectFormChanged(ev){

			var ev_data = ev["data"]
			console.log("debug-SpatialQueryPanel ", ev_data)
			var _this = this

			var root_url = "/static/map/locations/nations/china"
			var sub_url = `/广西壮族自治区-${ev_data["value"]}-县区.json`
			var final_url = root_url + sub_url
			
			// function transformDatas(){
				
			// }
			
			if(ev_data["level"]==3)
			{
				uni.request(
					{
						url:final_url,
						method:"get"
					}
				)
				.then(
					(result)=>{
						
						var data = result[1].data["data"]
						
						var new_data = transformDatas(data, _geoloc_to_treedata_table, {"ignoredKeys":["child"]})
						// var coord = [data["lnt"],data["lat"]]
						// var extent =
						console.log("debug-spa-query-panel ", new_data)
						uni.$emit(
							"locateMapViewportTo",
							{
								// "geoCoord":child_data["geoCenter"],
								// "geoExtent":child_data["geoExtent"]
								"geoCoord": new_data[0]["geoCenter"],
								"geoExtent": new_data[0]["geoExtent"]
							}
						)
						
						var child_data = transformDatas(
													data[0]["child"], 
													_geoloc_to_treedata_table
													)
						// console.log("debug-SpatialQueryPanel ", new_data, ev_data)
						
						_this.rfGeoLocationData = child_data
						
					}
				)
			}
			// console.log("debug-select ", ev_data)
		},
		
		changeGeoLocation(){
			
		},
		
		changeTreeItemEndStatus(data){
			
			var color = "black"
			// var btn_items = [
			// 		{"color":color, "icon":"crosshair2"}
			// 	]
			if(data.isClicked)
			{
				color = "red"
			}
			
			return [
					{"color":color, "icon":"crosshair2"}
				]
		},
		
		handleTreeItemEndDblClicked(evt){
			
			// temp process
			var data = evt.data
			var source_data = evt.data["source"]
			// var target_loc_name = data["label"]
			
			// var xian_geo_loc_data = this._geo_loc_data["南宁市"]
			
			// var found_i = -1
			// for(var i in xian_geo_loc_data)
			// {
			// 	if (target_loc_name == xian_geo_loc_data[i]["name"] )
			// 	{
			// 		found_i = i
			// 		break;
			// 	}
			// }
			// if(found_i<0) return
			
			// this.$emit("navGeoLocTo", {data: xian_geo_loc_data[i]})
			console.log("debug-spatial-query-panel", source_data["cityCode"], data["id"])
			uni.$emit(
				"locateMapViewportTo",
				{
					// "geoCoord":child_data["geoCenter"],
					// "geoExtent":child_data["geoExtent"]
					"geoCoord": source_data["geoCenter"],
					"geoExtent": source_data["geoExtent"]
				}
			)	
		}
    },

    // render(h){

    //     var retVn = h("div")
    //     return retVn
    // },

    mounted(){
		
		// this._geo_loc_data = {
		// 	"南宁":null
		// }
		// var _this = this
		// var geo_loc_data = "广西-南宁市-县区-geo-location.json"
		// uni.request({
		// 	url:"/static/map/locations/"+geo_loc_data
		// })
		// .then(
		// 	(data)=>{
		// 		var resp = data[1]
		// 		// console.log("debug-spatialq geo location", resp)
		// 		var data = resp.data["data"][0]["child"][0]
		// 		console.log("debug-spatialq geo location", data)
				
		// 		_this._geo_loc_data["南宁"] = resp.data["data"][0]["child"]
		// })
		
		
		
    },

    beforeDestroy(){

    }

};

</script>

<style>
/* 
    your CSS

    or use '@import "/path/package/you.css"'
    import the third library css files
*/
</style>