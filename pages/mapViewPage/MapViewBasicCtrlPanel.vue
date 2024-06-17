<template>
    
	<view
	>
		<ZsTabs
		:type="rftabName"
		:value="rfcurTabInd"
		:ref = "rftabRefName"
		>
		<!-- 	<view
			>
				<ZsTab
				label="图层" 
				:name="makeupTabKey('layer')"
				>
					<MapObjLayerCtrlPanel>
						
					</MapObjLayerCtrlPanel>
				</ZsTab>	
				<ZsTab 
				label="图层2" 
				:name="makeupTabKey('layer2')"
				>
					<view>
						layer2
					</view>
				</ZsTab>
			</view> -->
			<!-- style="width:50%;height:25%" -->
			<template
			#tab-bar="slotProps"
			>
				<MapViewBasicToolbar
				enableMutex
				@click="onTabItemClicked"
				>
					
				</MapViewBasicToolbar>
			</template>
			
			<template v-if="rfvisible">
			<scroll-view
			style="width:50%;height:50%;"
			scroll-x="true"
			scroll-y="true"
			>	
				<!-- <template #tab-bar-item
				v-bind:data= "scopedSlots.props"
				>
					
				</template> -->
				
				<view
				style="width:512rpx;height: 256rpx;"
				>
					
					<ZsTab
					label="图层" 
					:name="makeupTabKey('layer')"
					>
						<MapObjLayerCtrlPanel>
							
						</MapObjLayerCtrlPanel>
					</ZsTab>	
					<ZsTab 
					label="图层2" 
					:name="makeupTabKey('layer2')"
					>
						<view>
							layer2
						</view>
					</ZsTab>	
				<!-- 	<ZsTab
					label="图层3" 
					:name="makeupTabKey('layer3')"
					>
						<view>
							layer3
						</view>
					</ZsTab> -->
				</view>
				
			</scroll-view>	
				
				
			</template>
			

		</ZsTabs>
		
	</view>
    
</template>

<script type="text/javascript">

import Vue from 'vue';
import ZsTabs from '../../components/zs-components/zs-tabs-v/ZsTabs.vue';
import ZsTab from '../../components/zs-components/zs-tabs-v/ZsTab.vue';
import MapObjLayerCtrlPanel from './panels/MapObjLayerCtrlPanel.vue';
import MapViewBasicToolbar from "./MapViewBasicToolbar.vue"

export default {
    
    name:"MapViewBasicCtrlPanel",

    props:{

    },

    components:{
		ZsTabs, 
		ZsTab, 
		MapObjLayerCtrlPanel,
		MapViewBasicToolbar
	},

    mixins:[],

    data(){

        var props = this.$props
        
		return {
			rftabName:"mvbcp",
			rfcurTabInd:0,
			// rfcurTabInd:2,
			rftabRefName:"tabs",
			rfvisible:true
		}
    },

    computed:{

    },

    created(){

		this.urftabKeyToInd = {
			"layer":0,
			"largen":1,
			"lessen":2,
			"question":3
		}
    },

    methods:{

		makeupTabKey(name){
			
			return `${this.rftabName}_${name}`
		},
		
		switchTabTo(name){
			
			// this.rfcurTabInd = this.crtTabKeyToInd[name]
			var ind = this.urftabKeyToInd[name]
			// console.log("debug-mvbp tab", this.rfcurTabInd)
			// this.$forceUpdate()
			
			
			this.$refs[this.rftabRefName].switchTab(ind)
		},
		
		onTabItemClicked(evt){
			
			var btnKey = evt["btnKey"]
			var evtData = evt["data"]
			
			console.log("debug-MapViewBasicCtrlPanel ", evt)
			
			var enabled = evtData["enabled"]
			// if(enabled){
			// 	this.$refs[this.rftabRefName].setPanelVisible(ind)
			// }
			
			
			if(enabled)
			{
				if(btnKey=='layer'){
					this.rfvisible = enabled
					// this.$refs[this.rftabRefName].setPanelVisible(enabled)
				}		
				else{
					this.rfvisible = false
				}
			}
			else{
				this.rfvisible = enabled
			}
			// this.rfvisible = enabled
			// this.$refs[this.rftabRefName].setPanelVisible(enabled)
			// this.switchTabTo(btnKey)
			
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