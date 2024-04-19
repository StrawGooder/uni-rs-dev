<template>
	
	<view>
		<custom-tabs
		:type="rfTabName"
		:value="rfCurTabInd"
		>
			<custom-tab-pane 
			label="图层" 
			:name="makeupTabKey('layer')">
				<MapObjLayerCtrlPanel>
					
				</MapObjLayerCtrlPanel>
			</custom-tab-pane>
			
		<!-- 	<custom-tab-pane
			label="数据分析"
			:name="makeupTabKey('analy')"
			>
				<DataAnalyPanel>
					
				</DataAnalyPanel>
			</custom-tab-pane> -->
			<custom-tab-pane
			label="空间分析"
			:name="makeupTabKey('spatialAnaly')"
			>
				<SpatialAnalyPanel>
					
				</SpatialAnalyPanel>
			</custom-tab-pane>
			<custom-tab-pane
			label="数据采集"
			:name="makeupTabKey('dataCollection')"
			>
		<!-- 		<OutdoorDataCollectionPanel
				:imageList="imagelist"
				:get_map_data="get_map_data"
				:set_graphphone_status="set_graphphone_status" 
				:tbbh="tbbh"
				:investigationStatus="investigationStatus"
				>
					
				</OutdoorDataCollectionPanel> -->
			</custom-tab-pane>
			
		</custom-tabs>
		
	</view>

</template>

<script type="text/javascript">

import Vue from 'vue';

// import MapObjLayerCtrlPanel from './MapObjLayerCtrlPanel.vue';
import MapObjLayerCtrlPanel from './panels/MapObjLayerCtrlPanel.vue';
import OutdoorDataCollectionPanel from './panels/OutdoorDataCollectionPanel.vue';
import SpatialAnalyPanel from "./panels/SpatialAnalyPanel.vue";
// import DataAnalyPanel from './panels/DataAnalyPanel.vue';

// import OutdoorDataCollectionPanel from '@/components/custom-tab-check/custom-tab-check-chooseimage.vue';
// import DataAnalyPanel from "@/components/custom-tab-check/custom-tab-check-analy.vue";


export default {
    
    name:"MapViewBottomPanel",

    props:{

    },

    components:{
		MapObjLayerCtrlPanel,
		OutdoorDataCollectionPanel,
		// DataAnalyPanel,
		SpatialAnalyPanel,
		
	},

    mixins:[],

    data(){

        var props = this.$props
        
        return {
			rfTabName:"mvbt",
			rfCurTabInd:0
        }
    },

    computed:{

    },

    created(){
		
		
		var tabName = `$change_tab_${this.rfTabName}`
		uni.$off(tabName)
		uni.$on(
			tabName, 
			(ev)=>{
				
			}
		)
		
    },

    methods:{

		makeupTabKey(name){
			
			return `${this.rfTabName}_${name}`
		}
    },

    // render(h){

    //     var retVn = h("div")
    //     return retVn
    // },

    mounted(){

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