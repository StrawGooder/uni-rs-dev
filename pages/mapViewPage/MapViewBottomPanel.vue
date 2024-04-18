<template>
	
	<view>
		<custom-tabs
		type="bottom"
		:value="0"
		>
			<custom-tab-pane 
			label="图层" 
			name="bottom_layer">
				<MapObjViewCtrlPanel>
					
				</MapObjViewCtrlPanel>
			</custom-tab-pane>
			
			<custom-tab-pane
			label="分析"
			name="bottom_analysis"
			>
				
			</custom-tab-pane>
			
		</custom-tabs>
		
	
	</view>

</template>

<script type="text/javascript">

import Vue from 'vue';

// import MapObjViewCtrlPanel from './MapObjViewCtrlPanel.vue';
import MapObjViewCtrlPanel from './bottom-tabs/MapObjViewCtrlPanel.vue';

export default {
    
    name:"MapViewBottomPanel",

    props:{

    },

    components:{
		MapObjViewCtrlPanel
		
	},

    mixins:[],

    data(){

        var props = this.$props
        
        return {

        }
    },

    computed:{

    },

    created(){

    },

    methods:{

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