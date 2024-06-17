<template>
	
	<view>
		<ZsTabs
		:type="rfTabName"
		:value="rfCurTabInd"
		:ref = "rfTabRefName"
		>
			<ZsTab 
			label="图层" 
			:name="makeupTabKey('layer')"
			>
				<MapObjLayerCtrlPanel>
					
				</MapObjLayerCtrlPanel>
			</ZsTab>
			
		<!-- 	<ZsTab
			label="数据分析"
			:name="makeupTabKey('analy')"
			>
				<DataAnalyPanel>
					
				</DataAnalyPanel>
			</ZsTab> -->
			<ZsTab
			label="空间分析"
			:name="makeupTabKey('spatialAnaly')"
			>
				<SpatialAnalyPanel>
					
				</SpatialAnalyPanel>
			</ZsTab>
			<ZsTab
			label="空间查询"
			:name="makeupTabKey('spatialQuery')"
			>
				<SpatialQueryPanel>
					
				</SpatialQueryPanel>
				
			</ZsTab>
			<ZsTab
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
			</ZsTab>
			
		</ZsTabs>
		
	</view>

</template>

<script type="text/javascript">

import Vue from 'vue';

import ZsTabs from '../../components/zs-components/zs-tabs/ZsTabs.vue';
import ZsTab from '../../components/zs-components/zs-tabs/ZsTab.vue';
// import MapObjLayerCtrlPanel from './MapObjLayerCtrlPanel.vue';
import MapObjLayerCtrlPanel from './panels/MapObjLayerCtrlPanel.vue';
import OutdoorDataCollectionPanel from './panels/OutdoorDataCollectionPanel.vue';
import SpatialAnalyPanel from "./panels/SpatialAnalyPanel.vue";
import SpatialQueryPanel from './panels/SpatialQueryPanel.vue';
// import DataAnalyPanel from './panels/DataAnalyPanel.vue';

// import OutdoorDataCollectionPanel from '@/components/custom-tab-check/custom-tab-check-chooseimage.vue';
// import DataAnalyPanel from "@/components/custom-tab-check/custom-tab-check-analy.vue";


export default {
    
    name:"MapViewBottomPanel",

    props:{

    },

    components:{
		ZsTabs,
		ZsTab,
		MapObjLayerCtrlPanel,
		OutdoorDataCollectionPanel,
		// DataAnalyPanel,
		SpatialAnalyPanel,
		SpatialQueryPanel
		
	},

    mixins:[],

    data(){

        var props = this.$props
        
        return {
			rfTabName:"mvbt",
			rfCurTabInd:1,
			// rfCurTabInd:2,
			rfTabRefName:"tabs"
        }
    },

    computed:{

    },

    created(){
		
		
		// var tabName = `$change_tab_${this.rfTabName}`
		// uni.$off(tabName)
		// uni.$on(
		// 	tabName, 
		// 	(ev)=>{
				
		// 	}
		// )
		
		this.crtTabKeyToInd = {
			"layer":0,
			"spatialAnaly":1,
			"dataCollection":2
		}
		
    },

    methods:{

		makeupTabKey(name){
			
			return `${this.rfTabName}_${name}`
		},
		
		switchTabTo(name){
			
			// this.rfCurTabInd = this.crtTabKeyToInd[name]
			var ind = this.crtTabKeyToInd[name]
			// console.log("debug-mvbp tab", this.rfCurTabInd)
			// this.$forceUpdate()
			
			this.$refs[this.rfTabRefName].switchTab(ind)
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