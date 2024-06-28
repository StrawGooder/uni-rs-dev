<template>
    
	<uni-popup
	ref="modal"
	>
			<!-- <ZsTabs
			:type="rftabId"
			:value="0"
			
			ref="tabs"
			>
				<template
				#tab-bar
				>
					<view></view>
				</template>
				<ZsTab
				:name="makeTabKey('editOption')"
				label="editOption"
				>
			
					<MapLayerEditSettingPanel/>
				</ZsTab>
				<ZsTab
				:name="makeTabKey('createLayer')"
				label="layer creation"
				>
					<MapVectorLayerCreatePanel/>
					
				</ZsTab>
				
			</ZsTabs> -->
		<MapVectorLayerCreatePanel/>
	</uni-popup>
	
</template>

<script type="text/javascript">

import Vue from 'vue';

import ZsTabs from '../../../components/zs-components/zs-tabs/ZsTabs.vue';
import ZsTab from '../../../components/zs-components/zs-tabs/ZsTab.vue';
import MapLayerEditSettingPanel from './MapLayerEditSettingPanel.vue';
import MapVectorLayerCreatePanel from './MapVectorLayerCreatePanel.vue';

export default {
    
    name:"MapPopupPanel",

    props:{
		name:{
			type:String,
			default:"map"
		}
    },

    components:{
		ZsTabs,
		ZsTab,
		MapLayerEditSettingPanel,
		MapVectorLayerCreatePanel,
		
	},

    mixins:[],

    data(){

        var props = this.$props
        
        return {
				rftabId:"tabMapCtrl",
				rfselectMode:"single"
        }
    },

    computed:{

    },

    created(){

		uni.$on(`umodal:open:${this.name}`, this.openUni_)
		uni.$on(`umodal:close:${this.name}`, this.closeUni_)
		
		this.urfcurTabKey = "editOption"
    },

    methods:{


		makeTabKey(name){
			return this.rftabId+"_"+name
		},
		
		open(){
			this.$refs["modal"].open()
		},
		
		close(){
			this.$refs["modal"].close()
		},
		
		openUni_(callArgs){
			
			callArgs = callArgs || {sender:"unset", caller:"unset"}
			
			var toTabKey = callArgs["tabKey"] || "null"
			this.open()
			setTimeout(()=>{
					this.$refs[toTabKey].switchTab(toTabKey)
			}, 1000)
			
		},
		
		closeUni_(callArgs){
			callArgs = callArgs || {sender:"unset", caller:"unset"}
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